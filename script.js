// 1. استبدل هذا الرابط بالرابط الجديد الذي حصلت عليه بعد الـ Deploy
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec"; 

// 2. دالة جلب البيانات
async function fetchProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = "<p>جاري تحميل المنتجات...</p>";

    try {
        const response = await fetch(SHEET_API_URL);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("خطأ في التحميل:", error);
        grid.innerHTML = `<p style="color:red;">خطأ في الاتصال بقاعدة البيانات. تأكد من إعدادات الـ Deploy في جوجل شيت.</p>`;
    }
}

// 3. دالة عرض المنتجات
function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ""; 

    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // ملاحظة: استبدل YOUR_FOLDER_ID بمعرف مجلد الصور في جوجل درايف
        // أو ارفع الصور على GitHub في مجلد اسمه images واجعل المسار: `images/${item.barcode}.jpg`
        const imageUrl = `images/${item.barcode}.jpg`; 
        const placeholder = "https://via.placeholder.com/150?text=JJ+Store";

        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${item.titleAr}" onerror="this.src='${placeholder}'">
            </div>
            <div class="product-info">
                <h3>${item.titleAr}</h3>
                <p class="category">${item.category || 'عام'}</p>
                <p class="price">${parseFloat(item.price).toFixed(2)} JD</p>
                <button class="add-btn" onclick="alert('تمت إضافة ${item.titleAr} للسلة')">
                    أضف للسلة <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// تشغيل التطبيق
fetchProducts();
