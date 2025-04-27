const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

// on input
nameInput.addEventListener("input", () => validateInput("name"));
emailInput.addEventListener("input", () => validateInput("email"));
passwordInput.addEventListener("input", () => validateInput("password"));
confirmPasswordInput.addEventListener("input", () =>
  validateInput("confirmPassword")
);

// .................................
// Event listeners
["name", "email", "password", "confirmPassword"].forEach(field => {
  const input = document.getElementById(field);

  input.addEventListener("focus", () => showRequirement(field));
  input.addEventListener("blur", () => validateInput(field));
  input.addEventListener("input", () => validateInput(field));
});

function showRequirement(field) {
  const messages = {
    name: "Full name is required.",
    email: "Please enter a valid email address.",
    password: "Password must be at least 6 characters.",
    confirmPassword: "Passwords must match."
  };

  const input = document.getElementById(field);
  const errorId = field + "Error";

  document.getElementById(errorId).textContent = messages[field];
  document.getElementById(errorId).style.display = "block";
  input.classList.add("input-error");
}

// .......... form submit ............
// storage only in local storage:

// function handleSubmit(event) {
//   event.preventDefault();

//   const isValid = validateForm();

//   if (isValid) {
//     const user = {
//       name: nameInput.value.trim(),
//       email: emailInput.value.trim(),
//       password: passwordInput.value
//     };

//     // جلب كل المستخدمين المخزنين أو مصفوفة فاضية لو مفيش
//     let users = JSON.parse(localStorage.getItem("users")) || [];

//     // تأكد إن مفيش إيميل مكرر
//     const existingUser = users.find(u => u.email === user.email);
//     if (existingUser) {
//       showMessage("Email already registered", "danger");
//       return;
//     }

//     // أضف المستخدم الجديد
//     users.push(user);

//     // خزنه تاني
//     localStorage.setItem("users", JSON.stringify(users));

//     // إنشاء كوكي لتسجيل الدخول
//     const oneHourFromNow = new Date(Date.now() + 3600 * 1000);
//     document.cookie = `loggedIn=true; path=/; expires=${oneHourFromNow.toUTCString()}`;

//     showMessage("You have registered successfully", "success");

//     setTimeout(() => {
//       window.location.href = "./login.html";
//     }, 1500);
//   } else {
//     showMessage("Registration failed", "danger");
//   }
// }

// storage in local storage and local server:
async function handleSubmit(event) {
  event.preventDefault();

  const isValid = validateForm();

  if (isValid) {
    const user = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value
    };

    try {
      // --------- تحقق من الإيميل في السيرفر ----------
      const serverRes = await fetch(
        `http://localhost:5000/users?email=${user.email}`
      );
      const existingServerUsers = await serverRes.json();

      if (existingServerUsers.length > 0) {
        showMessage("Email already registered on server", "danger");
        return;
      }

      // --------- تحقق من الإيميل في localStorage ----------
      let localUsers = JSON.parse(localStorage.getItem("users")) || [];
      const existingLocalUser = localUsers.find(u => u.email === user.email);

      if (existingLocalUser) {
        showMessage("Email already registered locally", "danger");
        return;
      }

      // --------- إضافة المستخدم في السيرفر ----------
      const addServerRes = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      if (!addServerRes.ok) {
        throw new Error("Failed to register user on server");
      }

      // --------- إضافة المستخدم في localStorage ----------
      localUsers.push(user);
      localStorage.setItem("users", JSON.stringify(localUsers));

      // --------- إنشاء الكوكيز لتسجيل الدخول ----------
      const oneHourFromNow = new Date(Date.now() + 3600 * 1000);
      document.cookie = `loggedIn=true; path=/; expires=${oneHourFromNow.toUTCString()}`;

      // --------- عرض رسالة النجاح ----------
      showMessage("You have registered successfully", "success");

      window.location.href = "./login.html";
    } catch (error) {
      console.error("Registration error:", error);
      showMessage("An error occurred during registration", "danger");
    }
  } else {
    showMessage("Registration failed due to invalid inputs", "danger");
  }
}

// show result

function showMessage(message, type) {
  const msgBox = document.querySelector("h2.alert");
  msgBox.textContent = message;
  msgBox.className = "alert alert-${type} text-center p-1";
}

// .................................
//methods

function validateInput(field) {
  // get value
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // check
  switch (field) {
    case "name":
      if (name === "") {
        setError(nameInput, "Full name is required");
      } else {
        clearError(nameInput, "nameError");
      }
      break;

    case "email":
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (email === "") {
        setError(emailInput, "emailError", "Email is required.");
      } else if (!emailPattern.test(email)) {
        setError(emailInput, "emailError", "Invalid email format.");
      } else {
        clearError(emailInput, "emailError");
      }
      break;

    case "password":
      if (password === "") {
        setError(passwordInput, "passwordError", "Password is required.");
      } else if (password.length < 6) {
        setError(
          passwordInput,
          "passwordError",
          "Password must be at least 6 characters."
        );
      } else {
        clearError(passwordInput, "passwordError");
      }
      break;

    case "confirmPassword":
      if (confirmPassword === "") {
        setError(
          confirmPasswordInput,
          "confirmPasswordError",
          "Confirmation is required."
        );
      } else if (confirmPassword !== password) {
        setError(
          confirmPasswordInput,
          "confirmPasswordError",
          "Passwords do not match."
        );
      } else {
        clearError(confirmPasswordInput, "confirmPasswordError");
      }
      break;
  }
}

function validateForm() {
  validateInput("name");
  validateInput("email");
  validateInput("password");
  validateInput("confirmPassword");

  const errors = document.querySelectorAll(".input-error");
  return errors.length === 0;
}

// .................................
// error handling

function setError(input, errorId, message = "") {
  input.classList.add("input-error");
  const errorDiv = document.getElementById(errorId);
  errorDiv.textContent = message || errorDiv.textContent;
  errorDiv.style.display = "block";
}

function clearError(input, errorId) {
  input.classList.remove("input-error");
  document.getElementById(errorId).style.display = "none";
}
