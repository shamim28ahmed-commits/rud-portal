const adminSessionKey = "rudAdminLoggedIn";

function adminAuthClient() {
  const config = window.RUD_SUPABASE || {};
  if (!config.url || !config.anonKey || !window.supabase) return null;
  return window.supabase.createClient(config.url, config.anonKey);
}

document.querySelector("#adminLoginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#adminEmail").value.trim().toLowerCase();
  const password = document.querySelector("#adminPassword").value.trim();
  const error = document.querySelector("#adminLoginError");
  const button = event.target.querySelector("button");
  const client = adminAuthClient();

  error.textContent = "";

  if (!client) {
    error.textContent = "Supabase login is not ready. Check internet and Supabase config.";
    return;
  }

  button.disabled = true;
  button.textContent = "Signing in...";

  const { error: loginError } = await client.auth.signInWithPassword({ email, password });

  button.disabled = false;
  button.textContent = "Login";

  if (loginError) {
    sessionStorage.removeItem(adminSessionKey);
    localStorage.removeItem(adminSessionKey);
    error.textContent = "Invalid admin email or password.";
    return;
  }

  sessionStorage.setItem(adminSessionKey, "true");
  localStorage.setItem(adminSessionKey, "true");
  window.location.href = "admin-dashboard.html";
});
