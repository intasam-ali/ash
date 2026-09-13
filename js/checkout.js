/* =========================
   GEN.Z GADGETS
   Checkout JavaScript - Firebase + WhatsApp
========================= */

let cartItems = [];
let selectedPayment = 'easypaisa';

// Wait for Firebase
function waitForFirebase(callback) {
    if (window.firebaseDB) {
        callback();
    } else {
        setTimeout(function() { waitForFirebase(callback); }, 100);
    }
}

// Save order to Firebase
async function saveOrderToFirebase(order) {
    return new Promise(function(resolve) {
        waitForFirebase(async function() {
            try {
                const { db, doc, setDoc } = window.firebaseDB;
                await setDoc(doc(db, 'orders', String(order.orderNumber)), order);
                console.log('✅ Order saved to Firebase:', order.orderNumber);
                resolve(true);
            } catch (error) {
                console.error('❌ Firebase order save error:', error);
                resolve(false);
            }
        });
    });
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('genzCart')) || [];
    const totalItems = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    const cartElement = document.getElementById('cartCount');
    if (cartElement) cartElement.textContent = totalItems;
}

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
}

function goToHomeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) { window.location.href = 'index.html'; return; }
    const searchValue = searchInput.value.trim();
    if (!searchValue) { window.location.href = 'index.html'; return; }
    window.location.href = 'index.html?search=' + encodeURIComponent(searchValue);
}

function loadCheckout() {
    const container = document.getElementById('checkoutContent');
    if (!container) return;

    cartItems = JSON.parse(localStorage.getItem('genzCart')) || [];

    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart before checking out.</p>
                <a href="index.html" class="primary-btn">Continue Shopping</a>
            </div>
        `;
        updateCartBadge();
        return;
    }

    const subtotal = cartItems.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    const deliveryFee = subtotal >= 9000 ? 0 : 350;
    const total = subtotal + deliveryFee;

    container.innerHTML = `
        <div class="checkout-container">
            <div class="checkout-form">
                <h2><i class="fa-solid fa-user"></i> Customer Details</h2>
                <form id="checkoutForm">
                    <div class="form-group">
                        <label>Full Name <span class="required">*</span></label>
                        <input type="text" id="customerName" placeholder="e.g. Ahmed Khan" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Phone Number <span class="required">*</span></label>
                            <input type="tel" id="customerPhone" placeholder="03XX-XXXXXXX" required>
                        </div>
                        <div class="form-group">
                            <label>Email (Optional)</label>
                            <input type="email" id="customerEmail" placeholder="ahmed@email.com">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Delivery Address <span class="required">*</span></label>
                        <textarea id="customerAddress" placeholder="House #, Street, City, Province" required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>City <span class="required">*</span></label>
                            <input type="text" id="customerCity" placeholder="e.g. Lahore" required>
                        </div>
                        <div class="form-group">
                            <label>Delivery Instructions</label>
                            <input type="text" id="deliveryInstructions" placeholder="Near mosque, landmark etc.">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Payment Method <span class="required">*</span></label>
                        <div class="payment-options">
                            <div class="payment-option selected" data-payment="easypaisa" onclick="selectPayment('easypaisa')">
                                <i class="fa-solid fa-mobile-screen" style="color:#00A859;"></i>
                                <span>Easypaisa</span>
                            </div>
                            <div class="payment-option" data-payment="bank" onclick="selectPayment('bank')">
                                <i class="fa-solid fa-building-columns" style="color:#1E3A8A;"></i>
                                <span>UBL Bank</span>
                            </div>
                            <div class="payment-option" data-payment="jazzcash" onclick="selectPayment('jazzcash')">
                                <i class="fa-solid fa-wallet" style="color:#ED1B24;"></i>
                                <span>JazzCash</span>
                            </div>
                            <div class="payment-option" data-payment="cod" onclick="selectPayment('cod')">
                                <i class="fa-solid fa-money-bill-wave" style="color:#f59e0b;"></i>
                                <span>Cash on Delivery</span>
                            </div>
                        </div>

                        <div class="payment-details show" id="easypaisaDetails">
                            <h4><i class="fa-solid fa-circle-info"></i> Easypaisa Payment Details</h4>
                            <div class="detail-row">
                                <strong>Account Number</strong>
                                <span>0319-7745919 <button type="button" class="copy-btn" onclick="copyText('03197745919')">Copy</button></span>
                            </div>
                            <div class="detail-row">
                                <strong>Account Name</strong>
                                <span>Intisam Ali</span>
                            </div>
                            <p style="color:#166534; font-size:12px; margin-top:10px;">
                                💡 Payment karne ke baad screenshot WhatsApp par bhejein: <strong>0319-7745919</strong>
                            </p>
                        </div>

                        <div class="payment-details" id="bankDetails">
                            <h4><i class="fa-solid fa-circle-info"></i> UBL Bank Payment Details</h4>
                            <div class="detail-row">
                                <strong>Bank Name</strong>
                                <span>UBL (United Bank Limited)</span>
                            </div>
                            <div class="detail-row">
                                <strong>Account Number</strong>
                                <span>0620296738441 <button type="button" class="copy-btn" onclick="copyText('0620296738441')">Copy</button></span>
                            </div>
                            <div class="detail-row">
                                <strong>Account Name</strong>
                                <span>Intisam Ali</span>
                            </div>
                            <p style="color:#166534; font-size:12px; margin-top:10px;">
                                💡 Transfer ke baad screenshot WhatsApp par bhejein: <strong>0319-7745919</strong>
                            </p>
                        </div>

                        <div class="payment-details" id="jazzcashDetails">
                            <h4><i class="fa-solid fa-circle-info"></i> JazzCash Payment Details</h4>
                            <p style="color:#166534; font-size:13px;">
                                JazzCash details jald update hongi. Filhal Easypaisa ya UBL Bank use karein. Ya WhatsApp par rabta karein: <strong>0319-7745919</strong>
                            </p>
                        </div>

                        <div class="payment-details" id="codDetails">
                            <h4><i class="fa-solid fa-circle-info"></i> Cash on Delivery</h4>
                            <p style="color:#166534; font-size:13px;">
                                Cash on Delivery service <strong>filhal available nahi hai</strong>. Baraye meherbani Easypaisa ya UBL Bank use karein.
                            </p>
                        </div>
                    </div>

                    <button type="submit" class="place-order-btn">
                        <i class="fa-solid fa-check"></i> Place Order
                    </button>
                </form>
            </div>

            <div class="order-summary">
                <h2><i class="fa-solid fa-receipt"></i> Order Summary</h2>
                <div class="order-items">
                    ${cartItems.map(function(item) {
                        return '<div class="order-item">' +
                            '<div class="order-item-info">' +
                                '<div class="order-item-icon"><i class="fa-solid ' + (item.icon || 'fa-box') + '"></i></div>' +
                                '<div class="order-item-name">' + item.name + '<small>Qty: ' + item.quantity + '</small></div>' +
                            '</div>' +
                            '<div class="order-item-price">Rs. ' + (item.price * item.quantity).toLocaleString() + '</div>' +
                        '</div>';
                    }).join('')}
                </div>
                <div class="order-totals">
                    <div><span>Subtotal</span><span>Rs. ${subtotal.toLocaleString()}</span></div>
                    <div><span>Delivery Fee</span><span>${deliveryFee === 0 ? '<span style="color:#16a34a; font-weight:700;">FREE</span>' : 'Rs. ' + deliveryFee.toLocaleString()}</span></div>
                    <div class="total"><span>Total</span><span>Rs. ${total.toLocaleString()}</span></div>
                </div>
                <div style="margin-top: 15px; padding: 15px; background: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
                    <p style="font-size: 13px; color: #166534; margin: 0;">
                        <i class="fa-solid fa-truck"></i>
                        ${subtotal >= 9000 ? '✅ Free delivery applied (All over Pakistan)' : 'Free delivery on orders above Rs. 9,000 — All over Pakistan'}
                    </p>
                </div>
            </div>
        </div>
    `;

    updateCartBadge();
    const form = document.getElementById('checkoutForm');
    if (form) form.addEventListener('submit', placeOrder);
}

function selectPayment(method) {
    selectedPayment = method;
    document.querySelectorAll('.payment-option').forEach(function(el) {
        el.classList.remove('selected');
    });
    document.querySelector('.payment-option[data-payment="' + method + '"]').classList.add('selected');

    document.querySelectorAll('.payment-details').forEach(function(el) {
        el.classList.remove('show');
    });
    const detailEl = document.getElementById(method + 'Details');
    if (detailEl) detailEl.classList.add('show');
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('✅ Copied: ' + text);
    }).catch(function() {
        alert('Copy: ' + text);
    });
}

async function placeOrder(event) {
    event.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const city = document.getElementById('customerCity').value.trim();
    const instructions = document.getElementById('deliveryInstructions').value.trim();

    if (!name) { alert('Please enter your full name.'); return; }
    if (!phone || phone.length < 10) { alert('Please enter a valid phone number.'); return; }
    if (!address) { alert('Please enter your delivery address.'); return; }
    if (!city) { alert('Please enter your city.'); return; }

    if (selectedPayment === 'cod') {
        alert('Cash on Delivery filhal available nahi hai. Baraye meherbani Easypaisa ya UBL Bank select karein.');
        return;
    }

    const subtotal = cartItems.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    const deliveryFee = subtotal >= 9000 ? 0 : 350;
    const total = subtotal + deliveryFee;

    const order = {
        id: Date.now(),
        orderNumber: 'GENZ-' + Date.now().toString().slice(-8),
        date: new Date().toISOString(),
        customer: {
            name: name, phone: phone, email: email || 'Not provided',
            address: address, city: city, instructions: instructions || 'None'
        },
        items: cartItems.map(function(item) {
            return { id: item.id, name: item.name, price: item.price, quantity: item.quantity, icon: item.icon || 'fa-box' };
        }),
        payment: selectedPayment,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        status: 'Pending'
    };

    // Save to Firebase
    const saved = await saveOrderToFirebase(order);
    if (!saved) {
        alert('⚠️ Order save nahi hua. Internet check karein aur dobara koshish karein.');
        return;
    }

    // Also save to localStorage (backup)
    let orders = JSON.parse(localStorage.getItem('genzOrders')) || [];
    orders.unshift(order);
    localStorage.setItem('genzOrders', JSON.stringify(orders));

    localStorage.removeItem('genzCart');
    updateCartBadge();
    showOrderSuccess(order);
    sendWhatsAppOrder(order);
}

function showOrderSuccess(order) {
    const container = document.getElementById('checkoutContent');
    const paymentLabel = {
        'easypaisa': 'Easypaisa',
        'bank': 'UBL Bank',
        'jazzcash': 'JazzCash',
        'cod': 'Cash on Delivery'
    }[order.payment] || order.payment;

    container.innerHTML = `
        <div class="success-container">
            <div class="check-icon"><i class="fa-solid fa-check"></i></div>
            <h2>Order Placed Successfully! 🎉</h2>
            <p>Order #${order.orderNumber}</p>
            <p class="order-number">Payment Method: <strong>${paymentLabel}</strong></p>
            <p class="order-number">We will contact you shortly on <strong>${order.customer.phone}</strong></p>

            ${order.payment === 'easypaisa' ? `
                <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:15px; margin:20px auto; max-width:400px; text-align:left;">
                    <h4 style="color:#166534; margin-bottom:8px;">💳 Payment Instructions:</h4>
                    <p style="font-size:14px; color:#166534; margin:5px 0;">Send Rs. ${order.total.toLocaleString()} to:</p>
                    <p style="font-size:16px; color:#111827; font-weight:700; margin:5px 0;">Easypaisa: 0319-7745919</p>
                    <p style="font-size:14px; color:#166534; margin:5px 0;">Account Name: Intisam Ali</p>
                    <p style="font-size:13px; color:#166534; margin-top:10px;">📸 Screenshot WhatsApp par bhejein: <strong>0319-7745919</strong></p>
                </div>
            ` : ''}

            ${order.payment === 'bank' ? `
                <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:15px; margin:20px auto; max-width:400px; text-align:left;">
                    <h4 style="color:#166534; margin-bottom:8px;">🏦 Payment Instructions:</h4>
                    <p style="font-size:14px; color:#166534; margin:5px 0;">Transfer Rs. ${order.total.toLocaleString()} to:</p>
                    <p style="font-size:15px; color:#111827; font-weight:700; margin:5px 0;">UBL: 0620296738441</p>
                    <p style="font-size:14px; color:#166534; margin:5px 0;">Account Name: Intisam Ali</p>
                    <p style="font-size:13px; color:#166534; margin-top:10px;">📸 Screenshot WhatsApp par bhejein: <strong>0319-7745919</strong></p>
                </div>
            ` : ''}

            <div class="btn-group" style="margin-top:25px;">
                <a href="index.html" class="primary-btn">
                    <i class="fa-solid fa-store"></i> Continue Shopping
                </a>
                <a href="https://wa.me/923197745919?text=Assalam-o-Alaikum%20GEN.Z%20GADGETS%2C%20Mera%20order%20%23${order.orderNumber}%20place%20kia%20hai.%20Mera%20name%3A%20${order.customer.name}" 
                   target="_blank" class="primary-btn whatsapp-btn">
                    <i class="fa-brands fa-whatsapp"></i> Confirm on WhatsApp
                </a>
            </div>
        </div>
    `;
}

function sendWhatsAppOrder(order) {
    const paymentLabels = {
        'easypaisa': 'Easypaisa',
        'bank': 'UBL Bank',
        'jazzcash': 'JazzCash',
        'cod': 'Cash on Delivery'
    };

    // Build items list - each on new line
    let itemsText = '';
    order.items.forEach(function(item, index) {
        itemsText += (index + 1) + '. ' + item.name + '%0A' +
                      '   Quantity: ' + item.quantity + '%0A' +
                      '   Price: Rs. ' + item.price.toLocaleString() + '%0A' +
                      '   Total: Rs. ' + (item.price * item.quantity).toLocaleString() + '%0A%0A';
    });

    const message =
        '🛒 *NEW ORDER RECEIVED* 🛒%0A' +
        '━━━━━━━━━━━━━━━━━━━━━%0A%0A' +
        '📋 *Order Number:* %0A' +
        '`' + order.orderNumber + '`%0A%0A' +
        '📅 *Date & Time:*%0A' +
        new Date(order.date).toLocaleString('en-PK', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }) + '%0A%0A' +
        '━━━━━━━━━━━━━━━━━━━━━%0A' +
        '👤 *CUSTOMER DETAILS*%0A' +
        '━━━━━━━━━━━━━━━━━━━━━%0A%0A' +
        '▪️ *Name:* ' + order.customer.name + '%0A' +
        '▪️ *Phone:* ' + order.customer.phone + '%0A' +
        '▪️ *Email:* ' + order.customer.email + '%0A' +
        '▪️ *City:* ' + order.customer.city + '%0A' +
        '▪️ *Address:* ' + order.customer.address + '%0A' +
        '▪️ *Instructions:* ' + order.customer.instructions + '%0A%0A' +
        '━━━━━━━━━━━━━━━━━━━━━%0A' +
        '🛍️ *ORDER ITEMS*%0A' +
        '━━━━━━━━━━━━━━━━━━━━━%0A%0A' +
        itemsText +
        '━━━━━━━━━━━━━━━━━━━━━%0A' +
        '💰 *PAYMENT SUMMARY*%0A' +
        '━━━━━━━━━━━━━━━━━━━━━%0A%0A' +
        '▪️ *Subtotal:* Rs. ' + order.subtotal.toLocaleString() + '%0A' +
        '▪️ *Delivery:* ' + (order.deliveryFee === 0 ? 'FREE ✅' : 'Rs. ' + order.deliveryFee.toLocaleString()) + '%0A' +
        '▪️ *Total:* *Rs. ' + order.total.toLocaleString() + '*%0A%0A' +
        '💳 *Payment Method:* ' + (paymentLabels[order.payment] || order.payment) + '%0A%0A' +
        '━━━━━━━━━━━━━━━━━━━━━%0A' +
        '✅ *Please confirm this order.*%0A' +
        '━━━━━━━━━━━━━━━━━━━━━';

    const whatsappUrl = 'https://wa.me/923197745919?text=' + message;

    setTimeout(function() {
        window.open(whatsappUrl, '_blank');
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    loadCheckout();
});
