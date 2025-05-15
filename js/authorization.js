window.addEventListener("load", function() {
  if (isLoggedIn() && localStorage.getItem("loggedInUser")) {
    document.getElementById("registerLink").style.display = "none";
    document.getElementById("loginLink").style.display = "none";
    document.getElementById("cartLink").style.display = "inline-block";
    document.getElementById("logoutLink").style.display = "inline-block";
  } else {
    document.getElementById("registerLink").style.display = "inline-block";
    document.getElementById("loginLink").style.display = "inline-block";
    document.getElementById("cartLink").style.display = "none";
    document.getElementById("logoutLink").style.display = "none";

    // Prevent redirection from register page until submission is successful
    if (
      window.location.pathname.includes("register.html") &&
      !localStorage.getItem("registrationSuccessful")
    ) {
      // Do nothing if already on register page and registration is not successful yet
      return;
    }
  }
});

// Function to simulate registration process
function registerUser() {
  // Simulate registration process (e.g., AJAX request or form validation)
  let isSuccessful = true; // Change this based on actual registration result

  if (isSuccessful) {
    // Set a flag in localStorage to indicate successful registration
    localStorage.setItem("registrationSuccessful", true);

    // Redirect after successful registration
    window.location.href = "success.html"; // Or wherever you want to redirect
  } else {
    alert("Registration failed. Please try again.");
  }
}

function isLoggedIn() {
  const cookies = document.cookie.split("; ");
  const loggedInCookie = cookies.find(cookie => cookie.startsWith("loggedIn="));
  return loggedInCookie ? loggedInCookie.split("=")[1] === "true" : false;
}

function logout() {
  // delete cookie
  document.cookie =
    "loggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

  // delete user details from localStorage
  localStorage.removeItem("loggedInUser");

  alert("You have logged out successfully!");

  window.location.href = "../pages/login.html";
}
