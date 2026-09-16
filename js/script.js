/* =========================
   GEN.Z GADGETS
   Main JavaScript - Firebase Version
========================= */

let cartCount = 0;
let productQuantity = 1;
let currentProducts = [];
let currentFilter = null;
let searchTimeout = null;
let allProductsCache = [];

// ===== Firebase helper =====
function waitForFirebase(callback) {
    if (window.firebaseDB) {
        callback();
    } else {
        setTimeout(function() { waitForFirebase(callback); }, 100);
    }
}

// ===== Fetch All Reviews =====
async function fetchAllReviews() {
    return new Promise(function(resolve) {
        waitForFirebase(async function() {
            try {
                const { db, collection, getDocs } = window.firebaseDB;
                const snapshot = await getDocs(collection(db, 'reviews'));
                const reviews = [];
                snapshot.forEach(function(doc) {
                    reviews.push(doc.data());
                });
                resolve(reviews);
            } catch (error) {
                console.error('Reviews fetch error:', error);
                resolve([]);
            }
        });
    });
}

// ===== Calculate Product Rating =====
function calculateProductRating(productId, allReviews) {
    const productReviews = allReviews.filter(function(r) {
        return String(r.productId) === String(productId);
    });
    if (productReviews.length === 0) {
        return { avg: 0, count: 0, stars: '☆☆☆☆☆' };
    }
    let total = 0;
    productReviews.forEach(function(r) { total += r.rating; });
    const avg = Math.round(total / productReviews.length);
    const stars = '★'.repeat(avg) + '☆'.repeat(5 - avg);
    return { avg: avg, count: productReviews.length, stars: stars };
}

// ===== Update Cart Badge =====
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('genzCart')) || [];
    const totalItems = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    const cartElement = document.getElementById('cartCount');
    if (cartElement) cartElement.textContent = totalItems;
    cartCount = totalItems;
}

// ===== Update Wishlist Badge =====
function updateWishlistBadge() {
    const wishlist = JSON.parse(localStorage.getItem('genzWishlist')) || [];
    const badge = document.getElementById('wishlistCount');
    if (badge) {
        badge.textContent = wishlist.length;
        if (wishlist.length > 0) badge.classList.add('show');
        else badge.classList.remove('show');
    }
}

// ===== Render Product Card =====
function renderProductCard(product, productsGrid, allReviews) {
    const oldPriceHTML = product.oldPrice ? '<del>Rs. ' + product.oldPrice.toLocaleString() + '</del>' : '';
    const badgeHTML = product.badge ? '<span class="sale-badge">' + product.badge + '</span>' : '';

    const ratingData = calculateProductRating(product.id, allReviews);

    let ratingHTML;
    if (ratingData.count > 0) {
        ratingHTML = '<div class="rating">' + ratingData.stars + ' <span>(' + ratingData.count + ')</span></div>';
    } else {
        ratingHTML = '<div class="rating" style="color:#cbd5e1;">☆☆☆☆☆ <span>(0)</span></div>';
    }

    const wishlist = JSON.parse(localStorage.getItem('genzWishlist')) || [];
    const isWishlisted = wishlist.indexOf(product.id) !== -1;

    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.style.cursor = 'pointer';
    productCard.style.position = 'relative';

    let imageHTML;
    if (product.image && product.image.indexOf('http') === 0) {
        imageHTML = '<img src="' + product.image + '" alt="' + product.name + '" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">';
        imageHTML += '<div class="product-placeholder" style="display:none;"><i class="fa-solid ' + (product.icon || 'fa-box') + '"></i></div>';
    } else {
        imageHTML = '<div class="product-placeholder"><i class="fa-solid ' + (product.icon || 'fa-box') + '"></i></div>';
    }

    productCard.innerHTML = '<div class="product-image" style="position:relative;">' + badgeHTML + 
        '<button class="wishlist-btn" onclick="toggleWishlist(event, ' + product.id + ')" style="position:absolute; top:12px; right:12px; width:36px; height:36px; border-radius:50%; background:white; border:none; box-shadow:0 2px 8px rgba(0,0,0,0.15); cursor:pointer; font-size:16px; color:' + (isWishlisted ? '#ef4444' : '#94a3b8') + '; z-index:2;">' +
            '<i class="fa-' + (isWishlisted ? 'solid' : 'regular') + ' fa-heart"></i>' +
        '</button>' +
        imageHTML + '</div>' +
        '<div class="product-info">' +
            '<p class="product-category">' + product.category + '</p>' +
            '<h3>' + product.name + '</h3>' +
            ratingHTML +
            '<div class="price"><strong>Rs. ' + Number(product.price).toLocaleString() + '</strong>' + oldPriceHTML + '</div>' +
            '<button class="add-cart-btn" data-product-id="' + product.id + '"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>' +
        '</div>';

    productCard.addEventListener('click', function(event) {
        if (event.target.closest('.add-cart-btn') || event.target.closest('.wishlist-btn')) return;
        window.location.href = 'product-details.html?id=' + product.id;
    });

    productCard.querySelector('.add-cart-btn').addEventListener('click', function(event) {
        event.stopPropagation();
        addToCart(product.id);
    });

    productsGrid.appendChild(productCard);
}

// ===== Toggle Wishlist =====
function toggleWishlist(event, productId) {
    event.stopPropagation();
    let wishlist = JSON.parse(localStorage.getItem('genzWishlist')) || [];
    const index = wishlist.indexOf(productId);
    const btn = event.target.closest('.wishlist-btn');
    
    if (index === -1) {
        wishlist.push(productId);
        if (btn) {
            btn.style.color = '#ef4444';
            btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }
    } else {
        wishlist.splice(index, 1);
        if (btn) {
            btn.style.color = '#94a3b8';
            btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
    }
    localStorage.setItem('genzWishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
}

// ===== Display Products =====
async function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '<p style="padding:20px; color:#64748b; grid-column:1/-1; text-align:center;">Loading products...</p>';

    const allProducts = await fetchProductsFromServer();
    const activeProducts = allProducts.filter(function(p) { return p.active !== false; });
    currentProducts = activeProducts;
    allProductsCache = activeProducts;

    const allReviews = await fetchAllReviews();

    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) filterStatus.style.display = 'none';
    currentFilter = null;

    productsGrid.innerHTML = '';

    if (activeProducts.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px 0;">' +
            '<p style="font-size:18px; color:#64748b;">No products available right now.</p></div>';
        return;
    }

    activeProducts.forEach(function(product) {
        renderProductCard(product, productsGrid, allReviews);
    });
}

// ===== Live Search =====
function liveSearch(value) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
        if (value.trim() === '') {
            hideAutocomplete();
            displayProducts();
        } else {
            showAutocomplete(value);
            searchProducts();
        }
    }, 250);
}

function showAutocomplete(query) {
    const box = document.getElementById('autocompleteBox');
    if (!box) return;
    
    const q = query.toLowerCase();
    const matches = allProductsCache.filter(function(p) {
        return p.name.toLowerCase().includes(q) || 
               p.category.toLowerCase().includes(q);
    }).slice(0, 5);

    if (matches.length === 0) {
        hideAutocomplete();
        return;
    }

    box.innerHTML = matches.map(function(p) {
        const safeName = p.name.replace(/'/g, "\\'");
        return '<div class="autocomplete-item" onclick="selectAutocomplete(\'' + safeName + '\')">' +
            '<i class="fa-solid fa-magnifying-glass" style="color:#94a3b8;"></i>' +
            '<span>' + p.name + '</span>' +
            '<small>' + p.category + '</small>' +
        '</div>';
    }).join('');
    box.style.display = 'block';
}

function hideAutocomplete() {
    const box = document.getElementById('autocompleteBox');
    if (box) box.style.display = 'none';
}

function selectAutocomplete(productName) {
    const input = document.getElementById('searchInput');
    if (input) input.value = productName;
    hideAutocomplete();
    searchProducts();
}

document.addEventListener('click', function(e) {
    const searchBox = document.querySelector('.search-box');
    if (searchBox && !searchBox.contains(e.target)) {
        hideAutocomplete();
    }
});

// ===== Search Products =====
async function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue === '') {
        displayProducts();
        return;
    }

    const allProducts = await fetchProductsFromServer();
    const filtered = allProducts.filter(function(product) {
        return product.name.toLowerCase().includes(searchValue) ||
               product.category.toLowerCase().includes(searchValue);
    });

    const allReviews = await fetchAllReviews();

    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    productsGrid.innerHTML = '';

    const filterStatus = document.getElementById('filterStatus');
    const filterText = document.getElementById('filterText');
    if (filterStatus && filterText) {
        filterStatus.style.display = 'flex';
        filterText.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Search: <strong>"' + searchValue + '"</strong> (' + filtered.length + ' results)';
    }

    if (filtered.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px 0;">' +
            '<p style="font-size:18px; color:#64748b;">No products found for "' + searchValue + '"</p></div>';
        return;
    }

    filtered.filter(function(p) { return p.active !== false; }).forEach(function(product) {
        renderProductCard(product, productsGrid, allReviews);
    });
}

// ===== Filter by Category =====
async function filterByCategory(categoryName) {
    currentFilter = categoryName;

    const allProducts = await fetchProductsFromServer();
    const filtered = allProducts.filter(function(product) {
        return product.active !== false &&
               product.category.toLowerCase().includes(categoryName.toLowerCase());
    });

    const allReviews = await fetchAllReviews();

    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    productsGrid.innerHTML = '';

    const filterStatus = document.getElementById('filterStatus');
    const filterText = document.getElementById('filterText');
    if (filterStatus && filterText) {
        filterStatus.style.display = 'flex';
        filterText.innerHTML = '<i class="fa-solid fa-filter"></i> Category: <strong>' + categoryName + '</strong> (' + filtered.length + ' products)';
    }

    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (filtered.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px 0;">' +
            '<p style="font-size:18px; color:#64748b;">No products in "' + categoryName + '" category</p></div>';
        return;
    }

    filtered.forEach(function(product) {
        renderProductCard(product, productsGrid, allReviews);
    });
}

// ===== Clear Filter =====
function clearFilter() {
    currentFilter = null;
    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) filterStatus.style.display = 'none';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    displayProducts();
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== Load Categories =====
async function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    try {
        const cats = await new Promise(function(resolve) {
            waitForFirebase(async function() {
                try {
                    const { db, collection, getDocs } = window.firebaseDB;
                    const snapshot = await getDocs(collection(db, 'categories'));
                    const list = [];
                    snapshot.forEach(function(doc) { list.push(doc.data()); });
                    list.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });
                    resolve(list);
                } catch (e) {
                    console.error('Categories fetch error:', e);
                    resolve([]);
                }
            });
        });

        if (cats.length === 0) {
            const defaults = [
                { id: 1, name: 'Phone Cases', description: 'Protect your phone', icon: 'fa-mobile-screen', order: 0 },
                { id: 2, name: 'Chargers', description: 'Fast charging gear', icon: 'fa-bolt', order: 1 },
                { id: 3, name: 'Audio', description: 'Earbuds & headphones', icon: 'fa-headphones', order: 2 },
                { id: 4, name: 'Power Banks', description: 'Power on the go', icon: 'fa-battery-full', order: 3 }
            ];
            renderCategories(defaults);
            return;
        }

        renderCategories(cats);
    } catch (error) {
        console.error('Categories error:', error);
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:30px; color:#94a3b8;">Categories load nahi ho saki</div>';
    }
}

function renderCategories(cats) {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    if (cats.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:30px; color:#94a3b8;">Koi category nahi</div>';
        return;
    }

    grid.innerHTML = cats.map(function(c) {
        const safeName = (c.name || '').replace(/'/g, "\\'");
        return '<div class="category-card" onclick="filterByCategory(\'' + safeName + '\')" style="cursor:pointer;">' +
            '<div class="category-icon"><i class="fa-solid ' + (c.icon || 'fa-box') + '"></i></div>' +
            '<h3>' + c.name + '</h3>' +
            '<p>' + (c.description || '') + '</p>' +
        '</div>';
    }).join('');
}

// ===== Add to Cart =====
async function addToCart(productId) {
    const allProducts = await fetchProductsFromServer();
    const product = allProducts.find(function(item) { return item.id === productId; });
    if (!product) { alert('Product not found!'); return; }
    if (product.stock <= 0) { alert('Out of stock!'); return; }

    let cart = JSON.parse(localStorage.getItem('genzCart')) || [];
    const existing = cart.find(function(item) { return item.id === productId; });

    if (existing) {
        if (existing.quantity >= product.stock) { alert('Not enough stock!'); return; }
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id, name: product.name, price: product.price,
            icon: product.icon || 'fa-box', quantity: 1, maxStock: product.stock
        });
    }

    localStorage.setItem('genzCart', JSON.stringify(cart));
    updateCartBadge();
    alert(product.name + ' added to cart! 🛒');
}

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            hideAutocomplete();
            searchProducts();
        }
    });
}

function changeQuantity(change) {
    const quantityElement = document.getElementById('productQuantity');
    if (!quantityElement) return;
    productQuantity += change;
    if (productQuantity < 1) productQuantity = 1;
    quantityElement.textContent = productQuantity;
}

// ===== Load Product Details =====
async function loadProductDetails() {
    const detailsContainer = document.getElementById('productDetails');
    if (!detailsContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));
    const allProducts = await fetchProductsFromServer();
    const product = allProducts.find(function(item) { return item.id === productId; });

    if (!product) {
        detailsContainer.innerHTML = '<div class="product-not-found">' +
            '<i class="fa-solid fa-box-open"></i>' +
            '<h2>Product Not Found</h2>' +
            '<a href="index.html" class="primary-btn">Back to Store</a></div>';
        return;
    }

    const allReviews = await fetchAllReviews();
    const ratingData = calculateProductRating(product.id, allReviews);

    const oldPriceHTML = product.oldPrice ? '<del>Rs. ' + product.oldPrice.toLocaleString() + '</del>' : '';
    const badgeHTML = product.badge ? '<span class="details-badge">' + product.badge + '</span>' : '';

    let ratingText;
    if (ratingData.count > 0) {
        ratingText = ratingData.avg + '.0 (' + ratingData.count + ' review' + (ratingData.count !== 1 ? 's' : '') + ')';
    } else {
        ratingText = 'No reviews yet';
    }

    let imageHTML;
    if (product.image && product.image.indexOf('http') === 0) {
        imageHTML = '<img src="' + product.image + '" style="width:100%; height:100%; object-fit:cover; border-radius:18px; cursor:zoom-in;" onclick="openImageZoom(this.src)">';
    } else {
        imageHTML = '<div class="details-placeholder"><i class="fa-solid ' + (product.icon || 'fa-box') + '"></i></div>';
    }

    const wishlist = JSON.parse(localStorage.getItem('genzWishlist')) || [];
    const isWishlisted = wishlist.indexOf(product.id) !== -1;

    detailsContainer.innerHTML = '<div class="details-image">' + badgeHTML + imageHTML + '</div>' +
        '<div class="details-info">' +
            '<p class="product-category">' + product.category + '</p>' +
            '<h1>' + product.name + '</h1>' +
            '<div class="details-rating" style="display:flex; align-items:center; gap:10px; margin:15px 0; flex-wrap:wrap;">' +
                '<span style="color:#f59e0b; font-size:20px; letter-spacing:3px;">' + ratingData.stars + '</span>' +
                '<span style="color:#64748b; font-size:14px; font-weight:600;">' + ratingText + '</span>' +
                (ratingData.count > 0 ? '<a href="#productReviewsSection" style="color:#7c3aed; font-size:13px; font-weight:700; text-decoration:none; border-bottom:2px solid #7c3aed; padding-bottom:2px;">See Reviews ↓</a>' : '') +
            '</div>' +
            '<div class="details-price"><strong>Rs. ' + Number(product.price).toLocaleString() + '</strong>' + oldPriceHTML + '</div>' +
            '<p class="details-description">' + (product.description || '') + '</p>' +
            '<div class="stock-status"><i class="fa-solid fa-circle-check"></i> ' +
                (product.stock > 0 ? 'In Stock (' + product.stock + ' available)' : 'Out of Stock') + '</div>' +
            (product.stock > 0 ?
                '<div class="quantity-box">' +
                    '<button onclick="changeQuantity(-1)">−</button>' +
                    '<span id="productQuantity">1</span>' +
                    '<button onclick="changeQuantity(1)">+</button>' +
                '</div>' +
                '<button class="details-cart-btn" onclick="addProductToCart(' + product.id + ')">' +
                    '<i class="fa-solid fa-cart-plus"></i> Add to Cart</button>' +
                '<button class="buy-now-btn" onclick="buyNow(' + product.id + ')">' +
                    '<i class="fa-solid fa-bolt"></i> Buy Now</button>'
                : '<button class="details-cart-btn" disabled>Out of Stock</button>') +
            '<div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">' +
                '<button onclick="toggleWishlistDetail(' + product.id + ')" id="wishlistBtn" style="flex:1; padding:12px; border:2px solid #e2e8f0; border-radius:10px; background:white; cursor:pointer; font-weight:700; font-size:14px; color:' + (isWishlisted ? '#ef4444' : '#64748b') + ';">' +
                    '<i class="fa-' + (isWishlisted ? 'solid' : 'regular') + ' fa-heart"></i> ' + (isWishlisted ? 'Wishlisted' : 'Wishlist') +
                '</button>' +
                '<button onclick="shareProduct(\'' + product.name.replace(/'/g, "\\'") + '\', ' + product.id + ')" style="flex:1; padding:12px; border:2px solid #e2e8f0; border-radius:10px; background:white; cursor:pointer; font-weight:700; font-size:14px; color:#25D366;">' +
                    '<i class="fa-brands fa-whatsapp"></i> Share' +
                '</button>' +
            '</div>' +
            '<div class="product-features">' +
                '<div><i class="fa-solid fa-truck"></i><span>Fast Delivery</span></div>' +
                '<div><i class="fa-solid fa-shield-halved"></i><span>Quality Products</span></div>' +
                '<div><i class="fa-brands fa-whatsapp"></i><span>WhatsApp Support</span></div>' +
            '</div>' +
        '</div>' +
        '<div id="similarProductsSection" style="grid-column:1/-1; margin-top:40px;"></div>' +
        '<div id="imageZoomModal" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.9); z-index:9999; align-items:center; justify-content:center; cursor:zoom-out;" onclick="closeImageZoom()">' +
            '<img id="zoomedImage" style="max-width:90%; max-height:90%; border-radius:12px;" onclick="event.stopPropagation()">' +
            '<button onclick="closeImageZoom()" style="position:absolute; top:20px; right:20px; width:45px; height:45px; border-radius:50%; background:white; border:none; font-size:20px; cursor:pointer; color:#111827;">✕</button>' +
        '</div>';

    loadSimilarProducts(product);
}

function toggleWishlistDetail(productId) {
    let wishlist = JSON.parse(localStorage.getItem('genzWishlist')) || [];
    const index = wishlist.indexOf(productId);
    const btn = document.getElementById('wishlistBtn');
    
    if (index === -1) {
        wishlist.push(productId);
        if (btn) {
            btn.style.color = '#ef4444';
            btn.innerHTML = '<i class="fa-solid fa-heart"></i> Wishlisted';
        }
    } else {
        wishlist.splice(index, 1);
        if (btn) {
            btn.style.color = '#64748b';
            btn.innerHTML = '<i class="fa-regular fa-heart"></i> Wishlist';
        }
    }
    localStorage.setItem('genzWishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
}

function shareProduct(name, id) {
    const url = window.location.origin + '/ash/product-details.html?id=' + id;
    const msg = '🛍️ *' + name + '* dekho GEN.Z GADGETS par!%0A%0A' + url;
    window.open('https://wa.me/?text=' + msg, '_blank');
}

function openImageZoom(src) {
    document.getElementById('zoomedImage').src = src;
    document.getElementById('imageZoomModal').style.display = 'flex';
}

function closeImageZoom() {
    document.getElementById('imageZoomModal').style.display = 'none';
}

// ===== Similar Products =====
async function loadSimilarProducts(currentProduct) {
    const section = document.getElementById('similarProductsSection');
    if (!section) return;

    const allProducts = await fetchProductsFromServer();
    const allReviews = await fetchAllReviews();

    const similar = allProducts.filter(function(p) {
        return p.active !== false &&
               p.id !== currentProduct.id &&
               p.category === currentProduct.category;
    }).slice(0, 4);

    if (similar.length === 0) {
        section.innerHTML = '';
        return;
    }

    section.innerHTML = '<h2 style="font-size:22px; color:#111827; margin-bottom:20px; display:flex; align-items:center; gap:10px;">' +
        '<i class="fa-solid fa-fire" style="color:#f59e0b;"></i> Similar Products' +
        '</h2>' +
        '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:18px;">' +
        similar.map(function(p) {
            const oldPriceHTML = p.oldPrice ? '<del>Rs. ' + p.oldPrice.toLocaleString() + '</del>' : '';
            const ratingData = calculateProductRating(p.id, allReviews);
            const stars = ratingData.count > 0 ? ratingData.stars : '☆☆☆☆☆';
            
            let imgHTML;
            if (p.image && p.image.indexOf('http') === 0) {
                imgHTML = '<img src="' + p.image + '" style="width:100%; height:100%; object-fit:cover;">';
            } else {
                imgHTML = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f1f5f9; color:#7c3aed; font-size:40px;"><i class="fa-solid ' + (p.icon || 'fa-box') + '"></i></div>';
            }

            return '<div onclick="window.location.href=\'product-details.html?id=' + p.id + '\'" style="background:white; border-radius:14px; overflow:hidden; border:1px solid #e2e8f0; cursor:pointer; transition:0.3s;">' +
                '<div style="height:180px; background:#f8fafc; overflow:hidden;">' + imgHTML + '</div>' +
                '<div style="padding:14px;">' +
                    '<p style="font-size:11px; color:#7c3aed; font-weight:700; margin-bottom:4px; text-transform:uppercase;">' + p.category + '</p>' +
                    '<h3 style="font-size:14px; color:#111827; margin-bottom:8px; line-height:1.3;">' + p.name + '</h3>' +
                    '<div style="color:#f59e0b; font-size:13px; margin-bottom:8px;">' + stars + '</div>' +
                    '<div style="font-size:15px; font-weight:800; color:#111827;">Rs. ' + Number(p.price).toLocaleString() + ' ' + oldPriceHTML + '</div>' +
                '</div>' +
            '</div>';
        }).join('') +
        '</div>';
}

// ===== Add Product to Cart (Details) =====
async function addProductToCart(productId) {
    const allProducts = await fetchProductsFromServer();
    const product = allProducts.find(function(item) { return item.id === productId; });
    if (!product || product.stock <= 0) { alert('Out of stock!'); return; }

    const qtyElement = document.getElementById('productQuantity');
    const qty = qtyElement ? parseInt(qtyElement.textContent) : 1;
    let cart = JSON.parse(localStorage.getItem('genzCart')) || [];
    const existing = cart.find(function(item) { return item.id === productId; });

    if (existing) { existing.quantity += qty; }
    else {
        cart.push({
            id: product.id, name: product.name, price: product.price,
            icon: product.icon || 'fa-box', quantity: qty, maxStock: product.stock
        });
    }

    localStorage.setItem('genzCart', JSON.stringify(cart));
    updateCartBadge();
    alert(qty + ' × ' + product.name + ' added to cart!');
}

async function buyNow(productId) {
    await addProductToCart(productId);
    window.location.href = 'checkout.html';
}

function goToHomeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) { window.location.href = 'index.html'; return; }
    const searchValue = searchInput.value.trim();
    if (!searchValue) { window.location.href = 'index.html'; return; }
    window.location.href = 'index.html?search=' + encodeURIComponent(searchValue);
}

// ===== START =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 GEN.Z GADGETS starting...');
    updateCartBadge();
    updateWishlistBadge();
    await loadCategories();
    await displayProducts();
    await loadProductDetails();
    console.log('✅ GEN.Z GADGETS loaded!');
});
