// 1. ضع هنا رابط الـ Web App الخاص بك الذي حصلت عليه من Google Apps Script (Deploy)
const scriptUrl = "https://script.google.com/macros/s/XXXXX-YOUR-ID-XXXXX/exec";

// 2. دالة لجلب البيانات وعرضها في السوبر ماركت
async function fetchProducts() {
    const productContainer = document.getElementById('product-container');
    
    // إظهار رسالة تحميل بسيطة
    productContainer.innerHTML = "<p style='text-align:center;'>جاري تحميل المنتجات من سوبر ماركت جي جي...</p>";

    try {
        const response = await fetch(scriptUrl);
        const products = await response.json();

        // تنظيف الحاوية قبل البدء
        productContainer.innerHTML = "";

        if (products.error) {
            productContainer.innerHTML = `<p style='color:red;'>خطأ: ${products.error}</p>`;
            return;
        }

        // 3. بناء الكروت لكل منتج
        products.forEach(item => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            // التعديل المطلوب لروابط الصور من جوجل درايف
            // إذا لم توجد صورة، سيتم وضع صورة افتراضية (placeholder)
            const imageUrl = item.image || "https://via.placeholder.com/150?text=No+Image";

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${imageUrl}" alt="${item.titleAr}" onerror="this.src='https://via.placeholder.com/150?text=Error'">
                </div>
                <div class="product-info">
                    <span class="category">${item.category}</span>
                    <h3 class="title">${item.titleAr}</h3>
                    <p class="barcode">Barcode: ${item.barcode}</p>
                    <div class="price-container">
                        <span class="price">${item.price} JOD</span>
                    </div>
                    <button class="add-to-cart" onclick="addToCart('${item.barcode}')">إضافة للسلة</button>
                </div>
            `;
            
            productContainer.appendChild(productCard);
        });

    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        productContainer.innerHTML = "<p style='color:red; text-align:center;'>عذراً، فشل الاتصال بقاعدة البيانات.</p>";
    }
}

// 4. دالة بسيطة للإضافة للسلة (يمكنك تطويرها لاحقاً)
function addToCart(barcode) {
    console.log("تمت إضافة المنتج ذو الباركود: " + barcode);
    alert("تمت إضافة المنتج إلى سلة المشتريات!");
}

// 5. تشغيل الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', fetchProducts);
