const API_URL = "https://script.google.com/macros/s/AKfycbyA4zh-03bBRGayv5aOX4TkQl2uWlYYRt8Kmz27-B4t-29U2HIFhOHPrntBtNpMREqMrQ/exec"; 

let allProducts = [];

window.onload = () => {
    fetchData(); 
};

async function fetchData() {
    const container = document.getElementById('product-container');
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data && data.length > 0) {
            allProducts = data;
            renderUI(data);
        } else {
            container.innerHTML = "<div class='loading'>📭 لا توجد مواد معروضة حالياً</div>";
        }
    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = "<div class='loading'>⚠️ عذراً، يرجى تحديث الصفحة</div>";
    }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="img-box">
                <img src="${item.image || 'https://via.placeholder.com/150'}" 
                     onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <div class="info">
                <h3>${item.titleAr || 'منتج'}</h3>
                <div class="price-row">
                    <span class="price">${item.price || '0.00'} JD</span>
                    <button class="add-btn" onclick="addToCart()">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        (p.titleAr && p.titleAr.toLowerCase().includes(searchTerm)) || 
        (p.barcode && p.barcode.toString().includes(searchTerm))
    );
    renderUI(filtered);
}

function addToCart() {
    const countElement = document.getElementById('cart-count');
    countElement.innerText = parseInt(countElement.innerText) + 1;
}
