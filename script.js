const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxKZxbfSiCNQkVUlzwoQsxiu0Qdse2pTVHdcZBpY-Cnps1sLriV7lf3LFBA8Y0N5goCNQ/exec";

async function loadProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = "<p>جاري تحميل بضائع JJ's Supermarket...</p>";

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        container.innerHTML = ""; 

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // الصور بناءً على الباركود فقط من جوجل درايف
            const imgUrl = item.image || "https://via.placeholder.com/150";

            card.innerHTML = `
                <div class="image-box">
                    <img src="${imgUrl}" alt="${item.titleAr}" onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${item.titleAr}</h3>
                    <p class="barcode-text">باركود: ${item.barcode}</p>
                    <div class="price-row">
                        <span class="price-tag">${parseFloat(item.price).toFixed(2)} JD</span>
                        <button class="add-button" onclick="addToCart('${item.barcode}')">أضف للسلة +</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p>تعذر الاتصال بقاعدة البيانات.</p>";
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);
