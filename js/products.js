/* =========================
   GEN.Z GADGETS
   Products Data & Functions
========================= */

// ===== DEFAULT PRODUCTS (with working images) =====
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
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&crop=center",
        description: "High-quality wireless Bluetooth earbuds with clear sound and comfortable fit.",
        stock: 20,
        active: true
    },
    {
        id: 2,
        name: "25W Fast Charger",
        category: "Chargers",
        price: 1499,
        oldPrice: null,
        badge: "",
        rating: 5,
        reviews: 8,
        icon: "fa-bolt",
        image: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=400&h=400&fit=crop&crop=center",
        description: "Compact 25W fast charger suitable for compatible smartphones and devices.",
        stock: 15,
        active: true
    },
    {
        id: 3,
        name: "20,000mAh Power Bank",
        category: "Power Banks",
        price: 3299,
        oldPrice: null,
        badge: "",
        rating: 4,
        reviews: 15,
        icon: "fa-battery-full",
        image: "https://images.unsplash.com/photo-1609592426706-77c24a1a81ae?w=400&h=400&fit=crop&crop=center",
        description: "Large-capacity power bank for keeping your devices charged while travelling.",
        stock: 10,
        active: true
    },
    {
        id: 4,
        name: "Premium Shockproof Case",
        category: "Phone Cases",
        price: 899,
        oldPrice: null,
        badge: "NEW",
        rating: 5,
        reviews: 21,
        icon: "fa-mobile-screen",
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop&crop=center",
        description: "GEN.Z Premium Phone Case designed to protect your smartphone.",
        stock: 30,
        active: true
    },
    {
        id: 5,
        name: "Smart Watch Pro",
        category: "Smartwatches",
        price: 4999,
        oldPrice: 6999,
        badge: "SALE",
        rating: 5,
        reviews: 18,
        icon: "fa-clock",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd1a7?w=400&h=400&fit=crop&crop=center",
        description: "Premium smart watch with health tracking, notifications, and long battery life.",
        stock: 8,
        active: true
    },
    {
        id: 6,
        name: "USB-C Data Cable",
        category: "Cables",
        price: 499,
        oldPrice: null,
        badge: "",
        rating: 4,
        reviews: 34,
        icon: "fa-cable-car",
        image: "https://images.unsplash.com/photo-1583852405568-0fdaa36e1d90?w=400&h=400&fit=crop&crop=center",
        description: "Durable USB-C to USB-C cable for fast charging and data transfer.",
        stock: 50,
        active: true
    },
    {
        id: 7,
        name: "Wireless Charging Pad",
        category: "Chargers",
        price: 1899,
        oldPrice: null,
        badge: "NEW",
        rating: 4,
        reviews: 9,
        icon: "fa-bolt",
        image: "https://images.unsplash.com/photo-1606659646123-d93997602c1b?w=400&h=400&fit=crop&crop=center",
        description: "Qi-compatible wireless charging pad for all smartphones.",
        stock: 12,
        active: true
    },
    {
        id: 8,
        name: "Premium Leather Phone Case",
        category: "Phone Cases",
        price: 1299,
        oldPrice: 1999,
        badge: "SALE",
        rating: 5,
        reviews: 27,
        icon: "fa-mobile-screen",
        image: "https://images.unsplash.com/photo-1624608916025-2f023d30e65c?w=400&h=400&fit=crop&crop=center",
        description: "Genuine leather phone case with card holder and stand function.",
        stock: 15,
        active: true
    }
];

// ===== GET PRODUCTS (from localStorage or defaults) =====
function getProducts() {
    const saved = localStorage.getItem("genzProducts");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            console.log("Error parsing products, using defaults");
        }
    }
    // If no saved products, save defaults and return them
    localStorage.setItem("genzProducts", JSON.stringify(defaultProducts));
    return defaultProducts;
}

// ===== GET ACTIVE PRODUCTS (only active ones for frontend) =====
function getActiveProducts() {
    const all = getProducts();
    return all.filter(product => product.active !== false);
}

// ===== ORIGINAL PRODUCTS VARIABLE (for backward compatibility) =====
const products = getProducts();

// ===== RELOAD PRODUCTS (call this after admin changes) =====
function reloadProducts() {
    const fresh = getProducts();
    products.length = 0;
    products.push(...fresh);
    return products;
}

// ===== FORCE RESET (use this if products are broken) =====
function resetProducts() {
    localStorage.setItem("genzProducts", JSON.stringify(defaultProducts));
    const fresh = getProducts();
    products.length = 0;
    products.push(...fresh);
    return products;
}

console.log('✅ PRODUCTS JS LOADED with', products.length, 'products');