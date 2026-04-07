const API_URL = "https://script.google.com/macros/s/AKfycbyA4zh-03bBRGayv5aOX4TkQl2uWlYYRt8Kmz27-B4t-29U2HIFhOHPrntBtNpMREqMrQ/exec"; 

let allProducts = [];
let cart = {}; 

window.onload = () => { fetchData(); };

async function fetchData() {
    const container = document.getElementById('product-container');
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // التأكد من أن البيانات ليست فارغة وليست رسالة خطأ
        if (Array.isArray(data) && data.length > 0) {
            allProducts = data;
            renderUI(data);
        } else {
            container.innerHTML = "📭 القائمة فارغة في ملف الإكسل (Sheet).";
        }
    } catch (error) {
        container.innerHTML = "⚠️ فشل جلب البيانات، يرجى التأكد من الرابط.";
    }
}

function renderUI(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(item => {
        // البحث عن السعر والاسم مهما كان اسم العمود (titleAr أو الاسم أو Item)
        let name = item.titleAr || item.الاسم || item.Item || "منتج بدون اسم";
        let price = item.price || item.السعر || item.Price || "0.00";
        let barcode = item.barcode || item.الباركود || item.Barcode || Math.random();
        let img = item.image || item.الصورة || 'https://via.placeholder.com/150?text=JJ';

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
                            <span class="qty-num" id="qty-${barcode}">0</span>
                            <button class="btn-qty" onclick="changeQty('${barcode}', 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ... بقية دوال السلة والطيران (changeQty, updateCartTotal, flyToCart) تبقى كما هي
