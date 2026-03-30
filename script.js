/**
 * إعدادات السوبر ماركت - JJ's Supermarket
 * 1. استبدل الرابط أدناه برابط الـ Web App (Deploy) الخاص بك من Google Apps Script
 */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec";

// مصفوفة تخزين البيانات في ذاكرة المتصفح للسرعة والفلترة
let productsData = [];

/**
 * الوظيفة 1: جلب البيانات عند تحميل الصفحة
 */
async function fetchInventory() {
    // الوصول إلى الحاوية في ملف HTML
    const container = document.getElementById('product-container');

    // حل مشكلة الخطأ (Cannot set properties of null): التحقق من وجود العنصر أولاً
    if (!container) {
        console.error("خطأ تقني: لم يتم العثور على عنصر 'product-container' في صفحة HTML. تأكد من وجود <div id='product-container'></div>");
        return;
    }

    // إظهار رسالة تحميل احترافية
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
            <div class="loader"></div>
            <p>جاري تحميل منتجات السوبر ماركت... يرجى الانتظار</p>
        </div>
    `;

    try {
        // جلب البيانات من Google Apps Script
        const response = await fetch(SCRIPT_URL);
        
        // التعامل مع خطأ 429 (طلبات كثيرة)
        if (response.status === 429) {
            container.innerHTML = "<p style='color:orange; text-align:center; grid-column:1/-1;'>توقف مؤقت من جوجل (الطلبات كثيرة)، يرجى تحديث الصفحة بعد دقيقة.</p>";
            return;
        }

        const data = await response.json();

        if (data.error) {
            container.innerHTML = `<p style="color:red; text-align:center; grid-column:1/-1;">خطأ في السكريبت: ${data.error}</p>`;
            return;
        }

        // تخزين البيانات وعرضها
        productsData = data;
        renderProducts(productsData);

    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: red;">
                <p>عذراً، فشل الاتصال بقاعدة البيانات.</p>
                <small>تأكد من اتصال الإنترنت ومن رابط الـ Deployment.</small>
            </div>
        `;
    }
}

/**
 * الوظيفة 2: رسم المنتجات على الشاشة (UI)
 */
function renderProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = ""; // مسح رسالة التحميل

    if (products.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>لا توجد منتجات متوفرة حالياً.</p>";
        return;
    }

    products.forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        // بما أن الصور تسمى بالباركود فقط في درايف، الرابط يأتي جاهزاً من Apps Script
        // نضع صورة افتراضية في حال فشل التحميل أو كان الرابط فارغاً
        const finalImage = item.image || "https://via.placeholder.com/200x200?text=No+Image";

        productCard.innerHTML = `
            <div class="category-tag">${item.category || 'عام'}</div>
            <div class="image-box">
                <img src="${finalImage}" alt="${item.titleAr}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/200x200?text=Image+Error'">
            </div>
            <div class="product-details">
                <h3 class="product-name">${item.titleAr}</h3>
                <span class="barcode-label">باركود: ${item.barcode}</span>
                <div class="price-row">
                    <span class="current-price">${parseFloat(item.price).toFixed(2)} JOD</span>
                    <button class="cart-button" onclick="handleAddToCart('${item.barcode}')">إضافة</button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

/**
 * الوظيفة 3: البحث السريع (اختياري - إذا أردت ربطه بـ Input)
 */
function searchInventory(query) {
    const filtered = productsData.filter(p => 
        p.titleAr.toLowerCase().includes(query.toLowerCase()) || 
        p.barcode.includes(query)
    );
    renderProducts(filtered);
}

/**
 * الوظيفة 4: معالجة الإضافة للسلة
 */
function handleAddToCart(barcode) {
    const product = productsData.find(p => p.barcode === barcode);
    if (product) {
        // يمكنك هنا تطوير نظام سلة حقيقي، حالياً يكتفي بالتنبيه
        console.log("إضافة للمشتريات:", product.titleAr);
        alert(`تمت إضافة ${product.titleAr} بنجاح!`);
    }
}

/**
 * تشغيل الكود بمجرد أن تصبح الصفحة جاهزة
 * هذا يضمن عدم ظهور خطأ (null) لأن الكود ينتظر بناء الـ HTML أولاً
 */
document.addEventListener('DOMContentLoaded', fetchInventory);
