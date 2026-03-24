import { getDemoConfig, getEmptyConfig } from "../model/config.js";
import { calculateCashFlow } from "../model/hesapla.js";
import { saveScenario, loadScenario, deleteScenario, listScenarios, getLastScenario } from "../model/storage.js";
import { renderForm } from "../view/form.js";
import { renderTable } from "../view/tablo.js";
import { renderChart } from "../view/grafik.js";
import { renderCards } from "../view/kartlar.js";
import { renderHelpModal } from "../view/helpView.js";
import { showBanner, showModal } from "../view/ui.js";
import { exportToCSV } from "../utils/export.js";

let currentConfig = getDemoConfig();
let currentScenarioName = "Baz";

const init = () => {
  // Load last scenario if exists
  const lastScenario = getLastScenario();
  if (lastScenario) {
    const config = loadScenario(lastScenario);
    if (config) {
      currentConfig = config;
      currentScenarioName = lastScenario;
    }
  }

  updateScenarioList();
  updateUI();
  setupEventListeners();

  // Show help on first visit
  if (!localStorage.getItem("help_shown")) {
    renderHelpModal(document.body);
    localStorage.setItem("help_shown", "true");
  }
};

const updateUI = () => {
  const results = calculateCashFlow(currentConfig);
  
  // Render Form
  const formContainer = document.getElementById("form-container");
  renderForm(currentConfig, formContainer, (newConfig) => {
    currentConfig = newConfig;
    const newResults = calculateCashFlow(currentConfig);
    renderResults(newResults);
  });

  renderResults(results);
};

const renderResults = (results) => {
  const tableContainer = document.getElementById("table-container");
  const chartContainer = document.getElementById("chart-container");
  const summaryContainer = document.getElementById("summary-container");

  renderTable(results, tableContainer);
  renderChart(results, chartContainer);
  renderCards(results, summaryContainer);
};

const updateScenarioList = () => {
  const select = document.getElementById("scenario-select");
  const scenarios = listScenarios();
  
  // Ensure "Baz" is in the list if it's the first time
  if (scenarios.length === 0) {
    saveScenario("Baz", getDemoConfig());
    scenarios.push("Baz");
  }

  select.innerHTML = scenarios.map(name => `
    <option value="${name}" ${name === currentScenarioName ? 'selected' : ''}>${name}</option>
  `).join("");
};

const setupEventListeners = () => {
  // Tab switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${tab}`).classList.add("active");
    });
  });

  // Scenario Select
  document.getElementById("scenario-select").addEventListener("change", (e) => {
    const name = e.target.value;
    const config = loadScenario(name);
    if (config) {
      currentConfig = config;
      currentScenarioName = name;
      updateUI();
      showBanner(`${name} senaryosu yüklendi.`);
    }
  });

  // Save
  document.getElementById("btn-save").addEventListener("click", () => {
    saveScenario(currentScenarioName, currentConfig);
    showBanner(`${currentScenarioName} senaryosu kaydedildi.`);
  });

  // Save As
  document.getElementById("btn-save-as").addEventListener("click", () => {
    showModal({
      title: "Farklı Kaydet",
      message: "Yeni senaryo adını girin:",
      input: { placeholder: "Senaryo Adı", value: "" },
      onConfirm: (name) => {
        if (name) {
          saveScenario(name, currentConfig);
          currentScenarioName = name;
          updateScenarioList();
          showBanner(`${name} senaryosu oluşturuldu.`);
        }
      }
    });
  });

  // Delete Scenario
  document.getElementById("btn-delete-scenario").addEventListener("click", () => {
    if (currentScenarioName === "Baz") {
      showBanner("Baz senaryosu silinemez.", "error");
      return;
    }
    showModal({
      title: "Senaryoyu Sil",
      message: `"${currentScenarioName}" senaryosunu silmek istediğinize emin misiniz?`,
      onConfirm: () => {
        deleteScenario(currentScenarioName);
        currentScenarioName = "Baz";
        currentConfig = loadScenario("Baz") || getDemoConfig();
        updateScenarioList();
        updateUI();
        showBanner("Senaryo silindi.");
      }
    });
  });

  // Export JSON
  document.getElementById("btn-export-json").addEventListener("click", () => {
    const data = { ad: currentScenarioName, cfg: currentConfig };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nakit_akisi_${currentScenarioName}.json`;
    link.click();
    showBanner("Senaryo JSON olarak dışarı aktarıldı.");
  });

  // Import JSON
  document.getElementById("btn-import-json").addEventListener("click", () => {
    document.getElementById("import-file").click();
  });

  document.getElementById("import-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.ad && data.cfg) {
            currentConfig = data.cfg;
            currentScenarioName = data.ad;
            saveScenario(currentScenarioName, currentConfig);
            updateScenarioList();
            updateUI();
            showBanner("Senaryo başarıyla yüklendi.");
          } else {
            showBanner("Geçersiz dosya formatı.", "error");
          }
        } catch (err) {
          showBanner("Dosya okunurken hata oluştu.", "error");
        }
      };
      reader.readAsText(file);
    }
  });

  // Demo Load
  document.getElementById("btn-load-demo").addEventListener("click", () => {
    showModal({
      title: "Demo Yükle",
      message: "Mevcut verileriniz silinecek ve demo verileri yüklenecek. Onaylıyor musunuz?",
      onConfirm: () => {
        currentConfig = getDemoConfig();
        updateUI();
        showBanner("Demo verileri yüklendi.");
      }
    });
  });

  // Clear All
  document.getElementById("btn-clear-all").addEventListener("click", () => {
    showModal({
      title: "Tüm Verileri Sil",
      message: "Tüm verileriniz silinecek ve form sıfırlanacak. Onaylıyor musunuz?",
      onConfirm: () => {
        currentConfig = getEmptyConfig();
        updateUI();
        showBanner("Tüm veriler silindi.");
      }
    });
  });

  // Go to Results
  document.getElementById("btn-go-to-results").addEventListener("click", () => {
    document.querySelector(".tab-btn[data-tab='output']").click();
  });

  // Edit Data
  document.getElementById("btn-edit-data").addEventListener("click", () => {
    document.querySelector(".tab-btn[data-tab='input']").click();
  });

  // Export Excel
  document.getElementById("btn-export-excel").addEventListener("click", () => {
    const results = calculateCashFlow(currentConfig);
    
    // Get all unique names for columns
    const incomeNames = Array.from(new Set(results.flatMap(d => d.gelirler.map(g => g.ad))));
    const expenseNames = Array.from(new Set(results.flatMap(d => d.giderler.map(g => g.ad))));
    const periodicNames = Array.from(new Set(results.flatMap(d => d.donemsel.map(g => g.ad))));
    const annualNames = Array.from(new Set(results.flatMap(d => d.yillik.map(g => g.ad))));

    const exportData = results.map(r => {
      const row = {
        "Ay/Yıl": `${r.ay}/${r.yil}`,
        "Başlangıç": r.oncekiBakiye.toFixed(2),
        "Faiz %": r.faizOrani.toFixed(2)
      };

      // Add individual incomes
      incomeNames.forEach(name => {
        row[`Gelir: ${name}`] = (r.gelirler.find(g => g.ad === name)?.hesaplanan || 0).toFixed(2);
      });

      row["Top. Gelir"] = r.toplamGelir.toFixed(2);

      // Add individual expenses
      expenseNames.forEach(name => {
        row[`Gider: ${name}`] = (r.giderler.find(g => g.ad === name)?.hesaplanan || 0).toFixed(2);
      });

      // Add periodic expenses
      periodicNames.forEach(name => {
        row[`Dönemsel: ${name}`] = (r.donemsel.find(g => g.ad === name)?.hesaplanan || 0).toFixed(2);
      });

      // Add annual expenses
      annualNames.forEach(name => {
        row[`Yıllık: ${name}`] = (r.yillik.find(g => g.ad === name)?.hesaplanan || 0).toFixed(2);
      });

      row["Top. Gider"] = r.toplamGider.toFixed(2);
      row["Net"] = r.net.toFixed(2);
      row["Bakiye"] = r.bakiye.toFixed(2);

      return row;
    });

    exportToCSV(exportData, `nakit_akisi_${currentScenarioName}`);
    showBanner("Excel (CSV) dosyası indirildi.");
  });
  
  // Help
  document.getElementById("btn-help").addEventListener("click", () => {
    renderHelpModal(document.body);
  });
};

init();
