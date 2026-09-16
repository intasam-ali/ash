<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | GEN.Z GADGETS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f7fa; padding-bottom: 50px; }
        .header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 15px 20px; position: sticky; top: 0; z-index: 100; }
        .header-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        .logo { font-size: 20px; font-weight: 900; text-decoration: none; color: #111827; }
        .logo span { color: #7c3aed; }
        .nav-links { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .nav-links a { color: #64748b; text-decoration: none; font-weight: 600; padding: 8px 15px; border-radius: 8px; font-size: 14px; }
        .nav-links a:hover { background: #f1f5f9; color: #111827; }
        .nav-links a.active { background: #ede9fe; color: #7c3aed; }
        .nav-links a.logout { color: #dc2626; }
        .nav-links a.logout:hover { background: #fee2e2; }
        .container { max-width: 1200px; margin: 0 auto; padding: 25px 20px; }
        .page-title { font-size: 28px; color: #111827; margin-bottom: 5px; }
        .page-subtitle { color: #64748b; margin-bottom: 25px; }

        /* ===== STATS CARDS ===== */
        .stats-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        .stat-card {
            background: #fff;
            border-radius: 16px;
            padding: 22px;
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
        }
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 4px;
        }
        .stat-card.purple::before { background: linear-gradient(90deg, #7c3aed, #a78bfa); }
        .stat-card.blue::before { background: linear-gradient(90deg, #2563eb, #60a5fa); }
        .stat-card.green::before { background: linear-gradient(90deg, #16a34a, #4ade80); }
        .stat-card.orange::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

        .stat-card .stat-icon {
            width: 45px; height: 45px;
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px;
            margin-bottom: 15px;
        }
        .stat-card.purple .stat-icon { background: #ede9fe; color: #7c3aed; }
        .stat-card.blue .stat-icon { background: #dbeafe; color: #2563eb; }
        .stat-card.green .stat-icon { background: #dcfce7; color: #16a34a; }
        .stat-card.orange .stat-icon { background: #fef3c7; color: #f59e0b; }

        .stat-card .stat-value {
            font-size: 28px;
            font-weight: 900;
            color: #111827;
            line-height: 1;
            margin-bottom: 5px;
        }
        .stat-card .stat-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 600;
        }
        .stat-card .stat-change {
            font-size: 11px;
            color: #16a34a;
            margin-top: 8px;
            font-weight: 700;
        }

        /* ===== CHART SECTION ===== */
        .chart-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }
        .chart-card {
            background: #fff;
            border-radius: 16px;
            padding: 25px;
            border: 1px solid #e2e8f0;
        }
        .chart-card h3 {
            font-size: 18px;
            color: #111827;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .chart-card h3 i { color: #7c3aed; }
        .chart-wrapper {
            position: relative;
            height: 280px;
        }

        /* ===== TOP PRODUCTS ===== */
        .section-box {
            background: #fff;
            border-radius: 16px;
            padding: 25px;
            border: 1px solid #e2e8f0;
            margin-bottom: 20px;
        }
        .section-box h3 {
            font-size: 18px;
            color: #111827;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-box h3 i { color: #7c3aed; }

        .top-product-row {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .top-product-row:last-child { border-bottom: none; }
        .tp-rank {
            width: 32px; height: 32px;
            border-radius: 8px;
            background: #ede9fe;
            color: #7c3aed;
            display: flex; align-items: center; justify-content: center;
            font-weight: 900;
            font-size: 14px;
            flex-shrink: 0;
        }
        .tp-info { flex: 1; min-width: 0; }
        .tp-info h4 { font-size: 14px; color: #111827; margin-bottom: 2px; }
        .tp-info small { font-size: 12px; color: #94a3b8; }
        .tp-bar {
            width: 100px;
            height: 6px;
            background: #f1f5f9;
            border-radius: 3px;
            overflow: hidden;
        }
        .tp-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #7c3aed, #06b6d4);
        }
        .tp-value {
            font-size: 14px;
            font-weight: 800;
            color: #7c3aed;
            min-width: 60px;
            text-align: right;
        }

        .loading-box {
            text-align: center;
            padding: 60px 20px;
            color: #94a3b8;
        }
        .loading-box i { font-size: 40px; display: block; margin-bottom: 15px; }

        @media (max-width: 900px) {
            .stats-row { grid-template-columns: repeat(2, 1fr); }
            .chart-section { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
            .nav-links a { padding: 6px 10px; font-size: 12px; }
            .stat-card .stat-value { font-size: 22px; }
        }
    </style>
</head>
<body>

    <header class="header">
        <div class="header-inner">
            <a href="admin-mobile.html" class="logo">GEN.Z <span>GADGETS</span></a>
            <div class="nav-links">
                <a href="admin-mobile.html"><i class="fa-solid fa-box"></i> Products</a>
                <a href="admin-orders.html"><i class="fa-solid fa-receipt"></i> Orders</a>
                <a href="admin-reviews.html"><i class="fa-solid fa-star"></i> Reviews</a>
                <a href="admin-categories.html"><i class="fa-solid fa-layer-group"></i> Categories</a>
                <a href="admin-dashboard.html" class="active"><i class="fa-solid fa-chart-line"></i> Dashboard</a>
                <a href="index.html"><i class="fa-solid fa-store"></i> Store</a>
                <a href="#" onclick="logoutAdmin()" class="logout"><i class="fa-solid fa-sign-out-alt"></i> Logout</a>
            </div>
        </div>
    </header>

    <div class="container">
        <h1 class="page-title">📊 Dashboard</h1>
        <p class="page-subtitle">Store ka poora performance ek nazar mein</p>

        <div id="dashboardContent">
            <div class="loading-box">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Dashboard load ho raha hai...
            </div>
        </div>
    </div>

    <!-- AUTH CHECK -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDZRn0KADLkLTexwzOpnqR-VKzRqQKPUGY",
            authDomain: "genz-gadgets.firebaseapp.com",
            projectId: "genz-gadgets",
            storageBucket: "genz-gadgets.firebasestorage.app",
            messagingSenderId: "473246555348",
            appId: "1:473246555348:web:9944b3fc49a8a57e966f41"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        onAuthStateChanged(auth, function(user) {
            if (!user) {
                window.location.href = 'admin-login.html';
            }
        });
    </script>

    <script type="module" src="js/firebase.js"></script>
    <script>
        let ordersData = [];
        let productsData = [];
        let reviewsData = [];
        let weeklyChart = null;
        let categoryChart = null;

        function waitForFirebase(callback) {
            if (window.firebaseDB) callback();
            else setTimeout(function() { waitForFirebase(callback); }, 100);
        }

        async function fetchAllData() {
            return new Promise(function(resolve) {
                waitForFirebase(async function() {
                    try {
                        const { db, collection, getDocs } = window.firebaseDB;
                        
                        const ordersSnap = await getDocs(collection(db, 'orders'));
                        ordersData = [];
                        ordersSnap.forEach(function(doc) { ordersData.push(doc.data()); });
                        
                        const productsSnap = await getDocs(collection(db, 'products'));
                        productsData = [];
                        productsSnap.forEach(function(doc) { productsData.push(doc.data()); });
                        
                        const reviewsSnap = await getDocs(collection(db, 'reviews'));
                        reviewsData = [];
                        reviewsSnap.forEach(function(doc) { reviewsData.push(doc.data()); });
                        
                        resolve(true);
                    } catch (error) {
                        console.error('Fetch error:', error);
                        resolve(false);
                    }
                });
            });
        }

        async function loadDashboard() {
            const loaded = await fetchAllData();
            if (!loaded) {
                document.getElementById('dashboardContent').innerHTML = 
                    '<div class="loading-box"><i class="fa-solid fa-circle-exclamation"></i><p>Data load nahi hua</p></div>';
                return;
            }
            renderDashboard();
        }

        function renderDashboard() {
            // ===== CALCULATE STATS =====
            const totalOrders = ordersData.length;
            const completedOrders = ordersData.filter(function(o) { return o.status === 'Completed'; });
            const pendingOrders = ordersData.filter(function(o) { return o.status === 'Pending'; });
            
            const totalRevenue = completedOrders.reduce(function(sum, o) { return sum + (o.total || 0); }, 0);
            const pendingRevenue = pendingOrders.reduce(function(sum, o) { return sum + (o.total || 0); }, 0);
            
            const totalProducts = productsData.length;
            const totalReviews = reviewsData.length;
            let avgRating = 0;
            if (totalReviews > 0) {
                let sum = 0;
                reviewsData.forEach(function(r) { sum += r.rating; });
                avgRating = (sum / totalReviews).toFixed(1);
            }

            // ===== CALCULATE TOP PRODUCTS =====
            const productSales = {};
            completedOrders.forEach(function(order) {
                (order.items || []).forEach(function(item) {
                    if (!productSales[item.id]) {
                        productSales[item.id] = { name: item.name, qty: 0, revenue: 0 };
                    }
                    productSales[item.id].qty += item.quantity;
                    productSales[item.id].revenue += (item.price * item.quantity);
                });
            });
            const topProducts = Object.values(productSales)
                .sort(function(a, b) { return b.revenue - a.revenue; })
                .slice(0, 5);
            
            const maxRevenue = topProducts.length > 0 ? topProducts[0].revenue : 1;

            // ===== WEEKLY DATA (Last 7 days) =====
            const last7Days = [];
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                d.setHours(0, 0, 0, 0);
                const next = new Date(d);
                next.setDate(next.getDate() + 1);
                
                const dayOrders = ordersData.filter(function(o) {
                    const od = new Date(o.date);
                    return od >= d && od < next;
                });
                
                const revenue = dayOrders
                    .filter(function(o) { return o.status === 'Completed'; })
                    .reduce(function(sum, o) { return sum + (o.total || 0); }, 0);
                
                last7Days.push({
                    day: dayNames[d.getDay()],
                    orders: dayOrders.length,
                    revenue: revenue
                });
            }

            // ===== CATEGORY DISTRIBUTION =====
            const categoryCount = {};
            productsData.forEach(function(p) {
                const cat = p.category || 'Other';
                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            });

            // ===== RENDER HTML =====
            document.getElementById('dashboardContent').innerHTML = `
                <div class="stats-row">
                    <div class="stat-card purple">
                        <div class="stat-icon"><i class="fa-solid fa-sack-dollar"></i></div>
                        <div class="stat-value">Rs. ${totalRevenue.toLocaleString()}</div>
                        <div class="stat-label">Total Revenue (Completed)</div>
                        <div class="stat-change">+ Rs. ${pendingRevenue.toLocaleString()} pending</div>
                    </div>
                    <div class="stat-card blue">
                        <div class="stat-icon"><i class="fa-solid fa-receipt"></i></div>
                        <div class="stat-value">${totalOrders}</div>
                        <div class="stat-label">Total Orders</div>
                        <div class="stat-change" style="color:#f59e0b;">${pendingOrders.length} pending</div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-icon"><i class="fa-solid fa-box"></i></div>
                        <div class="stat-value">${totalProducts}</div>
                        <div class="stat-label">Total Products</div>
                    </div>
                    <div class="stat-card orange">
                        <div class="stat-icon"><i class="fa-solid fa-star"></i></div>
                        <div class="stat-value">${avgRating}</div>
                        <div class="stat-label">Average Rating (${totalReviews} reviews)</div>
                    </div>
                </div>

                <div class="chart-section">
                    <div class="chart-card">
                        <h3><i class="fa-solid fa-chart-line"></i> Last 7 Days Revenue</h3>
                        <div class="chart-wrapper">
                            <canvas id="weeklyChartCanvas"></canvas>
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3><i class="fa-solid fa-chart-pie"></i> Products by Category</h3>
                        <div class="chart-wrapper">
                            <canvas id="categoryChartCanvas"></canvas>
                        </div>
                    </div>
                </div>

                <div class="section-box">
                    <h3><i class="fa-solid fa-trophy"></i> Top 5 Best Selling Products</h3>
                    ${topProducts.length === 0 ? 
                        '<p style="text-align:center; color:#94a3b8; padding:20px;">Abhi tak koi sale nahi hui</p>' :
                        topProducts.map(function(p, i) {
                            const percent = (p.revenue / maxRevenue) * 100;
                            return `
                                <div class="top-product-row">
                                    <div class="tp-rank">#${i + 1}</div>
                                    <div class="tp-info">
                                        <h4>${p.name}</h4>
                                        <small>${p.qty} items sold</small>
                                    </div>
                                    <div class="tp-bar">
                                        <div class="tp-bar-fill" style="width:${percent}%;"></div>
                                    </div>
                                    <div class="tp-value">Rs. ${p.revenue.toLocaleString()}</div>
                                </div>
                            `;
                        }).join('')
                    }
                </div>
            `;

            // ===== RENDER CHARTS =====
            setTimeout(function() {
                // Weekly Revenue Chart
                const weeklyCtx = document.getElementById('weeklyChartCanvas');
                if (weeklyCtx) {
                    if (weeklyChart) weeklyChart.destroy();
                    weeklyChart = new Chart(weeklyCtx, {
                        type: 'line',
                        data: {
                            labels: last7Days.map(function(d) { return d.day; }),
                            datasets: [{
                                label: 'Revenue (Rs.)',
                                data: last7Days.map(function(d) { return d.revenue; }),
                                borderColor: '#7c3aed',
                                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                                borderWidth: 3,
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: '#7c3aed',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(v) { return 'Rs. ' + v.toLocaleString(); }
                                    }
                                }
                            }
                        }
                    });
                }

                // Category Chart
                const catCtx = document.getElementById('categoryChartCanvas');
                if (catCtx && Object.keys(categoryCount).length > 0) {
                    if (categoryChart) categoryChart.destroy();
                    const catLabels = Object.keys(categoryCount);
                    const catData = Object.values(categoryCount);
                    const colors = ['#7c3aed', '#06b6d4', '#f59e0b', '#16a34a', '#ef4444', '#8b5cf6', '#ec4899'];
                    
                    categoryChart = new Chart(catCtx, {
                        type: 'doughnut',
                        data: {
                            labels: catLabels,
                            datasets: [{
                                data: catData,
                                backgroundColor: colors.slice(0, catLabels.length),
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 15,
                                        font: { size: 12 }
                                    }
                                }
                            }
                        }
                    });
                } else if (catCtx) {
                    catCtx.parentElement.innerHTML = '<p style="text-align:center; color:#94a3b8; padding:20px;">Koi category nahi</p>';
                }
            }, 100);
        }

        function logoutAdmin() {
            if (!confirm('Logout karna chahte hain?')) return;
            import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(function(module) {
                const auth = module.getAuth();
                module.signOut(auth).then(function() {
                    window.location.href = 'admin-login.html';
                });
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(loadDashboard, 800);
        });
    </script>
</body>
</html>
