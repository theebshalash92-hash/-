// استخدام Timestamp فقط لتجاوز الكاش بدون تعقيد البرمجة
const API_URL = "https://script.google.com/macros/s/AKfycbyA4zh-03bBRGayv5aOX4TkQl2uWlYYRt8Kmz27-B4t-29U2HIFhOHPrntBtNpMREqMrQ/exec?v=" + new Date().getTime(); 

let allProducts = [];

window.addEventListener('DOMContentLoaded', () => {
    // إظهار رسالة بسيطة للزبون
    const container = document.getElementById('product-container');
    container.innerHTML = '<div class="loading">🔄 جاري جلب المنتجات...</div>';
    
    fetchData(); 
});

async function fetchData() {
    try {
        // نداء بسيط جداً للرابط (هذا الشكل هو الأكثر استقراراً للموبايل)
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data && data.length > 0) {
            allProducts = data;
            renderUI(data);
        } else {
            document.getElementById('product-container').innerHTML = "📭 لا توجد مواد حالياً";
        }
    } catch (error) {
        console.error("Error:", error);
        // في حال فشل الاتصال، سنحاول إظهار البيانات المخزنة سابقاً إن وجدت
        document.getElementById('product-container').innerHTML = "⚠️ عذراً، يرجى تحديث الصفحة (Refresh)";
    }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="img-box">
                <img src="${item.image || 'https://via.placeholder.com/150?text=JJ'}" 
                     onerror="this.src='https://via.placeholder.com/150?text=JJ'"
                     loading="lazy">
            </div>
            <div class="info">
                <h3>${item.titleAr || 'منتج'}</h3>
                <div class="price-row">
                    <span class="price">${item.price || '0.00'} JD</span>
                    <button class="add-btn" onclick="addToCart()">إضافة +</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        (p.titleAr && p.titleAr.toLowerCase().includes(searchTerm)) || 
        (p.barcode && p.barcode.toString().includes(searchTerm))
    );
    renderUI(filtered);
}

function addToCart() {
    const countElement = document.getElementById('cart-count');
    let currentCount = parseInt(countElement.innerText);
    countElement.innerText = currentCount + 1;
}
