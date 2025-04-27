// const loginForm = document.getElementById("loginForm");
// const loginEmail = document.getElementById("loginEmail");
// const loginPassword = document.getElementById("loginPassword");

// loginForm.addEventListener("submit", async function(e) {
//   e.preventDefault();

//   const email = loginEmail.value.trim();
//   const password = loginPassword.value;

//   if (!email) {
//     showError("loginEmailError");
//   } else {
//     hideError("loginEmailError");
//   }

//   if (!password) {
//     showError("loginPasswordError");
//   } else {
//     hideError("loginPasswordError");
//   }

// if (!email || !password) {
//   return;
// }

//   if (email && password) {
//     try {
//       // نحاول نجيب المستخدمين من الـ db.json (السيرفر)
//       const res = await fetch(`http://localhost:5000/users?email=${email}`);

//       if (!res.ok) {
//         alert("User not found, please check your email and password");
//       }

//       const users = await res.json();

//       if (users.length === 0) {
//         // لو مفيش مستخدمين متطابقين في السيرفر
//         alert("User not found, please check your email and password");
//         return;
//       }

//       const matchedUser = users.find(
//         user => user.email === email && user.password === password
//       );

//       if (matchedUser) {
//         // ✅ لو لقيناه على السيرفر
//         localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
//         setLoginCookie();
//         showMessage("Login has been successful", "success");

//         setTimeout(() => {
//           window.location.href = "../index.html";
//         }, 1000);
//       } else {
//         // ⚡ لو ملقيناش، ندور في localStorage
//         const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
//         const localUser = storedUsers.find(
//           u => u.email === email && u.password === password
//         );

//         if (localUser) {
//           //  لو لقيناه في localStorage
//           localStorage.setItem("loggedInUser", JSON.stringify(localUser));
//           setLoginCookie();
//           showMessage("Login has been successful", "success");

//           setTimeout(() => {
//             window.location.href = "../index.html";
//           }, 1000);
//         } else {
//           //  لو مفيش مستخدمين متطابقين خالص
//           const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
//           const localUser = storedUsers.find(
//             u => u.email === email && u.password === password
//           );

//           if (localUser) {
//             // ✅ لو لقيناه في localStorage
//             localStorage.setItem("loggedInUser", JSON.stringify(localUser));
//             setLoginCookie();
//             showMessage("Login has been successful", "success");

//             setTimeout(() => {
//               window.location.href = "../index.html";
//             }, 2000);
//           } else {
//             //  لو مفيش مستخدمين متطابقين خالص
//             showMessage("Invalid email or password", "danger");
//           }
//           alert("Invalid email or password");
//         }
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       showMessage("An error occurred. Please try again.", "danger");
//     }
//   }
// });
// // ..............................................................................
// // ✅ Helper Functions

// function setLoginCookie() {
//   const expires = new Date(Date.now() + 3600 * 1000).toUTCString(); // 1 ساعة
//   document.cookie = `loggedIn=true; path=/; expires=${expires}`;
// }

// function isLoggedIn() {
//   const cookies = document.cookie.split("; ");
//   const loggedInCookie = cookies.find(cookie => cookie.startsWith("loggedIn="));
//   return loggedInCookie ? loggedInCookie.split("=")[1] === "true" : false;
// }

// function logout() {
//   localStorage.removeItem("loggedInUser");
//   document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   window.location.href = "login.html";
// }

// function showMessage(msg, type) {
//   const msgBox = document.getElementById("loginMessage");
//   msgBox.textContent = msg;
//   msgBox.className = `alert alert-${type} text-center p-1`;
// }

// function showError(id) {
//   document.getElementById(id).style.display = "block";
// }

// function hideError(id) {
//   document.getElementById(id).style.display = "none";
// }

// ...................................................................................

// if (window.location.href.includes("login.html")) {
//   const loginForm = document.getElementById("loginForm");
//   const loginEmail = document.getElementById("loginEmail");
//   const loginPassword = document.getElementById("loginPassword");

//   loginForm.addEventListener("submit", async function(e) {
//     e.preventDefault();

//     const email = loginEmail.value.trim();
//     const password = loginPassword.value;

//     if (!email) {
//       showError("loginEmailError");
//     } else {
//       hideError("loginEmailError");
//     }

//     if (!password) {
//       showError("loginPasswordError");
//     } else {
//       hideError("loginPasswordError");
//     }

//     if (!email || !password) {
//       alert("Please enter both email and password.");
//       return; // لو الإيميل أو الباسورد ناقصين، نوقف
//     }

//     try {
//       let matchedUser = null;

//       // أولًا: البحث في الـ admins
//       const adminRes = await fetch(
//         `http://localhost:5000/admins?email=${email}`
//       );
//       if (!adminRes.ok) console.log(`Admin server error: ${adminRes.status}`);
//       const admins = await adminRes.json();

//       if (admins.length > 0) {
//         matchedUser = admins.find(admin => admin.password === password);
//       }

//       // لو مش موجود في الـ admins ندور في الـ users
//       if (!matchedUser) {
//         const userRes = await fetch(
//           `http://localhost:5000/users?email=${email}`
//         );
//         if (!userRes.ok) alert(`User server error: ${userRes.status}`);
//         const users = await userRes.json();

//         if (users.length > 0) {
//           matchedUser = users.find(user => user.password === password);
//         }
//       }

//       // لو مش موجود في قاعدة البيانات ندور في الـ localStorage
//       if (!matchedUser) {
//         const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
//         matchedUser = storedUsers.find(
//           user => user.email === email && user.password === password
//         );
//       }

//       if (matchedUser) {
//         // تسجيل الدخول ناجح
//         localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
//         setLoginCookie();
//         showMessage("Login has been successful", "success");

//         if (matchedUser.role === "admin") {
//           console.log("Login Successful", matchedUser);

//           sessionStorage.setItem("adminEmail", matchedUser.email);
//           window.location.href = "../pages/dashboard.html";
//         }
//       } else {
//         console.log("Login Successful", matchedUser);

//         window.location.href = "../index.html"; // المستخدم العادي يروح للصفحة الرئيسية مثلا
//         // لو مفيش تطابق خالص
//         showMessage("Invalid email or password", "danger");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       showMessage("An error occurred. Please try again later.", "danger");
//     }
//   });

//   // .............................................................................
//   // ✅ Helper Functions

//   function setLoginCookie() {
//     const expires = new Date(Date.now() + 3600 * 1000).toUTCString(); // 1 ساعة
//     document.cookie = `loggedIn=true; path=/; expires=${expires}`;
//   }

//   function showMessage(msg, type) {
//     const msgBox = document.getElementById("loginMessage");
//     msgBox.textContent = msg;
//     msgBox.className = `alert alert-${type} text-center p-1`;
//   }

//   function showError(id) {
//     document.getElementById(id).style.display = "block";
//   }

//   function hideError(id) {
//     document.getElementById(id).style.display = "none";
//   }
//   return;
// }

if (window.location.href.includes("login.html")) {
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email) {
      showError("loginEmailError");
    } else {
      hideError("loginEmailError");
    }

    if (!password) {
      showError("loginPasswordError");
    } else {
      hideError("loginPasswordError");
    }

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      let matchedUser = null;

      // أولاً: البحث عن Admin
      const adminRes = await fetch(
        `http://localhost:5000/admins?email=${email}`
      );
      if (!adminRes.ok)
        throw new Error(`Admin server error: ${adminRes.status}`);
      const admins = await adminRes.json();

      if (admins.length > 0) {
        matchedUser = admins.find(admin => admin.password === password);
        if (matchedUser) {
          matchedUser.role = "admin"; // نتأكد نحطله role admin لو مش موجودة
        }
      }

      // لو مش موجود في الـ admins، نبحث في الـ users
      if (!matchedUser) {
        const userRes = await fetch(
          `http://localhost:5000/users?email=${email}`
        );
        if (!userRes.ok)
          throw new Error(`User server error: ${userRes.status}`);
        const users = await userRes.json();

        if (users.length > 0) {
          matchedUser = users.find(user => user.password === password);
          if (matchedUser) {
            matchedUser.role = "user"; // نحطله role user
          }
        }
      }

      // لو مش موجود في قاعدة البيانات ندور في localStorage
      if (!matchedUser) {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        matchedUser = storedUsers.find(
          user => user.email === email && user.password === password
        );
        if (matchedUser) {
          matchedUser.role = "user"; // نحطله role user لو جاي من localStorage
        }
      }

      if (matchedUser) {
        // ✅ تسجيل الدخول ناجح
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        setLoginCookie();
        showMessage("Login has been successful", "success");

        setTimeout(() => {
          if (matchedUser.role === "admin") {
            sessionStorage.setItem("adminEmail", matchedUser.email);
            window.location.href = "../pages/dashboard.html";
          } else {
            window.location.href = "../index.html";
          }
        }, 1000);
      } else {
        // ❌ فشل تسجيل الدخول
        showMessage("Invalid email or password", "danger");
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessage("An error occurred. Please try again later.", "danger");
    }
  });

  // .............................................................................
  // ✅ Helper Functions

  function setLoginCookie() {
    const expires = new Date(Date.now() + 3600 * 1000).toUTCString(); // 1 ساعة
    document.cookie = `loggedIn=true; path=/; expires=${expires}`;
  }

  function showMessage(msg, type) {
    const msgBox = document.getElementById("loginMessage");
    msgBox.textContent = msg;
    msgBox.className = `alert alert-${type} text-center p-1`;
  }

  function showError(id) {
    document.getElementById(id).style.display = "block";
  }

  function hideError(id) {
    document.getElementById(id).style.display = "none";
  }
}
