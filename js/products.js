/* =========================
   GEN.Z GADGETS
   Products Data - JSONBin Version
========================= */

const JSONBIN_BIN_ID = '6aa3ebcbffd5d16053f9fa9f';
const JSONBIN_API_KEY = '$2a$10$zZbnaYmlPLZ9iEI4zU83iO1GeTDajOnnoa9dJvr3WewY22z.YrXRq';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

/* =========================
   DEFAULT PRODUCTS (fallback)
========================= */
const defaultProducts = [
    {
        id: 1,
        name: "Wireless Bluetooth Earbuds",
        category: "Audio",
        price: 2499,
        oldPrice: 3499,
        badge: "SALE",
        rating: 5,
        reviews: 12,
        icon: "fa-headphones",
        image: "",
        description: "High-quality wireless Bluetooth earbuds.",
        stock: 20,
        active: true
    }
];

/* =========================
   FETCH FROM SERVER
========================= */
async function fetchProductsFromServer() {
    try {
        const response = await fetch(`${JSONBIN_URL}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_API_KEY }
        });
        const data = await response.json();
        
        if (data.record && Array.isArray(data.record) && data.record.length > 0) {
            localStorage.setItem('genzProducts', JSON.stringify(data.record));
            console.log('✅ Products fetched from server:', data.record.length);
            return data.record;
        }
        console.log('⚠️ Server empty, using defaults');
        return defaultProducts;
    } catch (error) {
        console.log('❌ Server error, using cache:', error);
        const cached = localStorage.getItem('genzProducts');
        return cached ? JSON.parse(cached) : defaultProducts;
    }
}

/* =========================
   SAVE TO SERVER
========================= */
async function saveProductsToServer(products) {
    try {
        const response = await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(products)
        });
        
        if (response.ok) {
            localStorage.setItem('genzProducts', JSON.stringify(products));
            console.log('✅ Products saved to server');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Save error:', error);
        return false;
    }
}

/* =========================
   GET PRODUCTS (sync)
========================= */
function getProducts() {
    const cached = localStorage.getItem('genzProducts');
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.length > 0) return parsed;
        } catch(e) {}
    }
    return defaultProducts;
}

function getActiveProducts() {
    return getProducts().filter(p => p.active !== false);
}

const products = getProducts();

function reloadProducts() {
    const fresh = getProducts();
    products.length = 0;
    products.push(...fresh);
    return products;
}

console.log('✅ PRODUCTS JS LOADED');
