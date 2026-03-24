export const showBanner = (message, type = "success") => {
  const banner = document.createElement("div");
  banner.className = `banner banner-${type}`;
  banner.textContent = message;
  document.body.appendChild(banner);
  setTimeout(() => {
    banner.style.opacity = "0";
    setTimeout(() => banner.remove(), 300);
  }, 3000);
};

export const showModal = ({ title, message, input = false, confirmText = "Onayla", cancelText = "İptal", onConfirm }) => {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  
  const modal = document.createElement("div");
  modal.className = "modal";
  
  let inputHtml = "";
  if (input) {
    inputHtml = `<input type="text" id="modal-input" placeholder="${input.placeholder || ''}" value="${input.value || ''}">`;
  }
  
  modal.innerHTML = `
    <h2>${title}</h2>
    <p>${message}</p>
    ${inputHtml}
    <div class="modal-actions">
      <button class="btn btn-outline" id="modal-cancel">${cancelText}</button>
      <button class="btn btn-primary" id="modal-confirm">${confirmText}</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  if (input) {
    modal.querySelector("#modal-input").focus();
  }
  
  const close = () => overlay.remove();
  
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  
  modal.querySelector("#modal-cancel").addEventListener("click", close);
  
  modal.querySelector("#modal-confirm").addEventListener("click", () => {
    const inputValue = input ? modal.querySelector("#modal-input").value : null;
    onConfirm(inputValue);
    close();
  });
};
