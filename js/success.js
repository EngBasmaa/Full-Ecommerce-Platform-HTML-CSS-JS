document.addEventListener("DOMContentLoaded", () => {
  const orderData = JSON.parse(localStorage.getItem("orderData"));
  const cartData = JSON.parse(localStorage.getItem("cart"));
  const cartTotal = localStorage.getItem("cartTotal"); // Get the cart total from localStorage
  const detailsDiv = document.getElementById("orderDetails");
  const cartDiv = document.getElementById("cartDetails");
  const totalDiv = document.getElementById("totalAmount"); // Where you want to display the total

  // Display order details
  if (orderData) {
    detailsDiv.innerHTML = `
      <p><strong>Name:</strong> ${orderData.firstName} ${orderData.lastName}</p>
      <p><strong>Email:</strong> ${orderData.email}</p>
      <p><strong>Phone:</strong> ${orderData.phone}</p>
      <p><strong>Address:</strong> ${orderData.address}, ${orderData.city}, ${orderData.state}, ${orderData.zip}</p>
      <p><strong>Cardholder:</strong> ${orderData.cardName}</p>
      <p><strong>Card Number:</strong> **** **** **** ${orderData.cardNumber.slice(
        -4
      )}</p>
      <p><strong>Expiration:</strong> ${orderData.expDate}</p>
    `;
  } else {
    detailsDiv.innerHTML = `<p class="text-danger">No order data found.</p>`;
  }

  // Display cart details
  if (cartData && cartData.length > 0) {
    let cartHTML = "";
    cartData.forEach(item => {
      cartHTML += `
        <div class="cart-item p-3 py-1">
          <img src="https://cdn.dummyjson.com/products/images/${item.image}" alt="${item.title}" width="100px">
          <p><strong>Product:</strong> ${item.title}</p>
          <p><strong>Price:</strong> $${item.price}</p>
          <p><strong>Quantity:</strong> ${item.quantity}</p>
          <p><strong>Total:</strong> $${item.total}</p>
        </div>
        <hr>
      `;
    });
    cartDiv.innerHTML = cartHTML;
  } else {
    cartDiv.innerHTML = `<p class="text-danger">No items in the cart.</p>`;
  }

  // Display the cart total directly from localStorage
  if (cartTotal) {
    totalDiv.textContent = `$${cartTotal}`; // Directly display the total amount
  } else {
    totalDiv.innerHTML = `<p class="text-danger">Total not available.</p>`;
  }
});
