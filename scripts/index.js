const EMAILJS_PUBLIC_KEY = "__EMAILJS_PUBLIC_KEY__";
const EMAILJS_SERVICE_ID = "__EMAILJS_SERVICE_ID__";
const EMAILJS_TEMPLATE_ID = "__EMAILJS_TEMPLATE_ID__";

(function () {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();

// DARK / LIGHT THEME TOGGLE LOGIC
function initTheme() {
  // Default to Light mode unless user specifically set dark previously
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    document
      .getElementById("theme-toggle-dark-icon")
      .classList.remove("hidden");
    document.getElementById("theme-toggle-light-icon").classList.add("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    document.getElementById("theme-toggle-dark-icon").classList.add("hidden");
    document
      .getElementById("theme-toggle-light-icon")
      .classList.remove("hidden");
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  const darkIcon = document.getElementById("theme-toggle-dark-icon");
  const lightIcon = document.getElementById("theme-toggle-light-icon");

  if (isDark) {
    localStorage.setItem("theme", "dark");
    darkIcon.classList.remove("hidden");
    lightIcon.classList.add("hidden");
    showToast("Modo Oscuro activado", "info");
  } else {
    localStorage.setItem("theme", "light");
    darkIcon.classList.add("hidden");
    lightIcon.classList.remove("hidden");
    showToast("Modo Claro activado", "info");
  }
}

// MOBILE MENU TOGGLE
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// MODAL HELPERS
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// CONTACT FORM SUBMISSION CON EMAILJS
async function handleContactSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = document.getElementById("contact-submit-btn");
  const originalBtnHTML = submitBtn.innerHTML;

  // Estado de carga en el botón
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Enviando mensaje...</span>`;

  // Credenciales de tu cuenta en EmailJS
  const SERVICE_ID = "__EMAILJS_SERVICE_ID__";
  const TEMPLATE_ID = "__EMAILJS_TEMPLATE_ID__"; // Ej: "template_contacto"

  try {
    await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);

    showToast(
      "¡Mensaje enviado con éxito! El equipo de Auralis se pondrá en contacto.",
      "success",
    );
    form.reset();
  } catch (error) {
    console.error("Error al enviar con EmailJS:", error);
    showToast(
      "No se pudo enviar el mensaje. Verifica tu conexión e intenta de nuevo.",
      "error",
    );
  } finally {
    // Restaurar botón a su estado normal
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;
  }
}

// TOAST NOTIFICATIONS
function showToast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");

  const bg =
    type === "success" ? "bg-emerald-600 text-white" : "bg-sky-600 text-white";
  const icon = type === "success" ? "fa-circle-check" : "fa-circle-info";

  toast.className = `pointer-events-auto p-4 rounded-2xl ${bg} shadow-xl flex items-center gap-3 text-xs font-bold transition-all duration-300 transform translate-x-10 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i> <span>${msg}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("translate-x-10", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("translate-x-10", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ON LOAD INITIALIZATION
window.onload = function () {
  initTheme();
  switchAppMockup("sesion");
  updateSimParams();
};
