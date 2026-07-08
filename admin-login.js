const adminSessionKey = "rudAdminLoggedIn";

document.querySelector("#adminLoginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#adminEmail").value.trim().toLowerCase();
  const password = document.querySelector("#adminPassword").value.trim();
  const error = document.querySelector("#adminLoginError");

  if (email === "admin@rud.edu.bd" && password === "admin123") {
    sessionStorage.setItem(adminSessionKey, "true");
    localStorage.setItem(adminSessionKey, "true");
    window.location.href = "admin-dashboard.html";
    return;
  }

  error.textContent = "Invalid admin email or password.";
});
