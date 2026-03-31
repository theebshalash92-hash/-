const API_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec";
let allProducts = [];

// دالة التشغيل الفوري
async function init() {
    const container = document.getElementById('product-container');
    
    // 1. جلب البيانات من ذاكرة الجهاز (السرعة الفورية)
    const cached = localStorage.getItem('jj_store_data');
    if (cached) {
        allProducts = JSON.parse(cached);
        renderUI(allProducts);
    }

    // 2. تحديث البيانات من السيرفر في الخلفية
    try {
        const response = await fetch(API_URL);
        const freshData = await response.json();
        
        if (freshData.length > 0) {
            allProducts = freshData;
            localStorage.setItem('jj_store_data', JSON.stringify(freshData));
            renderUI(allProducts); // تحديث الشاشة بالأسعار الجديدة إن وجدت
        }
    } catch (e) {
        console.log("Offline mode or Server error");
    }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="img-container">
                <img src="${item.image || 'https://via.placeholder.com/200'}" 
                     loading="lazy" 
                     alt="${item.titleAr}"
                     onerror="this.src='https://via.placeholder.com/200'">
            </div>
            <div class="info">
                <span class="cat">${item.category}</span>
                <h3>${item.titleAr}</h3>
                <div class="bottom">
                    <span class="price">${item.price} JD</span>
                    <button onclick="addToCart('${item.barcode}')">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        p.titleAr.includes(query) || p.barcode.includes(query)
    );
    renderUI(filtered);
}

function addToCart(bc) {
    alert("تمت الإضافة للسلة: " + bc);
}

document.addEventListener('DOMContentLoaded', init);
