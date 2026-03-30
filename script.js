const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec"; 

async function fetchProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = "<p style='text-align:center;'>جاري فحص البيانات...</p>";

    try {
        const response = await fetch(SHEET_API_URL);
        const data = await response.json();

        // فحص: هل البيانات مصفوفة (Array)؟
        if (Array.isArray(data)) {
            renderProducts(data);
        } else {
            // إذا لم تكن مصفوفة، نعرض ما وصلنا فعلياً لنفهم المشكلة
            console.error("البيانات المستلمة ليست مصفوفة:", data);
            grid.innerHTML = `<p style="color:red; text-align:center;">
                خطأ: استلمنا بيانات غير صحيحة.<br>
                الرسالة: ${data.error || "غير معروفة"}
            </p>`;
        }

    } catch (error) {
        console.error("خطأ في التحميل:", error);
        grid.innerHTML = `<p style="color:red; text-align:center;">تعذر الاتصال بقاعدة البيانات. تأكد من نشر الرابط بصلاحية Anyone.</p>`;
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ""; 

    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // استخدمنا صورة بديلة من مصدر مختلف لتجنب خطأ ERR_NAME_NOT_RESOLVED
        const imageUrl = `images/${item.barcode}.jpg`; 
        const placeholder = "https://placehold.co/150x150?text=No+Image";

        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${item.titleAr}" onerror="this.src='${placeholder}'">
            </div>
            <div class="product-info">
                <h3>${item.titleAr || 'بدون اسم'}</h3>
                <p class="price">${item.price || '0.00'} JD</p>
                <button class="add-btn">أضف للسلة <i class="fas fa-plus"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
}

fetchProducts();
