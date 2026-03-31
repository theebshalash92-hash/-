// الرابط الجديد الذي أرسلته والذي يعمل بنجاح
const API_URL = "https://script.google.com/macros/s/AKfycbyA4zh-03bBRGayv5aOX4TkQl2uWlYYRt8Kmz27-B4t-29U2HIFhOHPrntBtNpMREqMrQ/exec"; 

let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    // إظهار رسالة تحميل بسيطة
    document.getElementById('product-container').innerHTML = '<div class="loading">جاري جلب المنتجات...</div>';
    loadData();
});

async function loadData() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        if (data && data.length > 0) {
            allProducts = data;
            renderUI(data);
        } else {
            document.getElementById('product-container').innerHTML = "لا توجد مواد حالياً في القائمة";
        }
    } catch (e) {
        console.error("Fetch Error:", e);
        document.getElementById('product-container').innerHTML = "خطأ في الاتصال بالسيرفر، يرجى المحاولة لاحقاً";
    }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="img-box">
                <img src="${item.image || 'https://via.placeholder.com/150?text=JJ'}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=JJ'">
            </div>
            <div class="info">
                <h3>${item.titleAr}</h3>
                <div class="price-row">
                    <span class="price">${item.price} JD</span>
                    <button class="add-btn" onclick="addOne()">إضافة +</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const val = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        (p.titleAr && p.titleAr.includes(val)) || 
        (p.barcode && p.barcode.includes(val))
    );
    renderUI(filtered);
}

function addOne() {
    const cartCount = document.getElementById('cart-count');
    cartCount.innerText = parseInt(cartCount.innerText) + 1;
}
