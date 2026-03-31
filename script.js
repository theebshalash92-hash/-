// 1. إعدادات الربط (استبدل الرابط برابط الـ Web App الخاص بك)
const API_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec"; 

let allProducts = []; // مخزن لجميع المنتجات
let cart = [];        // مخزن لسلة المشتريات

// 2. التحكم في فيديو الانترو (Intro Video)
window.onload = function() {
    const introLayer = document.getElementById('intro-layer');
    const introVideo = document.getElementById('intro-video');

    // إخفاء الانترو عند انتهاء الفيديو
    if (introVideo) {
        introVideo.onended = function() {
            fadeOutIntro();
        };
    }

    // حماية إضافية: إخفاء الانترو تلقائياً بعد 4 ثوانٍ إذا فشل الفيديو
    setTimeout(fadeOutIntro, 4500);
};

function fadeOutIntro() {
    const introLayer = document.getElementById('intro-layer');
    if (introLayer) {
        introLayer.style.opacity = '0';
        setTimeout(() => {
            introLayer.style.display = 'none';
            init(); // بدء تشغيل المتجر بعد اختفاء الانترو
        }, 1000);
    }
}

// 3. بدء تشغيل المتجر وجلب البيانات (Data Fetching & Caching)
async function init() {
    // محاولة التحميل من الذاكرة المحلية (Cache) للسرعة الفورية
    const cachedData = localStorage.getItem('jj_store_data');
    if (cachedData) {
        allProducts = JSON.parse(cachedData);
        renderProducts(allProducts);
    }

    // جلب التحديثات من جوجل شيت في الخلفية
    try {
        const response = await fetch(API_URL);
        const freshData = await response.json();

        if (freshData && freshData.length > 0) {
            allProducts = freshData;
            localStorage.setItem('jj_store_data', JSON.stringify(freshData));
            renderProducts(allProducts); // تحديث الواجهة بالأسعار أو المنتجات الجديدة
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// 4. عرض المنتجات في الصفحة (Rendering)
function renderProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<div class="loading-msg">لا توجد منتجات حالياً.</div>';
        return;
    }

    container.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="img-wrapper">
                <img src="${item.image || 'https://via.placeholder.com/200'}" 
                     loading="lazy" 
                     alt="${item.titleAr}"
                     onerror="this.src='https://via.placeholder.com/200'">
            </div>
            <div class="product-info">
                <span class="category-tag">${item.category || 'سوبر ماركت'}</span>
                <h3 class="product-title">${item.titleAr}</h3>
                <div class="price-row">
                    <span class="price-value">${item.price} JD</span>
                    <button class="add-to-cart-btn" onclick="addToCart('${item.barcode}', '${item.titleAr}', ${item.price})">
                        إضافة +
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 5. نظام البحث (Search)
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        p.titleAr.toLowerCase().includes(searchTerm) || 
        p.barcode.toString().includes(searchTerm)
    );
    renderProducts(filtered);
}

// 6. إدارة سلة المشتريات (Cart Logic)
function addToCart(barcode, name, price) {
    // إضافة المنتج للسلة
    cart.push({ barcode, name, price });
    
    // تحديث رقم العداد على الأيقونة العائمة
    document.getElementById('cart-count').innerText = cart.length;

    // تأثير بصري عند الإضافة
    const cartBtn = document.getElementById('floating-cart');
    cartBtn.classList.add('bounce');
    setTimeout(() => cartBtn.classList.remove('bounce'), 300);
}

function openCartView() {
    const modal = document.getElementById('cart-modal');
    const cartList = document.getElementById('cart-items-list');
    
    modal.style.display = 'block';
    
    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align:center; padding:20px;">السلة فارغة حالياً.</p>';
        return;
    }

    cartList.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>${item.price} JD</span>
            <button onclick="removeFromCart(${index})" style="color:red; background:none; border:none; cursor:pointer;">حذف</button>
        </div>
    `).join('');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    document.getElementById('cart-count').innerText = cart.length;
    openCartView(); // إعادة تحديث القائمة
}

function closeCartView() {
    document.getElementById('cart-modal').style.display = 'none';
}

// 7. إرسال الطلب عبر واتساب (WhatsApp Integration)
function sendToWhatsapp() {
    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }

    let message = "طلب جديد من JJ's Supermarket:%0A%0A";
    let total = 0;

    cart.forEach((item, i) => {
        message += `${i+1}. ${item.name} - ${item.price} JD%0A`;
        total += parseFloat(item.price);
    });

    message += `%0A*المجموع الكلي: ${total.toFixed(2)} JD*`;
    
    // استبدل الرقم برقم واتساب المحل الخاص بك (بدون أصفار أو +)
    const phoneNumber = "962788984458"; 
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}
