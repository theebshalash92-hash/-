const API_URL = "https://script.google.com/macros/s/AKfycbyA4zh-03bBRGayv5aOX4TkQl2uWlYYRt8Kmz27-B4t-29U2HIFhOHPrntBtNpMREqMrQ/exec"; 

let allProducts = [];
let cart = {}; // لتخزين الكميات

window.onload = () => { fetchData(); };

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data && data.length > 0) {
            allProducts = data;
            renderUI(data);
        }
    } catch (error) {
        document.getElementById('product-container').innerHTML = "⚠️ خطأ في الاتصال";
    }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(item => {
        const qty = cart[item.barcode] || 0;
        return `
            <div class="product-card" id="card-${item.barcode}">
                <div class="img-box">
                    <img src="${item.image || 'https://via.placeholder.com/150'}" id="img-${item.barcode}" onerror="this.src='https://via.placeholder.com/150'">
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
    
    // إذا ضغطنا زائد، نقوم بعمل تأثير الطيران
    if (delta > 0) {
        flyToCart(barcode);
    }

    cart[barcode] += delta;
    if (cart[barcode] < 0) cart[barcode] = 0;

    // تحديث الرقم في البطاقة
    document.getElementById(`qty-${barcode}`).innerText = cart[barcode];
    updateCartTotal();
}

function updateCartTotal() {
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    document.getElementById('cart-count').innerText = total;
    
    // حركة بسيطة للسلة عند التحديث
    const basket = document.getElementById('floating-cart');
    basket.style.transform = "scale(1.2)";
    setTimeout(() => basket.style.transform = "scale(1)", 200);
}

function flyToCart(barcode) {
    const imgElement = document.getElementById(`img-${barcode}`);
    const cartElement = document.getElementById('floating-cart');
    
    if (!imgElement || !cartElement) return;

    // إنشاء نسخة من الصورة للطيران
    const flyer = imgElement.cloneNode();
    const rect = imgElement.getBoundingClientRect();
    const cartRect = cartElement.getBoundingClientRect();

    flyer.classList.add('flying-img');
    flyer.style.top = rect.top + 'px';
    flyer.style.left = rect.left + 'px';
    flyer.style.width = rect.width + 'px';

    document.body.appendChild(flyer);

    // بدء الأنيميشن بعد لحظة بسيطة
    setTimeout(() => {
        flyer.style.top = (cartRect.top + 10) + 'px';
        flyer.style.left = (cartRect.left + 10) + 'px';
        flyer.style.width = '20px';
        flyer.style.height = '20px';
        flyer.style.opacity = '0.5';
    }, 10);

    // حذف الصورة بعد انتهاء الأنيميشن
    setTimeout(() => {
        flyer.remove();
    }, 800);
}

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        (p.titleAr && p.titleAr.toLowerCase().includes(searchTerm)) || 
        (p.barcode && p.barcode.toString().includes(searchTerm))
    );
    renderUI(filtered);
}
