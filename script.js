const API_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec";
let allProducts = [];

async function init() {
    // 1. عرض البيانات المحفوظة فوراً (سرعة فورية)
    const cached = localStorage.getItem('jj_store_cache');
    if (cached) {
        allProducts = JSON.parse(cached);
        renderUI(allProducts);
    }

    // 2. جلب التحديثات من جوجل في الخلفية
    try {
        const response = await fetch(API_URL);
        const freshData = await response.json();
        
        if (freshData.length > 0) {
            allProducts = freshData;
            localStorage.setItem('jj_store_cache', JSON.stringify(freshData));
            renderUI(allProducts); 
        }
    } catch (e) { console.log("Offline Mode"); }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="img-box">
                <img src="${item.image || 'https://via.placeholder.com/200'}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="cat">${item.category}</span>
                <h3>${item.titleAr}</h3>
                <div class="price-row">
                    <span class="price">${item.price} JD</span>
                    <button onclick="addToCart('${item.barcode}')">أضف +</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = allProducts.filter(p => p.titleAr.includes(query) || p.barcode.includes(query));
    renderUI(filtered);
}

document.addEventListener('DOMContentLoaded', init);

const API_URL = "رابط_الـ_WEB_APP_الخاص_بك";
let cart = [];

// التحكم في فيديو الانترو
window.onload = function() {
    const video = document.getElementById('intro-video');
    const layer = document.getElementById('intro-layer');
    
    // إخفاء الانترو عند انتهاء الفيديو
    video.onended = function() {
        layer.style.display = 'none';
        init(); // تشغيل جلب البيانات
    };

    // حماية في حال لم يشتغل الفيديو (يختفي بعد 4 ثوانٍ)
    setTimeout(() => { layer.style.display = 'none'; init(); }, 4500);
};

async function init() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderUI(data);
    } catch (e) { console.log("Error loading products"); }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="img-box"><img src="${item.image}"></div>
            <div style="padding:10px">
                <h3 style="font-size:14px">${item.titleAr}</h3>
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <span style="font-weight:bold">${item.price} JD</span>
                    <button class="add-btn" onclick="addToCart('${item.barcode}')">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(barcode) {
    cart.push(barcode);
    document.getElementById('cart-count').innerText = cart.length;
    // تأثير بصري بسيط
    const drawer = document.getElementById('cart-drawer');
    drawer.style.transform = "scale(1.2)";
    setTimeout(() => drawer.style.transform = "scale(1)", 200);
}



