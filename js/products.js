/* =========================
   GEN.Z GADGETS
   Products Data - JSONBin Version
========================= */

const JSONBIN_BIN_ID = '6aa3ebcbffd5d16053f9fa9f';
const JSONBIN_API_KEY = '$2a$10$zZbnaYmlPLZ9iEI4zU83iO1GeTDajOnnoa9dJvr3WewY22z.YrXRq';
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/' + JSONBIN_BIN_ID;

/* =========================
   FETCH FROM SERVER
========================= */
async function fetchProductsFromServer() {
    try {
        const response = await fetch(JSONBIN_URL + '/latest', {
            headers: { 'X-Master-Key': JSONBIN_API_KEY }
        });
        const data = await response.json();
        if (data.record && Array.isArray(data.record)) {
            localStorage.setItem('genzProducts', JSON.stringify(data.record));
            return data.record;
        }
        return [];
    } catch (error) {
        console.error('Fetch error:', error);
        const cached = localStorage.getItem('genzProducts');
        return cached ? JSON.parse(cached) : [];
    }
}

/* =========================
   GET PRODUCTS (sync from cache)
========================= */
function getProducts() {
    const cached = localStorage.getItem('genzProducts');
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.length > 0) return parsed;
        } catch(e) {}
    }
    return [];
}

function getActiveProducts() {
    return getProducts().filter(function(p) { return p.active !== false; });
}

const products = [];

console.log('✅ PRODUCTS JS LOADED (JSONBin version)');
