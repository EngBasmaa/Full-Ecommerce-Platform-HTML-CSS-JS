window.addEventListener("load", async function() {
  try {
    const email = sessionStorage.getItem("adminEmail");

    if (!email) {
      // مفيش إيميل محفوظ يعني مش مسجل دخول
      window.location.href = "../pages/login.html";
      return;
    }

    // دلوقتي يدور عليه في السيرفر
    const res = await fetch(`http://localhost:5000/admins?email=${email}`);
    if (!res.ok) throw new Error("Server error");

    const admins = await res.json();

    if (admins.length === 0) {
      // لو مش موجود فعلا كأدمن
      window.location.href = "../pages/login.html";
      return;
    }

    // ✅ الأدمن موجود بالفعل - يكمل الداشبورد
    console.log("Admin verified successfully 🚀");
  } catch (error) {
    console.error("Error checking admin:", error);
    window.location.href = "../pages/login.html";
  }
});

// ............................................
document.addEventListener("DOMContentLoaded", async function() {
  const baseURL = "http://localhost:5000";
  const categories = ["beauty", "fragrances", "furniture", "groceries"];

  // جلب واحضار بيانات العدد الإجمالي
  async function loadDashboardStats() {
    try {
      const res = await fetch(`${baseURL}/products`);
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();

      document.getElementById("totalProducts").textContent =
        data.totalProducts || 0;
      document.getElementById("totalUsers").textContent = data.totalUsers || 0;
      document.getElementById("totalOrders").textContent =
        data.totalOrders || 0;
      showAllProducts();
      //   renderProducts(data.products); // عرض كل المنتجات أول ما تفتح الصفحة
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    }
  }

  // إنشاء أزرار الفلاتر
  function renderCategoryButtons(categories) {
    const container = document.getElementById("category-buttons");
    container.innerHTML = "";

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary d-block w-100 mb-2";
      btn.textContent = cat;
      btn.onclick = () => fetchProductsByCategory(cat);
      container.appendChild(btn);
    });

    const allBtn = document.createElement("button");
    allBtn.className = "btn btn-secondary d-block w-100 mt-3";
    allBtn.textContent = "Show All Products";
    allBtn.onclick = showAllProducts;
    container.appendChild(allBtn);
  }

  // جلب المنتجات حسب الكاتيجوري
  async function fetchProductsByCategory(category) {
    try {
      const res = await fetch(`${baseURL}/${category}`);
      if (!res.ok) throw new Error(`Failed to fetch ${category} products`);
      const products = await res.json();
      renderProducts(products);
    } catch (err) {
      console.error("Error fetching category products:", err);
    }
  }

  // جلب كل المنتجات
  async function showAllProducts() {
    const allProducts = [];
    for (const category of categories) {
      try {
        const res = await fetch(`${baseURL}/${category}`);
        if (!res.ok) throw new Error(`Failed to fetch ${category} products`);
        const products = await res.json();
        allProducts.push(...products);
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
      }
    }
    renderProducts(allProducts);
  }

  // عرض المنتجات داخل جدول المنتجات
  function renderProducts(products) {
    const tableBody = document.getElementById("productsTable");
    tableBody.innerHTML = "";

    products.forEach(product => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.id || "-"}</td>
        <td>${product.title || product.name || "-"}</td>
        <td>${product.category || "-"}</td>
        <td>$${product.price || "-"}</td>
        <td>${product.stock || "-"}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // تشغيل كل شيء

  renderCategoryButtons(categories);
  await loadDashboardStats();
  await showAllProducts();
});

// أكشنات تعديل وحذف المنتجات
function editProduct(productId) {
  console.log("Edit product with ID:", productId);
}

async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    // Send DELETE request to the server
    const res = await fetch(`http://localhost:5000/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log(res);

    // Check if the response status is 200 (OK)
    if (!res.ok) {
      throw new Error(
        "Failed to delete product. Response status: " + res.status
      );
    }

    // If successful, show an alert
    alert("Product deleted successfully ✅");

    // Filter out the deleted product from the displayed products
    // Assuming you already have a list of products (e.g., `allProducts`), filter it
    allProducts = allProducts.filter(product => product.id !== productId);
    console.log(allProducts);
    // Re-render the product list without the deleted product
    renderProducts(allProducts);
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("Failed to delete the product ❌");
  }
}

// ................ admin log out ....................

// Listen for the logout button click
document.getElementById("logoutBtn").addEventListener("click", function() {
  // Clear the session storage
  sessionStorage.removeItem("adminEmail");

  // Redirect to login page
  window.location.href = "../pages/login.html";
});

// Your existing code for checking admin login status
window.addEventListener("load", async function() {
  try {
    const email = sessionStorage.getItem("adminEmail");

    if (!email) {
      // If there's no email stored, redirect to the login page
      window.location.href = "../pages/login.html";
      return;
    }

    const res = await fetch(`http://localhost:5000/admins?email=${email}`);
    if (!res.ok) throw new Error("Server error");

    const admins = await res.json();

    if (admins.length === 0) {
      window.location.href = "../pages/login.html";
      return;
    }

    console.log("Admin verified successfully 🚀");
  } catch (error) {
    console.error("Error checking admin:", error);
    window.location.href = "../pages/login.html";
  }
});
