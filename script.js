/**
 * إعدادات الربط مع Google Apps Script - JJ's Supermarket
 * استبدل الرابط أدناه برابط الـ Web App (Deploy) الخاص بك
 */
const API_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec";

// مصفوفة لتخزين المنتجات محلياً
let productsData = [];

/**
 * الوظيفة الأساسية: جلب البيانات من السكريبت
 */
async function loadProducts() {
    const container = document.getElementById('product-container');
    
    // رسالة انتظار أثناء جلب البيانات
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
            <p>جاري تحديث قائمة المنتجات... يرجى الانتظار</p>
        </div>
    `;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.error) {
            container.innerHTML = `<p style="color:red;">خطأ: ${data.error}</p>`;
            return;
        }

        productsData = data;
        renderUI(productsData);

    } catch (error) {
        console.error("Connection Error:", error);
        container.innerHTML = `<p style="color:red; text-align: center; grid-column: 1/-1;">فشل الاتصال. تأكد من نشر السكريبت (Deploy).</p>`;
    }
}

/**
 * وظيفة عرض المنتجات بناءً على البيانات المستلمة
 */
function renderUI(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = ""; 

    if (products.length === 0) {
        container.innerHTML = "<p>لا توجد منتجات حالياً.</p>";
        return;
    }

    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // ملاحظة: الرابط 'item.image' يتم توليده في Apps Script بناءً على الباركود
        // وإذا لم توجد صورة، نستخدم صورة افتراضية
        const imgSrc = item.image || "https://via.placeholder.com/200x200?text=No+Image";

        card.innerHTML = `
            <div class="product-badge">${item.category || 'عام'}</div>
            <div class="image-wrapper">
                <img src="${imgSrc}" alt="${item.titleAr}" onerror="this.src='https://via.placeholder.com/200x200?text=Image+Error'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${item.titleAr}</h3>
                <p class="product-barcode">باركود: ${item.barcode}</p>
                <div class="price-section">
                    <span class="product-price">${parseFloat(item.price).toFixed(2)} JOD</span>
                    <button class="add-btn" onclick="addToCart('${item.barcode}')">إضافة</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * وظيفة الإضافة للسلة
 */
function addToCart(barcode) {
    const product = productsData.find(p => p.barcode === barcode);
    if (product) {
        alert(`تمت إضافة ${product.titleAr} إلى السلة.`);
    }
}

// البدء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadProducts);
