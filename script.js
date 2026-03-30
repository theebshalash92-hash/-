// 1. ضع هنا الرابط الذي حصلت عليه من "Google Apps Script" (Web App URL)
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec"; 

// 2. قاعدة بيانات الصور (استبدل الرابط برابط مجلد الصور العام الخاص بك)
const IMAGE_FOLDER_URL = "https://your-drive-link.com/products/";

async function fetchProducts() {
    try {
        const response = await fetch(SHEET_API_URL);
        const data = await response.json();
        displayProducts(data);
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        document.getElementById('productGrid').innerHTML = "<p>عذراً، تعذر تحميل المنتجات حالياً.</p>";
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ""; // مسح المحتوى القديم

    products.forEach(item => {
        // إنشاء كرت المنتج
        const card = document.createElement('div');
        card.className = 'product-card';

        // ربط الصورة بالباركود تلقائياً
        // نستخدم وسم onerror لإظهار صورة افتراضية في حال عدم وجود صورة للمادة
        const imageUrl = `${IMAGE_FOLDER_URL}${item.barcode}.jpg`;
        const placeholder = "https://via.placeholder.com/150?text=No+Image";

        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${item.titleAr}" onerror="this.src='${placeholder}'">
            </div>
            <div class="product-info">
                <h3>${item.titleAr}</h3>
                <p class="category">${item.category}</p>
                <p class="price">${item.price} JD</p>
                <button class="add-btn" onclick="addToCart('${item.barcode}', '${item.titleAr}', ${item.price})">
                    أضف للسلة <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// دالة بسيطة لإضافة المواد للسلة (يمكن تطويرها لاحقاً)
function addToCart(barcode, name, price) {
    console.log(`تم إضافة: ${name} بسعر ${price} JD`);
    alert(`تم إضافة ${name} إلى السلة بنجاح!`);
}

// تشغيل الدالة عند تحميل الصفحة
window.onload = fetchProducts;
