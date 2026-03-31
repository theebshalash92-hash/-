// 1. ضع رابط الـ Web App الخاص بك هنا
const API_URL = "https://script.google.com/macros/s/AKfycbz_XXXXXXXXX/exec";

let allProducts = []; // مخزن مؤقت للمنتجات للبحث السريع

/**
 * دالة جلب البيانات من Google Apps Script
 */
async function fetchProducts() {
    const container = document.getElementById('product-container');
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.error) {
            container.innerHTML = `<div class="loading-status" style="color:red;">خطأ: ${data.error}</div>`;
            return;
        }

        allProducts = data;
        displayProducts(allProducts);

    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = `<div class="loading-status" style="color:red;">فشل الاتصال بالخادم. يرجى التأكد من نشر السكريبت (Deploy).</div>`;
    }
}

/**
 * دالة عرض المنتجات في الـ HTML
 */
function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = ""; // تنظيف الحاوية

    if (products.length === 0) {
        container.innerHTML = `<div class="loading-status">لا توجد منتجات مطابقة.</div>`;
        return;
    }

    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // رابط الصورة المباشر من Google Drive (المولّد في Apps Script)
        // إذا لم تكن هناك صورة، استخدم صورة placeholder
        const imgUrl = item.image || "https://via.placeholder.com/200x200?text=No+Image";

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${imgUrl}" alt="${item.titleAr}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x200?text=Image+Error'">
            </div>
            <div class="product-info">
                <span class="category-label">${item.category || 'سوبر ماركت'}</span>
                <h3 class="product-title">${item.titleAr}</h3>
                <div class="price-row">
                    <span class="price-value">${parseFloat(item.price).toFixed(2)} JD</span>
                    <button class="add-btn" onclick="addToCart('${item.barcode}', '${item.titleAr}')">إضافة</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * دالة البحث السريع
 */
function filterProducts() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        p.titleAr.toLowerCase().includes(term) || 
        p.barcode.toString().includes(term)
    );
    displayProducts(filtered);
}

/**
 * دالة زر الإضافة (تنبيه)
 */
function addToCart(barcode, name) {
    alert(`تمت إضافة [${name}] إلى السلة بنجاح!`);
}

// البدء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', fetchProducts);
