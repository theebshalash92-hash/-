// ضع الرابط الذي حصلت عليه من Google Apps Script بين علامتي التنصيص
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec"; 

// رابط المجلد الذي يحتوي على صورك في الدرايف (تأكد أن الصور عامة)
const IMAGE_FOLDER_URL = "https://lh3.googleusercontent.com/d/";

async function fetchProducts() {
    try {
        const response = await fetch(SHEET_API_URL);
        const products = await response.json();
        
        const grid = document.getElementById('productGrid');
        grid.innerHTML = ""; // مسح المحتوى التجريبي

        products.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';

            // ربط الصورة بالباركود (نفترض أن الصيغة .jpg)
            const imageUrl = `${IMAGE_FOLDER_URL}${item.barcode}`; 
            const placeholder = "https://via.placeholder.com/150?text=JJ+Supermarket";

            card.innerHTML = `
                <div class="product-image">
                    <img src="${imageUrl}" alt="${item.titleAr}" onerror="this.src='${placeholder}'">
                </div>
                <div class="product-info">
                    <h3>${item.titleAr}</h3>
                    <p class="category">${item.category}</p>
                    <p class="price">${item.price} JD</p>
                    <button class="add-btn">أضف للسلة <i class="fas fa-plus"></i></button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("خطأ في التحميل:", error);
    }
}

// تشغيل جلب البيانات عند فتح الصفحة
fetchProducts();
