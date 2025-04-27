const baseURL = "http://localhost:5000";

const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id")); 

if (productId) {
  findProductById(productId); 
} else {
  console.error("No product ID in URL.");
}

async function fetchProducts() {
  const allProducts = [];
  const categories = ["beauty", "fragrances", "furniture", "groceries"];

  for (const category of categories) {
    try {
      const res = await fetch(`${baseURL}/${category}`);
      if (!res.ok) {
        continue;
      }

      const products = await res.json();
      console.log(products);
        const relatedProducts = products
      allProducts.push(...products); // Combine all products from all categories
      console.log(relatedProducts);

    } catch (err) {
      console.error(`Error fetching ${category}: `, err);
    }
  }


  console.log(allProducts);

  return allProducts;
}

async function findProductById(productId) {
  const products = await fetchProducts();

  // Find the product by matching its ID
  const product = products.find(p => Number(p.id) === productId);
  console.log(product);

  if (product) {
    console.log("Product found:", product);
  
    renderProductDetails(product);
await waitForElement('#related-products-swiper');
    await renderRelatedProducts(product);
    
  } else {
    console.error(`Product not found with ID: ${productId}`);
  }
}

function waitForElement(selector) {
  return new Promise(resolve => {
    const checkExist = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(checkExist);
        resolve();
      }
    }, 50); // كل 50 ملي ثانية يتحقق
  });
}


function renderProductDetails(product) {
  const productDetailsDiv = document.getElementById("productDetails");

  if (!productDetailsDiv) {
    console.error("productDetails element not found in HTML.");
    return;
  }

  // const imageUrl = `https://cdn.dummyjson.com/products/images/${encodeURIComponent(
  //   product.category
  // )}/${encodeURIComponent(product.title)}/1.png`;

  const mainImageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : `https://cdn.dummyjson.com/products/images/${encodeURIComponent(product.category)}/${encodeURIComponent(product.title)}/1.png`;



  productDetailsDiv.innerHTML = `
    <div class="row">
      <div class="col-md-5">
        <img src="${mainImageUrl}" id="product-image" alt="${product.title}" class="product-image img-fluid rounded">
        
        <!-- Other images section -->
        <div class="mt-4" id="other-images">
          <h5>Other Images:</h5>
          <div class="d-flex flex-wrap gap-2">
            ${product.images.map(img => `
              <img src="${img}" alt="${product.title}" class="img-thumbnail" style="width: 100px; height: 100px; object-fit: cover; cursor: pointer;" onclick="document.getElementById('product-image').src='${img}'">
            `).join('')}
          </div>
        </div>
      </div>

      <div class="col-md-7">
        <div class="product-detail">
          <h1 id="product-title" class="product-title mb-5 fs-5">${product.title}</h1>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Stock:</strong> ${product.stock ?? "N/A"}</p>
          <p id="product-price" class="price mt-3"><strong>Price:</strong> $${product.price}</p>
          <p><strong>Brand:</strong> ${product.brand}</p>
          <p><strong>Rating:</strong> ${product.rating}</p>
          <p><strong>Return Policy:</strong> ${product.returnPolicy}</p>
          <p><strong>Shipping Information:</strong> ${product.shippingInformation}</p>
          <p><strong>Warranty Information:</strong> ${product.warrantyInformation}</p>
          <p><strong>Weight:</strong> ${product.weight}</p>
          <p><strong>Availability Status:</strong> ${product.availabilityStatus}</p>
          <p><strong>Description:</strong> ${product.description}</p>
          <button class="btn btn-primary mt-3" data-product='${JSON.stringify(product).replace(
        /'/g,
        "&apos;"
      )}' onclick="addToCartHandler(this)">Add to Cart</button>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="mt-5" id="reviews">
      <h3 class="text-primary">Customer Reviews</h3>
      ${product.reviews && product.reviews.length > 0 
        ? product.reviews.map(review => `
            <div class="card my-3">
              <div class="card-body">
                <h5 class="card-title">${review.user}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Rating: ${review.rating} ⭐</h6>
                <p class="card-text">${review.comment}</p>
              </div>
            </div>
          `).join('')
        : `<p class="text-muted">No reviews yet for this product.</p>`
      }
    </div>


<!-- Related Products Section -->
<div class="container box py-5">
  <h2 class="text-center text-primary">Related Products</h2>
  <div class="swiper mySwiper">
    <div class="swiper-wrapper" id="related-products-swiper">
      <!-- Related products slides will go here -->
    </div>
    <!-- Add Arrows -->
    <div class="btns w-50 m-auto d-flex justify-content-around">
    <button id="prevBtn" class="btn btn-primary my-5 swiper-button-prev">Prev</button>
    <button id="nextBtn" class="btn btn-primary my-5 swiper-button-next">Next</button>
  </div>
  </div>
</div>
  `;
}


async function renderRelatedProducts(currentProduct) { 
  const allProducts = await fetchProducts();

  const relatedProducts = allProducts.filter(product =>
    product.category === currentProduct.category && product.id !== currentProduct.id
  );

  const swiperWrapper = document.getElementById("related-products-swiper");

  if (!relatedProducts.length) {
    swiperWrapper.innerHTML = "<p class='text-center'>No related products found.</p>";
    return;
  }

  swiperWrapper.innerHTML = relatedProducts.map(product => `
    <div class="swiper-slide">
      <div class="card h-100">
        <img src="${product.images?.[0]}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text text-success fw-bold">$${product.price}</p>
          <a href="product-details.html?id=${product.id}" class="btn btn-outline-primary mt-auto">View Details</a>
        </div>
      </div>
    </div>
  `).join("");
  
  setupManualSwiper();
}
