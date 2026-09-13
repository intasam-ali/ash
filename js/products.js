/* =========================
   GEN.Z GADGETS
   Products Data - Firebase Version
========================= */

// Wait for Firebase to load
function waitForFirebase(callback) {
    if (window.firebaseDB) {
        callback();
    } else {
        setTimeout(function() { waitForFirebase(callback); }, 100);
    }
}

// ===== FETCH PRODUCTS FROM FIREBASE =====
async function fetchProductsFromServer() {
    return new Promise(function(resolve) {
        waitForFirebase(async function() {
            try {
                const { db, collection, getDocs } = window.firebaseDB;
                const querySnapshot = await getDocs(collection(db, 'products'));
                const products = [];
                querySnapshot.forEach(function(doc) {
                    products.push({ id: parseInt(doc.id), ...doc.data() });
                });
                products.sort(function(a, b) { return a.id - b.id; });
                
                localStorage.setItem('genzProducts', JSON.stringify(products));
                console.log('✅ Products fetched from Firebase:', products.length);
                resolve(products);
            } catch (error) {
                console.error('❌ Firebase fetch error:', error);
                const cached = localStorage.getItem('genzProducts');
                resolve(cached ? JSON.parse(cached) : []);
            }
        });
    });
}

// ===== SAVE PRODUCT TO FIREBASE =====
async function saveProductToFirebase(product) {
    return new Promise(function(resolve) {
        waitForFirebase(async function() {
            try {
                const { db, doc, setDoc } = window.firebaseDB;
                await setDoc(doc(db, 'products', String(product.id)), product);
                console.log('✅ Product saved to Firebase:', product.id);
                resolve(true);
            } catch (error) {
                console.error('❌ Firebase save error:', error);
                resolve(false);
            }
        });
    });
}

// ===== DELETE PRODUCT FROM FIREBASE =====
async function deleteProductFromFirebase(productId) {
    return new Promise(function(resolve) {
        waitForFirebase(async function() {
            try {
                const { db, doc, deleteDoc } = window.firebaseDB;
                await deleteDoc(doc(db, 'products', String(productId)));
                console.log('✅ Product deleted from Firebase:', productId);
                resolve(true);
            } catch (error) {
                console.error('❌ Firebase delete error:', error);
                resolve(false);
            }
        });
    });
}

// ===== SYNC ALL PRODUCTS TO FIREBASE =====
async function syncAllToFirebase(productsList) {
    return new Promise(function(resolve) {
        waitForFirebase(async function() {
            try {
                const { db, doc, setDoc } = window.firebaseDB;
                for (const product of productsList) {
                    await setDoc(doc(db, 'products', String(product.id)), product);
                }
                console.log('✅ All products synced to Firebase');
                resolve(true);
            } catch (error) {
                console.error('❌ Firebase sync error:', error);
                resolve(false);
            }
        });
    });
}

// ===== GET PRODUCTS FROM CACHE =====
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

console.log('✅ PRODUCTS JS LOADED (Firebase version)');
