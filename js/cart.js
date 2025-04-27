document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
  const grandTotal = document
    .getElementById("grand-total")
    .querySelector("span");

  if (cart.length === 0) {
    cartContainer.innerHTML =
      "<tr><td colspan='5' class='text-center'>Your cart is empty.</td></tr>";
    grandTotal.textContent = "$0.00";
    return;
  }

  let total = 0;

  cart.forEach((product, index) => {
    const quantity = product.quantity || 1;
    const productTotal = (product.price * quantity).toFixed(2);

    product.quantity = quantity;
    product.total = parseFloat(productTotal);

    // Use product image if available, otherwise use a placeholder image
    const imageUrl =
      `https://cdn.dummyjson.com/products/images/${product.category}/${encodeURIComponent(
        product.title
      )}/1.png` || "https://via.placeholder.com/50";

    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>
                        <img src="${imageUrl}" alt="${product.title}" class="me-2" style="width:50px; height:50px; object-fit:cover;">
                        <span>${product.title}</span>
                    </td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>
                        <input type="number" value="${quantity}" min="1" class="form-control quantity-input" data-index="${index}">
                    </td>
                    <td class="product-total">$${productTotal}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="removeProduct(${index})">Remove</button>
                    </td>
                `;
    cartContainer.appendChild(row);

    total += parseFloat(productTotal);
  });

  grandTotal.textContent = `$${total.toFixed(2)}`;

  // Store the cart total in localStorage
  localStorage.setItem("cartTotal", total.toFixed(2));

  localStorage.setItem("cart", JSON.stringify(cart));

  // Update quantity live
  document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("input", handleQuantityChange);
  });
});

function handleQuantityChange(event) {
  const quantity = parseInt(event.target.value);
  const index = event.target.getAttribute("data-index");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (quantity <= 0 || isNaN(quantity)) return;

  cart[index].quantity = quantity;
  cart[index].total = cart[index].price * quantity;
  localStorage.setItem("cart", JSON.stringify(cart));

  // Recalculate and update the total after quantity change
  let total = 0;
  cart.forEach(item => (total += item.total));
  localStorage.setItem("cartTotal", total.toFixed(2));

  location.reload();
}

function removeProduct(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Recalculate and update the total after item removal
  let total = 0;
  cart.forEach(item => (total += item.total));
  localStorage.setItem("cartTotal", total.toFixed(2));

  location.reload();
}
