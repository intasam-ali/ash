/* =========================
   GEN.Z GADGETS
   Product Reviews Loader
========================= */

function waitForFirebase(callback) {
    if (window.firebaseDB) callback();
    else setTimeout(function() { waitForFirebase(callback); }, 100);
}

// Get product ID from URL
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id')) || 0;
}

// Load reviews for the current product
async function loadProductReviews() {
    const productId = getProductIdFromURL();
    if (!productId) return;

    // Show section
    const section = document.getElementById('productReviewsSection');
    if (section) section.style.display = 'block';

    waitForFirebase(async function() {
        try {
            const { db, collection, getDocs } = window.firebaseDB;
            const snapshot = await getDocs(collection(db, 'reviews'));
            const allReviews = [];
            snapshot.forEach(function(doc) {
                allReviews.push(doc.data());
            });

            // Filter reviews for this product
            const productReviews = allReviews.filter(function(r) {
                return String(r.productId) === String(productId);
            });

            // Sort by date (newest first)
            productReviews.sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
            });

            // Calculate average rating
            let totalRating = 0;
            productReviews.forEach(function(r) { totalRating += r.rating; });
            const avgRating = productReviews.length > 0 
                ? (totalRating / productReviews.length).toFixed(1) 
                : '0.0';

            // Update summary
            const bigRating = document.getElementById('productBigRating');
            const starsEl = document.getElementById('productStars');
            const countEl = document.getElementById('productReviewCount');
            const writeBtn = document.getElementById('writeReviewLink');

            if (bigRating) bigRating.textContent = avgRating;
            if (countEl) countEl.textContent = productReviews.length + ' review' + (productReviews.length !== 1 ? 's' : '');

            if (starsEl) {
                const fullStars = Math.round(avgRating);
                let starsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    starsHTML += i <= fullStars ? '★' : '☆';
                }
                starsEl.textContent = starsHTML;
            }

            // Update write review link with product ID
            if (writeBtn) {
                writeBtn.href = 'review.html?product=' + productId;
            }

            // Render reviews list
            const list = document.getElementById('productReviewsList');
            if (!list) return;

            if (productReviews.length === 0) {
                list.innerHTML = `
                    <div class="pr-no-reviews">
                        <i class="fa-solid fa-comment-slash"></i>
                        <h3>Koi review nahi hai abhi</h3>
                        <p>Is product ka pehla review aap likhein!</p>
                        <a href="review.html?product=${productId}" class="pr-write-btn">
                            <i class="fa-solid fa-pen"></i> Write Review
                        </a>
                    </div>
                `;
                return;
            }

            list.innerHTML = productReviews.map(function(r) {
                const initials = r.name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
                const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
                const dateStr = new Date(r.date).toLocaleDateString('en-PK', {
                    day: 'numeric', month: 'short', year: 'numeric'
                });

                return `
                    <div class="product-review-item">
                        <div class="pr-item-top">
                            <div class="pr-item-avatar">${initials}</div>
                            <div class="pr-item-name">
                                <strong>${r.name}</strong>
                                <small>${dateStr}</small>
                            </div>
                            <div class="pr-item-stars">${stars}</div>
                        </div>
                        <div class="pr-item-text">${r.text}</div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Product reviews error:', error);
            const list = document.getElementById('productReviewsList');
            if (list) {
                list.innerHTML = '<div class="pr-no-reviews"><p>Reviews load nahi ho sake</p></div>';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadProductReviews, 800);
});
