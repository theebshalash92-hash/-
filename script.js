const API_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec";
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    const cached = localStorage.getItem('jj_cache');
    if (cached) {
        allProducts = JSON.parse(cached);
        render(allProducts);
    }
    load();
});

async function load() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.length > 0) {
            allProducts = data;
            localStorage.setItem('jj_cache', JSON.stringify(data));
            render(data);
        }
    } catch (e) { console.log("خطأ في التحميل"); }
}

function render(data) {
    const container = document.getElementById('product-container');
    container.innerHTML = data.map(item => `
        <div class="product-card">
            <div class="img-box"><img src="${item.image || 'https://via.placeholder.com/150'}" loading="lazy"></div>
            <div class="info">
                <h3>${item.titleAr}</h3>
                <span class="price">${item.price} JD</span>
                <button class="add-btn" onclick="add()">إضافة +</button>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const q = document.getElementById('search-input').value.toLowerCase();
    render(allProducts.filter(p => p.titleAr.includes(q) || p.barcode.includes(q)));
}

function add() {
    let c = document.getElementById('cart-count');
    c.innerText = parseInt(c.innerText) + 1;
}
