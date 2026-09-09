/* =========================
   GEN.Z GADGETS
   Admin JavaScript
========================= */

let adminProducts = [];

/* =========================
   LOAD PRODUCTS
========================= */

function loadAdminProducts() {
    const savedProducts = localStorage.getItem("genzProducts");

    if (savedProducts) {
        adminProducts = JSON.parse(savedProducts);
    } else {
        adminProducts = JSON.parse(JSON.stringify(defaultProducts));
        saveAdminProducts();
    }

    renderAdminProducts();
    updateAdminStats();
}

/* =========================
   SAVE PRODUCTS
========================= */

function saveAdminProducts() {
    localStorage.setItem("genzProducts", JSON.stringify(adminProducts));
    // Also update the products variable in the main script
    if (typeof products !== 'undefined') {
        products.length = 0;
        products.push(...adminProducts);
    }
}

/* =========================
   RENDER PRODUCTS
========================= */

function renderAdminProducts(list = adminProducts) {
    const table = document.getElementById("adminProductsTable");
    if (!table) return;

    table.innerHTML = "";

    if (list.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="admin-empty">
                    No products found. Add your first product!
                </td>
            </tr>
        `;
        return;
    }

    list.forEach(product => {
        const row = document.createElement("tr");
        
        const isActive = product.active !== false;
        
        row.innerHTML = `
            <td>
                <div class="admin-product-name">
                    <div class="admin-product-icon">
                        <i class="fa-solid ${product.icon || 'fa-box'}"></i>
                    </div>
                    <div>
                        <strong>${product.name}</strong>
                        <small>ID: ${product.id}</small>
                    </div>
                </div>
            </td>
            <td>${product.category}</td>
            <td>Rs. ${Number(product.price).toLocaleString()}</td>
            <td>${product.stock || 0}</td>
            <td>
                <button class="status-btn ${isActive ? 'active' : 'inactive'}" 
                        onclick="toggleProduct(${product.id})">
                    ${isActive ? 'Active' : 'OFF'}
                </button>
            </td>
            <td>
                <div class="admin-actions">
                    <button class="edit-btn" onclick="editProduct(${product.id})" title="Edit Product">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})" title="Delete Product">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        table.appendChild(row);
    });
}

/* =========================
   UPDATE STATISTICS
========================= */

function updateAdminStats() {
    const totalProducts = document.getElementById("totalProducts");
    const activeProducts = document.getElementById("activeProducts");
    const totalStock = document.getElementById("totalStock");

    const active = adminProducts.filter(product => product.active !== false);
    const stock = adminProducts.reduce((total, product) => total + Number(product.stock || 0), 0);

    if (totalProducts) totalProducts.textContent = adminProducts.length;
    if (activeProducts) activeProducts.textContent = active.length;
    if (totalStock) totalStock.textContent = stock;
}

/* =========================
   OPEN PRODUCT FORM
========================= */

function openProductForm() {
    const section = document.getElementById("productFormSection");
    const form = document.getElementById("productForm");
    const title = document.getElementById("formTitle");

    if (!section || !form) return;

    form.reset();
    document.getElementById("productId").value = "";
    document.getElementById("productActive").checked = true;
    document.getElementById("productRating").value = 5;
    document.getElementById("productReviews").value = 0;
    
    title.textContent = "Add New Product";
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
}

/* =========================
   CLOSE PRODUCT FORM
========================= */

function closeProductForm() {
    const section = document.getElementById("productFormSection");
    if (!section) return;
    section.style.display = "none";
}

/* =========================
   EDIT PRODUCT
========================= */

function editProduct(productId) {
    const product = adminProducts.find(item => item.id === productId);
    if (!product) return;

    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name || "";
    document.getElementById("productCategory").value = product.category || "";
    document.getElementById("productPrice").value = product.price || "";
    document.getElementById("productOldPrice").value = product.oldPrice || "";
    document.getElementById("productStock").value = product.stock || 0;
    document.getElementById("productRating").value = product.rating || 5;
    document.getElementById("productReviews").value = product.reviews || 0;
    document.getElementById("productBadge").value = product.badge || "";
  document.getElementById("productIcon").value = product.icon || "fa-box";
document.getElementById("productImage").value = product.image || "";  // NEW
document.getElementById("productDescription").value = product.description || "";
    document.getElementById("productActive").checked = product.active !== false;

    document.getElementById("formTitle").textContent = "Edit Product";

    const section = document.getElementById("productFormSection");
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
}

/* =========================
   SAVE PRODUCT FORM
========================= */

const productForm = document.getElementById("productForm");

if (productForm) {
    productForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const idValue = document.getElementById("productId").value;

       const productData = {
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value.trim(),
    price: Number(document.getElementById("productPrice").value),
    oldPrice: Number(document.getElementById("productOldPrice").value) || null,
    stock: Number(document.getElementById("productStock").value),
    rating: Number(document.getElementById("productRating").value),
    reviews: Number(document.getElementById("productReviews").value),
    badge: document.getElementById("productBadge").value,
    icon: document.getElementById("productIcon").value,
    image: document.getElementById("productImage").value.trim() || null,  // NEW
    description: document.getElementById("productDescription").value.trim(),
    active: document.getElementById("productActive").checked
};

        /* EDIT EXISTING PRODUCT */
        if (idValue) {
            const id = Number(idValue);
            const index = adminProducts.findIndex(product => product.id === id);
            
            if (index !== -1) {
                adminProducts[index] = { ...adminProducts[index], ...productData };
            }
            
            alert("✅ Product updated successfully!");
        }
        /* ADD NEW PRODUCT */
        else {
            const newId = adminProducts.length > 0 
                ? Math.max(...adminProducts.map(product => product.id)) + 1 
                : 1;

            const newProduct = { id: newId, ...productData };
            adminProducts.push(newProduct);
            
            alert("✅ Product added successfully!");
        }

        saveAdminProducts();
        renderAdminProducts();
        updateAdminStats();
        closeProductForm();
        
        // Refresh the products in the main store
        if (typeof reloadProducts === 'function') {
            reloadProducts();
        }
    });
}

/* =========================
   DELETE PRODUCT
========================= */

function deleteProduct(productId) {
    const product = adminProducts.find(item => item.id === productId);
    if (!product) return;

    const confirmDelete = confirm(`Delete "${product.name}"?`);
    if (!confirmDelete) return;

    adminProducts = adminProducts.filter(item => item.id !== productId);
    saveAdminProducts();
    renderAdminProducts();
    updateAdminStats();
    
    alert("🗑️ Product deleted successfully!");
}

/* =========================
   ON / OFF PRODUCT
========================= */

function toggleProduct(productId) {
    const product = adminProducts.find(item => item.id === productId);
    if (!product) return;

    product.active = product.active === false ? true : false;
    saveAdminProducts();
    renderAdminProducts();
    updateAdminStats();
}

/* =========================
   ADMIN SEARCH
========================= */

const adminSearch = document.getElementById("adminSearch");

if (adminSearch) {
    adminSearch.addEventListener("input", function() {
        const searchValue = this.value.trim().toLowerCase();
        
        if (!searchValue) {
            renderAdminProducts(adminProducts);
            return;
        }

        const filtered = adminProducts.filter(product =>
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );

        renderAdminProducts(filtered);
    });
}

/* =========================
   START ADMIN
========================= */

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    loadAdminProducts();
    console.log("✅ ADMIN JS LOADED");
});

// Also run immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadAdminProducts();
    console.log("✅ ADMIN JS LOADED (early)");
}
