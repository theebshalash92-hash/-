const API_URL = "https://script.google.com/macros/s/AKfycbyA4zh-03bBRGayv5aOX4TkQl2uWlYYRt8Kmz27-B4t-29U2HIFhOHPrntBtNpMREqMrQ/exec"; 

let allProducts = [];
let cart = {}; 

window.onload = () => {
    fetchData(); 
};

// 1. جلب البيانات
async function fetchData() {
    const container = document.getElementById('product-container');
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            allProducts = data;
            renderUI(data);
        } else {
            container.innerHTML = "<div class='loading'>📭 لا توجد مواد حالياً في الشيت.</div>";
        }
    } catch (error) {
        console.error("Connection Error:", error);
        container.innerHTML = "<div class='loading'>⚠️ فشل الاتصال بالبيانات.</div>";
    }
}

// 2. عرض المنتجات
function renderUI(products) {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    container.innerHTML = products.map(item => {
        let name = item.titleAr || item.الاسم || item.Item || "منتج";
        let price = item.price || item.السعر || item.Price || "0.00";
        let barcode = item.barcode ? item.barcode.toString().trim() : Math.random().toString();
        // استخدام رابط الصورة من السكريبت أو صورة افتراضية
        let img = item.image || 'https://via.placeholder.com/150?text=JJ';
        
        const qty = cart[barcode] || 0;

        return `
            <div class="product-card">
                <div class="img-box">
                    <img src="${img}" id="img-${barcode}" onerror="this.src='https://via.placeholder.com/150?text=JJ'">
                </div>
                <div class="info">
                    <h3>${name}</h3>
                    <div class="price-row">
                        <span class="price">${price} JD</span>
                        <div class="controls">
                            <button class="btn-qty" onclick="changeQty('${barcode}', -1)">-</button>
                            <span class="qty-num" id="qty-${barcode}">${qty}</span>
                            <button class="btn-qty" onclick="changeQty('${barcode}', 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 3. التحكم بالكميات
function changeQty(barcode, delta) {
    if (!cart[barcode]) cart[barcode] = 0;
    
    if (delta > 0) { flyToCart(barcode); }

    cart[barcode] += delta;
    if (cart[barcode] < 0) cart[barcode] = 0;

    const qtyElement = document.getElementById(`qty-${barcode}`);
    if (qtyElement) qtyElement.innerText = cart[barcode];
    
    updateCartTotal();
}

// 4. تحديث السلة
function updateCartTotal() {
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = total;
        const basket = document.getElementById('floating-cart');
        basket.style.transform = "scale(1.2)";
        setTimeout(() => basket.style.transform = "scale(1)", 200);
    }
}

// 5. تأثير الطيران
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
    flyer.style.zIndex = "10000";
    flyer.style.transition = "all 0.8s cubic-bezier(0.1, 0.5, 0.4, 1)";
    flyer.style.pointerEvents = "none";
    flyer.style.borderRadius = "10px";
    
    document.body.appendChild(flyer);

    setTimeout(() => {
        flyer.style.top = (cartRect.top + 10) + 'px';
        flyer.style.left = (cartRect.left + 10) + 'px';
        flyer.style.width = '20px';
        flyer.style.opacity = '0';
    }, 50);

    setTimeout(() => { flyer.remove(); }, 850);
}

// 6. البحث
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => {
        let name = (p.titleAr || p.الاسم || p.Item || "").toLowerCase();
        let barcode = (p.barcode || "").toString();
        return name.includes(searchTerm) || barcode.includes(searchTerm);
    });
    renderUI(filtered);
}
