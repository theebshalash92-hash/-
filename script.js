const API_URL = "https://script.google.com/macros/s/AKfycbyA4zh-03bBRGayv5aOX4TkQl2uWlYYRt8Kmz27-B4t-29U2HIFhOHPrntBtNpMREqMrQ/exec"; 

let allProducts = [];

window.addEventListener('DOMContentLoaded', () => {
    console.log("الموقع جاهز، جاري طلب البيانات...");
    loadData();
});

async function loadData() {
    const container = document.getElementById('product-container');
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        console.log("البيانات المستلمة:", data);

        if (data && data.length > 0) {
            allProducts = data;
            renderUI(data);
        } else {
            container.innerHTML = "<div class='loading'>قائمة المنتجات فارغة حالياً</div>";
        }
    } catch (e) {
        console.error("خطأ:", e);
        container.innerHTML = "<div class='loading'>حدث خطأ أثناء جلب البيانات، يرجى تحديث الصفحة</div>";
    }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="img-box">
                <img src="${item.image || 'https://via.placeholder.com/150?text=JJ'}" loading="lazy">
            </div>
            <div class="info">
                <h3>${item.titleAr || 'منتج'}</h3>
                <div class="price-row">
                    <span class="price">${item.price || '0.00'} JD</span>
                    <button class="add-btn" onclick="addOne()">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const val = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        (p.titleAr && p.titleAr.includes(val)) || 
        (p.barcode && p.barcode.includes(val))
    );
    renderUI(filtered);
}

function addOne() {
    const cartCount = document.getElementById('cart-count');
    cartCount.innerText = parseInt(cartCount.innerText) + 1;
}
