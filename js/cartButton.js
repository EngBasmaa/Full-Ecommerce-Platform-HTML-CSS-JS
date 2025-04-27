function addToCart(product) {
  if (!isLoggedIn()) {
    alert("Please log in to add items to your cart.");
    window.location.href = "login.html";
  } else {
    console.log("Product added to cart: " + product.id);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already in cart
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
      existingProduct.total = existingProduct.quantity * existingProduct.price;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        image: `${product.category}/${product.title}/1.png`,
        quantity: 1,
        total: product.price
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.title} added to cart successfully`);

    // Redirect to cart page
    window.location.href = "cart.html";
  }
}

function addToCartHandler(button) {
  const product = JSON.parse(
    button.getAttribute("data-product").replace(/&apos;/g, "'")
  );
  addToCart(product);
}

// ......................

// Inside the renderProducts function or similar

const productImages = document.querySelectorAll(".product-image");
productImages.forEach(image => {
  image.addEventListener("click", event => {
    const productId = event.target.getAttribute("data-id");

    window.location.href = `../pages/product-details.html?id=${productId}`;
  });
});

// ..................

window.onload = function() {
  if (isLoggedIn() && localStorage.getItem("loggedInUser")) {
    enableAddToCartButtons();
  } else {
    disableAddToCartButtons();
  }
};

function isLoggedIn() {
  const cookies = document.cookie.split("; ");
  const loggedInCookie = cookies.find(cookie => cookie.startsWith("loggedIn="));
  return loggedInCookie ? loggedInCookie.split("=")[1] === "true" : false;
}

function enableAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
  addToCartButtons.forEach(button => {
    button.disabled = false;
    button.classList.remove("disabled");
    button.setAttribute("title", "Add to cart");
  });
}

function disableAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
  addToCartButtons.forEach(button => {
    button.disabled = true;
    button.classList.add("disabled");
    button.setAttribute("title", "You must log in first!");
  });
}
