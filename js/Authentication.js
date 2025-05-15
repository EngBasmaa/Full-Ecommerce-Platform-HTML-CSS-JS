if (window.location.href.includes("login")) {
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    // Reset the input errors and styles before starting validation
    hideError("loginEmailError");
    hideError("loginPasswordError");
    loginEmail.classList.remove("input-error");
    loginPassword.classList.remove("input-error");

    // Validate Email
    if (!email) {
      showError("loginEmailError", "Please enter your email.");
      loginEmail.classList.add("input-error");
    } else if (!isValidEmail(email)) {
      showError("loginEmailError", "Please enter a valid email.");
      loginEmail.classList.add("input-error");
    } else {
      hideError("loginEmailError");
    }

    // Validate Password
    if (!password) {
      showError("loginPasswordError", "Please enter your password.");
      loginPassword.classList.add("input-error");
    } else {
      hideError("loginPasswordError");
    }

    // If there are validation errors, prevent form submission
    if (!email || !password || !isValidEmail(email)) {
      return;
    }

    try {
      let matchedUser = null;

      // First, check in the "admins" array
      const adminRes = await fetch(
        `http://localhost:5000/admins?email=${email}`
      );
      if (!adminRes.ok) console.log(`Admin server error: ${adminRes.status}`);
      const admins = await adminRes.json();

      if (admins.length > 0) {
        matchedUser = admins.find(admin => admin.password === password);
      }

      // If not found in admins, check in "users" array
      if (!matchedUser) {
        const userRes = await fetch(
          `http://localhost:5000/users?email=${email}`
        );
        if (!userRes.ok) alert(`User server error: ${userRes.status}`);
        const users = await userRes.json();

        if (users.length > 0) {
          matchedUser = users.find(user => user.password === password);
        }
      }

      // If not found in both, check in localStorage
      if (!matchedUser) {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        matchedUser = storedUsers.find(
          user => user.email === email && user.password === password
        );
      }

      if (matchedUser) {
        // Successful login
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        showMessage("Login has been successful", "success");

        // Store admin info in sessionStorage if the user is an admin
        if (matchedUser.role === "admin") {
          sessionStorage.setItem("adminEmail", matchedUser.email); // Store the admin email in sessionStorage
          console.log("Admin logged in successfully!");

          // Redirecting to dashboard after login
          setTimeout(() => {
            window.location.href = "../index.html"; // Admin goes to dashboard
          }, 1000); // Timeout to allow the success message to show
        } else {
          // console.log("Redirecting to index.html");
          window.location.href = "../index.html"; // Admin goes to dashboard

          // Regular user redirection
          setTimeout(() => {
            window.location.href = "../index.html"; // Regular user goes to index
          }, 1000); // Timeout to allow the success message to show
        }
      } else {
        showMessage("Invalid email or password", "danger");
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessage("An error occurred. Please try again later.", "danger");
    }
  });

  // Helper Functions
  function showError(id, message) {
    const errorMsg = document.getElementById(id);
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
  }

  function hideError(id) {
    const errorMsg = document.getElementById(id);
    errorMsg.style.display = "none";
  }

  function showMessage(msg, type) {
    const msgBox = document.getElementById("loginMessage");
    msgBox.textContent = msg;
    msgBox.className = `alert alert-${type} text-center p-1`;
  }

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
