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

    // نحطه شرط إننا نعمل ريديركت لو مش في صفحة login
    if (
      window.location.pathname.includes("success.html") ||
      window.location.pathname.includes("checkout.html") ||
      window.location.pathname.includes("cart.html")
    ) {
      window.location.href = "login.html";
    }
  }
});

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
