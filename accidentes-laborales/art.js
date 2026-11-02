/* El panel local replica la interfaz, sin conectarse con ninguna hoja externa. */
window.solicitarAccesoAdmin = function (event) {
  event?.preventDefault();
  document.getElementById("adminAccess")?.classList.add("is-open");
};
document.addEventListener("DOMContentLoaded", () => {
  const access = document.getElementById("adminAccess");
  const panel = document.getElementById("adminPanel");
  const close = (element) => element?.classList.remove("is-open");
  document.getElementById("adminCloseAccess")?.addEventListener("click", () => close(access));
  document.getElementById("adminClosePanel")?.addEventListener("click", () => close(panel));
  document.getElementById("adminEnter")?.addEventListener("click", () => {
    close(access);
    panel?.classList.add("is-open");
  });
  document.getElementById("adminSend")?.addEventListener("click", () => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = "Panel local de demostración: no se envió ninguna conversión.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 4500);
    }
  });
  [access, panel].forEach((overlay) => overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) close(overlay);
  }));
});
