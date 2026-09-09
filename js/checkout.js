/* =========================
   GEN.Z GADGETS
   Checkout JavaScript
========================= */

let cartItems = [];
let selectedPayment = 'whatsapp';

/* =========================
   LOAD CHECKOUT
========================= */

function loadCheckout() {
    const container = document.getElementById('checkoutContent');
    if (!container) return;

    // Get cart from localStorage
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
        return;
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 200; // Fixed delivery fee
    const total = subtotal + deliveryFee;

    container.innerHTML = `
        <div class="checkout-container">
            <!-- Checkout Form -->
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
                            <div class="payment-option selected" data-payment="whatsapp" onclick="selectPayment('whatsapp')">
                                <i class="fa-brands fa-whatsapp" style="color:#25D366;"></i>
                                <span>WhatsApp</span>
                            </div>
                            <div class="payment-option" data-payment="jazzcash" onclick="selectPayment('jazzcash')">
                                <i class="fa-solid fa-mobile-screen" style="color:#ED1B24;"></i>
                                <span>JazzCash</span>
                            </div>
                            <div class="payment-option" data-payment="easypaisa" onclick="selectPayment('easypaisa')">
                                <i class="fa-solid fa-mobile-screen-button" style="color:#00A859;"></i>
                                <span>EasyPaisa</span>
                            </div>
                            <div class="payment-option" data-payment="bank" onclick="selectPayment('bank')">
                                <i class="fa-solid fa-building-columns" style="color:#1E3A8A;"></i>
                                <span>Bank Transfer</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="place-order-btn">
                        <i class="fa-solid fa-check"></i>
                        Place Order
                    </button>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
                <h2><i class="fa-solid fa-receipt"></i> Order Summary</h2>

                <div class="order-items">
                    ${cartItems.map(item => `
                        <div class="order-item">
                            <div class="order-item-info">
                                <div class="order-item-icon">
                                    <i class="fa-solid ${item.icon || 'fa-box'}"></i>
                                </div>
                                <div class="order-item-name">
                                    ${item.name}
                                    <small>Qty: ${item.quantity}</small>
                                </div>
                            </div>
                            <div class="order-item-price">
                                Rs. ${(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="order-totals">
                    <div>
                        <span>Subtotal</span>
                        <span>Rs. ${subtotal.toLocaleString()}</span>
                    </div>
                    <div>
                        <span>Delivery Fee</span>
                        <span>Rs. ${deliveryFee.toLocaleString()}</span>
                    </div>
                    <div class="total">
                        <span>Total</span>
                        <span>Rs. ${total.toLocaleString()}</span>
                    </div>
                </div>

                <div style="margin-top: 15px; padding: 15px; background: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
                    <p style="font-size: 13px; color: #166534; margin: 0;">
                        <i class="fa-solid fa-truck"></i>
                        Free delivery on orders above Rs. 5,000
                    </p>
                </div>
            </div>
        </div>
    `;

    // Update cart badge
    updateCartBadge();
}

/* =========================
   SELECT PAYMENT
========================= */

function selectPayment(method) {
    selectedPayment = method;
    
    document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    document.querySelector(`.payment-option[data-payment="${method}"]`).classList.add('selected');
}

/* =========================
   PLACE ORDER
========================= */

function placeOrder(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const city = document.getElementById('customerCity').value.trim();
    const instructions = document.getElementById('deliveryInstructions').value.trim();

    // Validate
    if (!name) {
        alert('Please enter your full name.');
        return;
    }
    if (!phone || phone.length < 10) {
        alert('Please enter a valid phone number.');
        return;
    }
    if (!address) {
        alert('Please enter your delivery address.');
        return;
    }
    if (!city) {
        alert('Please enter your city.');
        return;
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 200;
    const total = subtotal + deliveryFee;

    // Create order object
    const order = {
        id: Date.now(),
        orderNumber: 'GENZ-' + Date.now().toString().slice(-8),
        date: new Date().toISOString(),
        customer: {
            name: name,
            phone: phone,
            email: email || 'Not provided',
            address: address,
            city: city,
            instructions: instructions || 'None'
        },
        items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            icon: item.icon || 'fa-box'
        })),
        payment: selectedPayment,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        status: 'Pending'
    };

    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('genzOrders')) || [];
    orders.unshift(order); // Add new order at the beginning
    localStorage.setItem('genzOrders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('genzCart');
    updateCartBadge();

    // Show success message
    showOrderSuccess(order);

    // Send WhatsApp message
    sendWhatsAppOrder(order);
}

/* =========================
   SHOW ORDER SUCCESS
========================= */

function showOrderSuccess(order) {
    const container = document.getElementById('checkoutContent');
    
    container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            <div style="width: 80px; height: 80px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <i class="fa-solid fa-check" style="font-size: 40px; color: #16a34a;"></i>
            </div>
            <h2 style="color: #16a34a; margin-bottom: 10px;">Order Placed Successfully! 🎉</h2>
            <p style="color: #64748b; font-size: 18px; margin-bottom: 5px;">
                Order #${order.orderNumber}
            </p>
            <p style="color: #94a3b8; margin-bottom: 25px;">
                We will contact you shortly on <strong>${order.customer.phone}</strong>
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="index.html" class="primary-btn">
                    <i class="fa-solid fa-store"></i>
                    Continue Shopping
                </a>
                <a href="https://wa.me/923197745919?text=Assalam-o-Alaikum%20GEN.Z%20GADGETS%2C%20Mera%20order%20%23${order.orderNumber}%20place%20kia%20hai.%20Mera%20name%3A%20${order.customer.name}" 
                   target="_blank"
                   class="primary-btn" 
                   style="background: #25D366; color: white;">
                    <i class="fa-brands fa-whatsapp"></i>
                    Contact on WhatsApp
                </a>
            </div>
        </div>
    `;
}

/* =========================
   SEND WHATSAPP ORDER
========================= */

function sendWhatsAppOrder(order) {
    // Build order summary for WhatsApp
    let itemsText = order.items.map(item => 
        `  • ${item.name} (x${item.quantity}) = Rs. ${(item.price * item.quantity).toLocaleString()}`
    ).join('%0A');

    const message = `📦 *New Order Received!*%0A%0A` +
        `🔢 Order #: ${order.orderNumber}%0A` +
        `📅 Date: ${new Date(order.date).toLocaleDateString('en-PK')}%0A%0A` +
        `👤 *Customer Details*%0A` +
        `  Name: ${order.customer.name}%0A` +
        `  Phone: ${order.customer.phone}%0A` +
        `  Email: ${order.customer.email}%0A` +
        `  City: ${order.customer.city}%0A` +
        `  Address: ${order.customer.address}%0A` +
        `  Instructions: ${order.customer.instructions}%0A%0A` +
        `🛍️ *Order Items*%0A${itemsText}%0A%0A` +
        `💰 *Total: Rs. ${order.total.toLocaleString()}*%0A` +
        `💳 Payment: ${order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}%0A%0A` +
        `✅ Please confirm order.`;

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/923197745919?text=${message}`;
    
    // Open in new tab after a small delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 500);
}

/* =========================
   EVENT LISTENERS
========================= */

document.addEventListener('DOMContentLoaded', function() {
    loadCheckout();

    // Form submit
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', placeOrder);
    }
});

console.log('✅ CHECKOUT JS LOADED');
