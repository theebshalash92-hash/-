// 1. استبدل هذا الرابط برابط الـ Web App الخاص بك من Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec";

// مصفوفة لتخزين المنتجات محلياً للبحث والفلترة السريعة
let allProducts = [];

// 2. الدالة الرئيسية لجلب البيانات عند تحميل الصفحة
async function loadSupermarketData() {
    const container = document.getElementById('product-container');
    container.innerHTML = '<div class="loading">جاري تحديث قائمة المنتجات من JJ\'s Supermarket...</div>';

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();

        if (data.error) {
            container.innerHTML = `<div class="error">خطأ في السكريبت: ${data.error}</div>`;
            return;
        }

        allProducts = data;
        displayProducts(allProducts);

    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = '<div class="error">عذراً، تعذر الاتصال بقاعدة البيانات. تأكد من نشر السكريبت (Deploy) بشكل صحيح.</div>';
    }
}

// 3. دالة عرض المنتجات في الصفحة
function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = ""; // مسح محتوى التحميل

    if (products.length === 0) {
        container.innerHTML = '<div class="no-results">لا توجد منتجات متوفرة حالياً.</div>';
        return;
    }

    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // رابط الصورة: يستخدم الرابط القادم من درايف، أو صورة افتراضية إذا كان الرابط فارغاً
        const imageSrc = item.image || "https://via.placeholder.com/200x200?text=No+Image";

        card.innerHTML = `
            <div class="badge">${item.category}</div>
            <img src="${imageSrc}" alt="${item.titleAr}" onerror="this.src='https://via.placeholder.com/200x200?text=Image+Error'">
            <div class="product-details">
                <h3 class="product-title">${item.titleAr}</h3>
                <p class="barcode-text">Barcode: ${item.barcode}</p>
                <div class="price-row">
                    <span class="price-tag">${item.price.toFixed(2)} JOD</span>
                    <button class="buy-btn" onclick="addToCart('${item.barcode}')">إضافة</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 4. دالة البحث (يمكنك ربطها بـ <input id="searchInput">)
function searchProducts(query) {
    const filtered = allProducts.filter(p => 
        p.titleAr.toLowerCase().includes(query.toLowerCase()) || 
        p.barcode.includes(query)
    );
    displayProducts(filtered);
}

// 5. دالة إضافة للسلة (تنبيه بسيط حالياً)
function addToCart(barcode) {
    const product = allProducts.find(p => p.barcode === barcode);
    if (product) {
        console.log(`تمت إضافة ${product.titleAr} للسلة`);
        alert(`تمت إضافة [${product.titleAr}] إلى سلة المشتريات بنجاح!`);
    }
}

// تشغيل الجلب عند فتح المتصفح
document.addEventListener('DOMContentLoaded', loadSupermarketData);
