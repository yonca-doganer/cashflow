import { helpSteps } from "../model/helpData.js";

export const renderHelpModal = (container) => {
  let currentStep = 0;

  const showStep = (stepIndex) => {
    const step = helpSteps[stepIndex];
    const modalContent = `
      <div class="modal-overlay" id="help-modal">
        <div class="modal">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0;">💡 Yardım: ${step.title}</h2>
            <span style="font-size: 12px; color: #888;">Adım ${stepIndex + 1} / ${helpSteps.length}</span>
          </div>
          <p style="font-size: 15px; line-height: 1.6; color: #444; margin-bottom: 25px;">${step.description}</p>
          <div class="modal-actions">
            ${stepIndex > 0 ? `<button class="btn btn-outline" id="btn-help-prev">⬅️ Geri</button>` : ""}
            ${stepIndex < helpSteps.length - 1 
              ? `<button class="btn btn-primary" id="btn-help-next">İleri ➡️</button>` 
              : `<button class="btn btn-primary" id="btn-help-close">Tamam, Anladım! ✅</button>`}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = modalContent;

    // Event Listeners
    const nextBtn = document.getElementById("btn-help-next");
    const prevBtn = document.getElementById("btn-help-prev");
    const closeBtn = document.getElementById("btn-help-close");

    if (nextBtn) {
      nextBtn.onclick = () => {
        currentStep++;
        showStep(currentStep);
      };
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        currentStep--;
        showStep(currentStep);
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        document.getElementById("help-modal").remove();
      };
    }
  };

  showStep(currentStep);
};
