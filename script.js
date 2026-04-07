const API_URL = "https://script.google.com/macros/s/AKfycbyA4zh-03bBRGayv5aOX4TkQl2uWlYYRt8Kmz27-B4t-29U2HIFhOHPrntBtNpMREqMrQ/exec"; 

let allProducts = [];
let cart = {}; 

window.onload = () => {
    fetchData(); 
};

// وظيفة جلب البيانات المعدلة لتجنب خطأ CORS
async function fetchData() {
    const container = document.getElementById('product-container');
    try {
        // نستخدم fetch بدون إضافات معقدة، جوجل سكريبت يحتاج طلب بسيط
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error("Network error");

        const data = await response.json();
        
        if (data && data.length > 0) {
            allProducts = data;
            renderUI(data);
        } else {
            container.innerHTML = "📭 لا توجد مواد حالياً.";
        }
    } catch (error) {
        console.error("Connection Error:", error);
        // محاولة جلب البيانات بطريقة بديلة إذا فشلت الأولى
        container.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p>⚠️ تعذر الاتصال التلقائي.</p>
                <button onclick="location.reload()" style="background:#000; color:#FFD700; border:1px solid #FFD700; padding:10px 20px; border-radius:20px; cursor:pointer;">إعادة المحاولة</button>
            </div>
        `;
    }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    container.innerHTML = products.map(item => {
        const qty = cart[item.barcode] || 0;
        return `
            <div class="product-card">
                <div class="img-box">
                    <img src="${item.image || 'https://via.placeholder.com/150?text=JJ'}" id="img-${item.barcode}" onerror="this.src='https://via.placeholder.com/150?text=JJ'">
                </div>
                <div class="info">
                    <h3>${item.titleAr || 'منتج'}</h3>
                    <div class="price-row">
                        <span class="price">${item.price || '0.00'} JD</span>
                        <div class="controls">
                            <button class="btn-qty" onclick="changeQty('${item.barcode}', -1)">-</button>
                            <span class="qty-num" id="qty-${item.barcode}">${qty}</span>
                            <button class="btn-qty" onclick="changeQty('${item.barcode}', 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function changeQty(barcode, delta) {
    if (!cart[barcode]) cart[barcode] = 0;
    
    if (delta > 0) { 
        flyToCart(barcode); 
    }

    cart[barcode] += delta;
    if (cart[barcode] < 0) cart[barcode] = 0;

    const qtyElement = document.getElementById(`qty-${barcode}`);
    if (qtyElement) qtyElement.innerText = cart[barcode];
    
    updateCartTotal();
}

function updateCartTotal() {
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = total;
        // حركة نبض للسلة عند الإضافة
        const basket = document.getElementById('floating-cart');
        basket.style.transform = "scale(1.2)";
        setTimeout(() => basket.style.transform = "scale(1)", 200);
    }
}

function flyToCart(barcode) {
    const imgElement = document.getElementById(`img-${barcode}`);
    const cartElement = document.getElementById('floating-cart');
    if (!imgElement || !cartElement) return;

    const rect = imgElement.getBoundingClientRect();
    const cartRect = cartElement.getBoundingClientRect();
    
    const flyer = imgElement.cloneNode();
    flyer.style.position = 'fixed';
    flyer.style.top = rect.top + 'px';
    flyer.style.left = rect.left + 'px';
    flyer.style.width = rect.width + 'px';
    flyer.style.height = rect.height + 'px';
    flyer.style.zIndex = "10000";
    flyer.style.transition = "all 0.8s cubic-bezier(0.1, 0.5, 0.4, 1)";
    flyer.style.pointerEvents = "none";
    flyer.style.borderRadius = "50%";
    
    document.body.appendChild(flyer);

    setTimeout(() => {
        flyer.style.top = (cartRect.top + 10) + 'px';
        flyer.style.left = (cartRect.left + 10) + 'px';
        flyer.style.width = '20px';
        flyer.style.height = '20px';
        flyer.style.opacity = '0';
    }, 50);

    setTimeout(() => { flyer.remove(); }, 850);
}

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        (p.titleAr && p.titleAr.toLowerCase().includes(searchTerm)) || 
        (p.barcode && p.barcode.toString().includes(searchTerm))
    );
    renderUI(filtered);
}
