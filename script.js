const SHEET_API_URL = "رابط_تطبيق_جوجل_هنا"; 

async function fetchProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = "<p>جاري التحميل...</p>";

    try {
        const response = await fetch(SHEET_API_URL);
        const data = await response.json();

        // فحص: هل البيانات عبارة عن قائمة (Array)؟
        if (Array.isArray(data)) {
            renderProducts(data);
        } else if (data.error) {
            // إذا أرجع جوجل شيت رسالة خطأ برمجية
            grid.innerHTML = `<p style="color:red;">خطأ من جوجل شيت: ${data.error}</p>`;
        } else {
            grid.innerHTML = `<p style="color:red;">البيانات المستلمة ليست قائمة منتجات.</p>`;
        }

    } catch (error) {
        console.error("خطأ:", error);
        grid.innerHTML = `<p style="color:red;">تعذر الاتصال. تأكد من نشر (Deploy) الكود كـ Anyone.</p>`;
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ""; 

    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const imageUrl = `images/${item.barcode}.jpg`; 
        const placeholder = "https://via.placeholder.com/150?text=JJ+Store";

        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" onerror="this.src='${placeholder}'">
            </div>
            <div class="product-info">
                <h3>${item.titleAr}</h3>
                <p class="price">${item.price} JD</p>
                <button class="add-btn">أضف للسلة</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

fetchProducts();
