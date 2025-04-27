const form = document.getElementById("checkoutForm");

const fields = {
  firstName: { message: "First name is required" },
  lastName: { message: "Last name is required" },
  email: {
    message: "Invalid email address",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    message: "Phone number must be 10 to 15 digits",
    pattern: /^\d{10,15}$/
  },
  address: { message: "Address is required" },
  city: { message: "City is required" },
  state: { message: "State is required" },
  zip: { message: "Zip must be 4 to 10 digits", pattern: /^\d{4,10}$/ },
  cardName: { message: "Card name is required" },
  cardNumber: {
    message: "Card number must be 13 to 19 digits",
    pattern: /^\d{13,19}$/
  },
  expDate: {
    message: "Expiration date must be in MM/YY format",
    pattern: /^(0[1-9]|1[0-2])\/\d{2}$/
  },
  cvv: { message: "CVV must be 3 or 4 digits", pattern: /^\d{3,4}$/ }
};

function validateField(id) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + "Error");
  const value = input.value.trim();
  const field = fields[id];
  const pattern = field.pattern || /.+/;

  if (!pattern.test(value)) {
    error.textContent = field.message;
    input.classList.add("is-invalid");
    return false;
  } else {
    error.textContent = "";
    input.classList.remove("is-invalid");
    return true;
  }
}

// Add live validation
Object.keys(fields).forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener("blur", () => validateField(id));
  input.addEventListener("input", () => validateField(id));
});

// On form submit
form.addEventListener("submit", function(e) {
  e.preventDefault();
  let isValid = true;

  Object.keys(fields).forEach(id => {
    const result = validateField(id);
    if (!result) isValid = false;
  });

  if (isValid) {
    const formData = {};
    Object.keys(fields).forEach(id => {
      formData[id] = document.getElementById(id).value.trim();
    });

    localStorage.setItem("orderData", JSON.stringify(formData));
    window.location.href = "success.html";
  }
});
