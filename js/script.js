/* =========================
   GEN.Z GADGETS
   Main JavaScript - JSONBin Version
========================= */

let cartCount = 0;
let productQuantity = 1;
let currentProducts = [];

/* =========================
   UPDATE CART BADGE
========================= */
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('genzCart')) || [];
    const totalItems = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    const cartElement = document.getElementById('cartCount');
    if (cartElement) cartElement.textContent = totalItems;
    cartCount = totalItems;
}

/* =========================
   DISPLAY PRODUCTS (async)
========================= */
async function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '<p style="padding:20px; color:#64748b;">Loading products...</p>';

    // Server se products lein
    const allProducts = await fetchProductsFromServer();
    const activeProducts = allProducts.filter(function(p) { return p.active !== false; });
    currentProducts = activeProducts;

    productsGrid.innerHTML = '';

    if (activeProducts.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px 0;">' +
            '<p style="font-size:18px; color:#64748b;">No products available right now.</p></div>';
        return;
    }

    activeProducts.forEach(function(product) {
        const oldPriceHTML = product.oldPrice
            ? '<del>Rs. ' + product.oldPrice.toLocaleString() + '</del>'
            : '';

        const badgeHTML = product.badge
            ? '<span class="sale-badge">' + product.badge + '</span>'
            : '';

        const rating = Math.min(product.rating || 5, 5);
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.cursor = 'pointer';

        let imageHTML;
        if (product.image && product.image.indexOf('http') === 0) {
            imageHTML = '<img src="' + product.image + '" alt="' + product.name + '" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">';
            imageHTML += '<div class="product-placeholder" style="display:none;"><i class="fa-solid ' + (product.icon || 'fa-box') + '"></i></div>';
        } else {
            imageHTML = '<div class="product-placeholder"><i class="fa-solid ' + (product.icon || 'fa-box') + '"></i></div>';
        }

        productCard.innerHTML = '<div class="product-image">' +
                badgeHTML + imageHTML +
            '</div>' +
            '<div class="product-info">' +
                '<p class="product-category">' + product.category + '</p>' +
                '<h3>' + product.name + '</h3>' +
                '<div class="rating">' + stars + ' <span>(' + (product.reviews || 0) + ')</span></div>' +
                '<div class="price">' +
                    '<strong>Rs. ' + Number(product.price).toLocaleString() + '</strong>' +
                    oldPriceHTML +
                '</div>' +
                '<button class="add-cart-btn" data-product-id="' + product.id + '">' +
                    '<i class="fa-solid fa-cart-plus"></i> Add to Cart' +
                '</button>' +
            '</div>';

        productCard.addEventListener('click', function(event) {
            if (event.target.closest('.add-cart-btn')) return;
            window.location.href = 'product-details.html?id=' + product.id;
        });

        const addButton = productCard.querySelector('.add-cart-btn');
        addButton.addEventListener('click', function(event) {
            event.stopPropagation();
            addToCart(product.id);
        });

        productsGrid.appendChild(productCard);
    });
}

/* =========================
   ADD TO CART
========================= */
async function addToCart(productId) {
    const allProducts = await fetchProductsFromServer();
    const product = allProducts.find(function(item) { return item.id === productId; });

    if (!product) { alert('Product not found!'); return; }
    if (product.stock <= 0) { alert('Out of stock!'); return; }

    let cart = JSON.parse(localStorage.getItem('genzCart')) || [];
    const existing = cart.find(function(item) { return item.id === productId; });

    if (existing) {
        if (existing.quantity >= product.stock) {
            alert('Not enough stock!');
            return;
        }
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon || 'fa-box',
            quantity: 1,
            maxStock: product.stock
        });
    }

    localStorage.setItem('genzCart', JSON.stringify(cart));
    updateCartBadge();
    alert(product.name + ' added to cart! 🛒');
}

/* =========================
   MOBILE MENU
========================= */
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
}

/* =========================
   PRODUCT SEARCH
========================= */
async function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchValue = searchInput.value.trim().toLowerCase();
    if (searchValue === '') { displayProducts(); return; }

    const allProducts = await fetchProductsFromServer();
    const filtered = allProducts.filter(function(product) {
        return product.name.toLowerCase().includes(searchValue) ||
               product.category.toLowerCase().includes(searchValue);
    });

    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    if (filtered.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px 0;">' +
            '<p style="font-size:18px; color:#64748b;">No products found.</p></div>';
        return;
    }

    // Reuse display logic
    const activeFiltered = filtered.filter(function(p) { return p.active !== false; });
    activeFiltered.forEach(function(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.cursor = 'pointer';

        const oldPriceHTML = product.oldPrice ? '<del>Rs. ' + product.oldPrice.toLocaleString() + '</del>' : '';
        const badgeHTML = product.badge ? '<span class="sale-badge">' + product.badge + '</span>' : '';
        const rating = Math.min(product.rating || 5, 5);
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        let imageHTML;
        if (product.image && product.image.indexOf('http') === 0) {
            imageHTML = '<img src="' + product.image + '" style="width:100%; height:100%; object-fit:cover;">';
        } else {
            imageHTML = '<div class="product-placeholder"><i class="fa-solid ' + (product.icon || 'fa-box') + '"></i></div>';
        }

        productCard.innerHTML = '<div class="product-image">' + badgeHTML + imageHTML + '</div>' +
            '<div class="product-info">' +
                '<p class="product-category">' + product.category + '</p>' +
                '<h3>' + product.name + '</h3>' +
                '<div class="rating">' + stars + ' <span>(' + (product.reviews || 0) + ')</span></div>' +
                '<div class="price"><strong>Rs. ' + Number(product.price).toLocaleString() + '</strong>' + oldPriceHTML + '</div>' +
                '<button class="add-cart-btn" data-product-id="' + product.id + '"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>' +
            '</div>';

        productCard.addEventListener('click', function(event) {
            if (event.target.closest('.add-cart-btn')) return;
            window.location.href = 'product-details.html?id=' + product.id;
        });

        productCard.querySelector('.add-cart-btn').addEventListener('click', function(event) {
            event.stopPropagation();
            addToCart(product.id);
        });

        productsGrid.appendChild(productCard);
    });
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') searchProducts();
    });
}

/* =========================
   PRODUCT QUANTITY (Details Page)
========================= */
function changeQuantity(change) {
    const quantityElement = document.getElementById('productQuantity');
    if (!quantityElement) return;
    productQuantity += change;
    if (productQuantity < 1) productQuantity = 1;
    quantityElement.textContent = productQuantity;
}

/* =========================
   LOAD PRODUCT DETAILS
========================= */
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

    const oldPriceHTML = product.oldPrice ? '<del>Rs. ' + product.oldPrice.toLocaleString() + '</del>' : '';
    const badgeHTML = product.badge ? '<span class="details-badge">' + product.badge + '</span>' : '';
    const rating = Math.min(product.rating || 5, 5);
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    let imageHTML;
    if (product.image && product.image.indexOf('http') === 0) {
        imageHTML = '<img src="' + product.image + '" style="width:100%; height:100%; object-fit:cover; border-radius:18px;">';
    } else {
        imageHTML = '<div class="details-placeholder"><i class="fa-solid ' + (product.icon || 'fa-box') + '"></i></div>';
    }

    detailsContainer.innerHTML = '<div class="details-image">' + badgeHTML + imageHTML + '</div>' +
        '<div class="details-info">' +
            '<p class="product-category">' + product.category + '</p>' +
            '<h1>' + product.name + '</h1>' +
            '<div class="details-rating"><span>' + stars + '</span><span>(' + (product.reviews || 0) + ' reviews)</span></div>' +
            '<div class="details-price"><strong>Rs. ' + Number(product.price).toLocaleString() + '</strong>' + oldPriceHTML + '</div>' +
            '<p class="details-description">' + (product.description || '') + '</p>' +
            '<div class="stock-status"><i class="fa-solid fa-circle-check"></i> ' +
                (product.stock > 0 ? 'In Stock (' + product.stock + ' available)' : 'Out of Stock') +
            '</div>' +
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
                :
                '<button class="details-cart-btn" disabled>Out of Stock</button>') +
            '<div class="product-features">' +
                '<div><i class="fa-solid fa-truck"></i><span>Fast Delivery</span></div>' +
                '<div><i class="fa-solid fa-shield-halved"></i><span>Quality Products</span></div>' +
                '<div><i class="fa-brands fa-whatsapp"></i><span>WhatsApp Support</span></div>' +
            '</div>' +
        '</div>';
}

/* =========================
   ADD PRODUCT TO CART (Details)
========================= */
async function addProductToCart(productId) {
    const allProducts = await fetchProductsFromServer();
    const product = allProducts.find(function(item) { return item.id === productId; });
    if (!product || product.stock <= 0) { alert('Out of stock!'); return; }

    const qtyElement = document.getElementById('productQuantity');
    const qty = qtyElement ? parseInt(qtyElement.textContent) : 1;

    let cart = JSON.parse(localStorage.getItem('genzCart')) || [];
    const existing = cart.find(function(item) { return item.id === productId; });

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            id: product.id, name: product.name, price: product.price,
            icon: product.icon || 'fa-box', quantity: qty, maxStock: product.stock
        });
    }

    localStorage.setItem('genzCart', JSON.stringify(cart));
    updateCartBadge();
    alert(qty + ' × ' + product.name + ' added to cart!');
}

/* =========================
   BUY NOW
========================= */
async function buyNow(productId) {
    await addProductToCart(productId);
    window.location.href = 'checkout.html';
}

/* =========================
   SEARCH FROM DETAILS
========================= */
function goToHomeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) { window.location.href = 'index.html'; return; }
    const searchValue = searchInput.value.trim();
    if (!searchValue) { window.location.href = 'index.html'; return; }
    window.location.href = 'index.html?search=' + encodeURIComponent(searchValue);
}

/* =========================
   START
========================= */
document.addEventListener('DOMContentLoaded', async function() {
    updateCartBadge();
    await displayProducts();
    await loadProductDetails();
    console.log('✅ GEN.Z GADGETS loaded!');
});
