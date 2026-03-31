// إضافة رقم عشوائي (Timestamp) لنهاية الرابط لإجبار المتصفح على جلب أحدث البيانات
const API_URL = "https://script.google.com/macros/s/AKfycbyA4zh-03bBRGayv5aOX4TkQl2uWlYYRt8Kmz27-B4t-29U2HIFhOHPrntBtNpMREqMrQ/exec?v=" + new Date().getTime(); 

let allProducts = [];

// عند تحميل الصفحة بالكامل
window.addEventListener('DOMContentLoaded', () => {
    // 1. تنظيف الذاكرة القديمة لضمان عدم حدوث تعارض
    localStorage.removeItem('jj_supermarket_cache');
    
    // 2. إظهار رسالة انتظار للزبون
    const container = document.getElementById('product-container');
    if (container) {
        container.innerHTML = '<div class="loading">🔄 جاري تحديث الرفوف...</div>';
    }
    
    // 3. بدء جلب البيانات
    fetchData(); 
});

async function fetchData() {
    try {
        // استخدام "no-cache" لإجبار الموبايل على عدم استخدام النسخة القديمة
        const response = await fetch(API_URL, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        // التحقق من وصول البيانات
        if (data && data.length > 0) {
            allProducts = data;
            renderUI(data);
        } else {
            document.getElementById('product-container').innerHTML = 
                "<div class='loading'>📭 لا توجد مواد معروضة حالياً</div>";
        }
    } catch (error) {
        console.error("خطأ في الاتصال:", error);
        document.getElementById('product-container').innerHTML = 
            "<div class='loading'>⚠️ عذراً، تأكد من اتصال الإنترنت وحاول مجدداً</div>";
    }
}

// دالة عرض المنتجات في الصفحة
function renderUI(products) {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="img-box">
                <img src="${item.image || 'https://via.placeholder.com/150?text=JJ'}" 
                     alt="${item.titleAr}" 
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

// دالة البحث (تصفية المنتجات)
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (!searchTerm) {
        renderUI(allProducts);
        return;
    }
    
    const filtered = allProducts.filter(p => 
        (p.titleAr && p.titleAr.toLowerCase().includes(searchTerm)) || 
        (p.barcode && p.barcode.toString().includes(searchTerm))
    );
    renderUI(filtered);
}

// دالة تحديث سلة المشتريات
function addToCart() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        let currentCount = parseInt(countElement.innerText);
        countElement.innerText = currentCount + 1;
        
        // تأثير بصري للزر عند الضغط
        countElement.style.transform = "scale(1.3)";
        setTimeout(() => {
            countElement.style.transform = "scale(1)";
        }, 200);
    }
}
