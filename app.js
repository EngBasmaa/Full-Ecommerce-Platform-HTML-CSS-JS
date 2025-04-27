document.addEventListener("DOMContentLoaded", function() {
  const baseURL = "http://localhost:5000";
  const categories = ["beauty", "fragrances", "furniture", "groceries"];

  // إضافة أزرار الفلاتر حسب الفئة
  function renderCategoryButtons(categories) {
    const container = document.getElementById("category-buttons");
    container.innerHTML = " ";

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary d-block w-100 mb-2";
      btn.textContent = cat;
      btn.onclick = () => {
        // تحديث URL مع معلمة الفئة في الرابط
        const url = new URL(window.location.href);
        url.searchParams.set("category", cat); // إضافة أو تعديل معلمة الفئة في الرابط
        window.history.pushState({}, "", url); // تحديث الرابط في شريط العنوان بدون إعادة تحميل الصفحة
        applyFilters(); // جلب المنتجات بناءً على الفئة والسعر
      };
      container.appendChild(btn);
    });

    const allBtn = document.createElement("button");
    allBtn.className = "btn btn-secondary d-block w-100 mt-3";
    allBtn.textContent = "Show All Products";
    allBtn.onclick = showAllProducts;
    container.appendChild(allBtn);
  }

  // تطبيق الفلاتر (فئة + سعر)
  function applyFilters() {
    const categoryFromUrl = new URLSearchParams(window.location.search).get(
      "category"
    );
    const minPrice =
      parseFloat(document.getElementById("min-price").value) || 0;
    const maxPrice =
      parseFloat(document.getElementById("max-price").value) || Infinity;

    if (categoryFromUrl) {
      // جلب المنتجات بناءً على الفئة المحددة
      fetchProductsByCategory(categoryFromUrl, minPrice, maxPrice);
    } else {
      // جلب كل المنتجات مع الفلترة حسب السعر
      fetchFilteredProducts(minPrice, maxPrice);
    }
  }

  // جلب المنتجات بناءً على الفئة
  async function fetchProductsByCategory(category, minPrice, maxPrice) {
    try {
      const res = await fetch(`${baseURL}/${category}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const products = await res.json();

      // فلترة المنتجات حسب السعر
      const filteredProducts = products.filter(
        product => product.price >= minPrice && product.price <= maxPrice
      );
      renderProducts(filteredProducts);
    } catch (err) {
      console.error("Error fetching category products: ", err);
    }
  }

  // جلب المنتجات بناءً على السعر فقط
  async function fetchFilteredProducts(minPrice, maxPrice) {
    try {
      const allProducts = [];
      for (const category of categories) {
        const res = await fetch(`${baseURL}/${category}`);
        if (!res.ok) throw new Error(`Error in ${category}: ${res.status}`);
        const products = await res.json();

        // فلترة المنتجات حسب السعر
        const filteredProducts = products.filter(
          product => product.price >= minPrice && product.price <= maxPrice
        );

        allProducts.push(...filteredProducts);
      }

      renderProducts(allProducts);
    } catch (err) {
      console.error("Error fetching filtered products: ", err);
    }
  }

  // عرض المنتجات
  function renderProducts(products) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";

    products.forEach(product => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      const imageUrl = `https://cdn.dummyjson.com/products/images/${product.category}/${encodeURIComponent(
        product.title
      )}/1.png`;

      col.innerHTML = `
        <div class="card h-100">
          <a href="./product-details.html?id=${product.id}">
            <img src="${imageUrl}" class="product-image card-img-top" alt="${product.title}">
          </a>
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.price} USD</p>
            <button class="btn btn-primary" data-product='${JSON.stringify(
              product
            ).replace(
              /'/g,
              "&apos;"
            )}' onclick="addToCartHandler(this)">Add to Cart</button>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  }

  // جلب كل المنتجات من جميع الفئات
  async function showAllProducts() {
    const allProducts = [];
    for (const category of categories) {
      try {
        const res = await fetch(`${baseURL}/${category}`);
        if (!res.ok) throw new Error(`Error in ${category}: ${res.status}`);
        const products = await res.json();
        allProducts.push(...products);
      } catch (err) {
        console.error(`Error fetching ${category}: `, err);
      }
    }

    renderProducts(allProducts);
  }

  // إضافة حدث لتطبيق فلتر السعر
  document.getElementById("price-filter-btn").onclick = applyFilters;

  // تحميل البيانات عند فتح الصفحة بناءً على الفلاتر
  function loadProductsFromUrl() {
    const categoryFromUrl = new URLSearchParams(window.location.search).get(
      "category"
    );
    const minPrice =
      parseFloat(new URLSearchParams(window.location.search).get("minPrice")) ||
      0;
    const maxPrice =
      parseFloat(new URLSearchParams(window.location.search).get("maxPrice")) ||
      Infinity;

    if (categoryFromUrl) {
      // إذا كانت الفئة موجودة في URL
      fetchProductsByCategory(categoryFromUrl, minPrice, maxPrice);
    } else {
      // إذا لم تكن هناك فئة، عرض كل المنتجات مع الفلترة حسب السعر
      fetchFilteredProducts(minPrice, maxPrice);
    }
  }

  // تحديث المحتوى عند تغيير الرابط
  window.addEventListener("popstate", loadProductsFromUrl);

  // تحميل البيانات عند فتح الصفحة
  renderCategoryButtons(categories);
  loadProductsFromUrl(); // تأكد من استدعاء هذا عند تحميل الصفحة
});
