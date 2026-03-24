import { formatCurrency, parseCurrency } from "../utils/format.js";

export const renderForm = (config, container, onUpdate) => {
  const { bakiye, yil, ay, sure, faiz, faizDusus, minFaiz, stopaj } = config;

  const renderList = (title, items, type) => {
    const headers = {
      gelirler: ["Ad", "Tutar (₺)", "Artış %", "Aktif Aylar"],
      giderler: ["Ad", "Tutar (₺)", "Artış %", ""],
      donemsel: ["Ad", "Taksit (₺)", "Taksit Sayısı", "Başlangıç Ayı", "Artış %", "Her Yıl Tekrar"],
      yillik: ["Ad", "Tutar (₺)", "Ödeme Ayı", "Artış %"]
    };

    const h = headers[type];
    
    return `
      <div class="list-section" data-type="${type}">
        <h3>${title}</h3>
        <div class="list-header" style="grid-template-columns: ${type === 'donemsel' ? '2fr 1fr 1fr 1fr 1fr 1fr 40px' : (type === 'yillik' ? '2fr 1fr 1fr 1fr 40px' : '2fr 1fr 1fr 1fr 40px')}">
          ${h.map(text => `<span>${text}</span>`).join("")}
        </div>
        <div class="list-items">
          ${items.map(item => renderRow(item, type)).join("")}
        </div>
        <button class="btn-add" data-action="add" data-type="${type}">+ ${title.slice(0, -1)} Ekle</button>
      </div>
    `;
  };

  const renderRow = (item, type) => {
    const gridCols = type === 'donemsel' ? '2fr 1fr 1fr 1fr 1fr 1fr 40px' : (type === 'yillik' ? '2fr 1fr 1fr 1fr 40px' : '2fr 1fr 1fr 1fr 40px');
    
    let fields = "";
    if (type === "gelirler") {
      fields = `
        <input type="text" value="${item.ad}" data-field="ad">
        <input type="text" class="text-right currency-input" value="${formatCurrency(item.tutar, true)}" data-field="tutar">
        <input type="number" class="text-right" value="${item.artis}" data-field="artis">
        <input type="text" value="${item.aylar}" data-field="aylar">
      `;
    } else if (type === "giderler") {
      fields = `
        <input type="text" value="${item.ad}" data-field="ad">
        <input type="text" class="text-right currency-input" value="${formatCurrency(item.tutar, true)}" data-field="tutar">
        <input type="number" class="text-right" value="${item.artis}" data-field="artis">
        <span></span>
      `;
    } else if (type === "donemsel") {
      fields = `
        <input type="text" value="${item.ad}" data-field="ad">
        <input type="text" class="text-right currency-input" value="${formatCurrency(item.tutar, true)}" data-field="tutar">
        <input type="number" class="text-right" value="${item.sure}" data-field="sure">
        <input type="number" class="text-right" value="${item.baslangic}" data-field="baslangic">
        <input type="number" class="text-right" value="${item.artis}" data-field="artis">
        <input type="checkbox" ${item.tekrar ? 'checked' : ''} data-field="tekrar">
      `;
    } else if (type === "yillik") {
      fields = `
        <input type="text" value="${item.ad}" data-field="ad">
        <input type="text" class="text-right currency-input" value="${formatCurrency(item.tutar, true)}" data-field="tutar">
        <input type="number" class="text-right" value="${item.ay}" data-field="ay">
        <input type="number" class="text-right" value="${item.artis}" data-field="artis">
      `;
    }

    return `
      <div class="list-row" data-id="${item.id}" style="grid-template-columns: ${gridCols}">
        ${fields}
        <button class="btn-delete" data-action="delete">✕</button>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="card">
      <div class="grid-4">
        <div class="form-group">
          <label>Başlangıç Bakiyesi (₺)</label>
          <input type="text" class="currency-input" id="cfg-bakiye" value="${formatCurrency(bakiye, true)}">
        </div>
        <div class="form-group">
          <label>Başlangıç Yılı</label>
          <input type="number" id="cfg-yil" value="${yil}">
        </div>
        <div class="form-group">
          <label>Başlangıç Ayı</label>
          <input type="number" id="cfg-ay" value="${ay}" min="1" max="12">
        </div>
        <div class="form-group">
          <label>Projeksiyon Süresi (Ay)</label>
          <input type="number" id="cfg-sure" value="${sure}">
        </div>
      </div>
    </div>

    <div class="card">
      <div class="grid-4">
        <div class="form-group">
          <label>Yıllık Faiz Oranı (%)</label>
          <input type="number" step="0.1" id="cfg-faiz" value="${faiz}">
        </div>
        <div class="form-group">
          <label>2 Ayda Düşüş (Puan)</label>
          <input type="number" step="0.1" id="cfg-faizDusus" value="${faizDusus}">
        </div>
        <div class="form-group">
          <label>Minimum Faiz (%)</label>
          <input type="number" step="0.1" id="cfg-minFaiz" value="${minFaiz}">
        </div>
        <div class="form-group">
          <label>Stopaj Oranı (%)</label>
          <input type="number" step="0.1" id="cfg-stopaj" value="${stopaj}">
        </div>
      </div>
    </div>

    <div class="card">
      ${renderList("Sabit Gelirler", config.gelirler, "gelirler")}
    </div>
    <div class="card">
      ${renderList("Sabit Giderler", config.giderler, "giderler")}
    </div>
    <div class="card">
      ${renderList("Dönemsel Giderler", config.donemsel, "donemsel")}
    </div>
    <div class="card">
      ${renderList("Yıllık Giderler", config.yillik, "yillik")}
    </div>
  `;

  // Event listeners for inputs
  const inputs = container.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      const newConfig = getConfigFromForm(container, config);
      onUpdate(newConfig);
    });

    if (input.classList.contains("currency-input")) {
      input.addEventListener("focus", (e) => {
        const val = parseCurrency(e.target.value);
        e.target.value = val === 0 ? "" : val;
      });
      input.addEventListener("blur", (e) => {
        const val = parseCurrency(e.target.value);
        e.target.value = formatCurrency(val, true);
      });
    }
  });

  // Event listeners for dynamic lists
  container.addEventListener("click", (e) => {
    const target = e.target;
    if (target.dataset.action === "add") {
      const type = target.dataset.type;
      const newItem = createNewItem(type);
      config[type].push(newItem);
      onUpdate(config);
      renderForm(config, container, onUpdate);
    } else if (target.dataset.action === "delete") {
      const row = target.closest(".list-row");
      const type = target.closest(".list-section").dataset.type;
      const id = parseInt(row.dataset.id);
      config[type] = config[type].filter(item => item.id !== id);
      onUpdate(config);
      renderForm(config, container, onUpdate);
    }
  });
};

const createNewItem = (type) => {
  const id = Date.now();
  if (type === "gelirler") return { id, ad: "Yeni Gelir", tutar: 0, artis: 0, aylar: "tum" };
  if (type === "giderler") return { id, ad: "Yeni Gider", tutar: 0, artis: 0 };
  if (type === "donemsel") return { id, ad: "Yeni Dönemsel", tutar: 0, sure: 1, baslangic: 1, artis: 0, tekrar: false };
  if (type === "yillik") return { id, ad: "Yeni Yıllık", tutar: 0, ay: 1, artis: 0 };
  return null;
};

const getConfigFromForm = (container, currentConfig) => {
  const config = {
    ...currentConfig,
    bakiye: parseCurrency(container.querySelector("#cfg-bakiye").value),
    yil: parseInt(container.querySelector("#cfg-yil").value),
    ay: parseInt(container.querySelector("#cfg-ay").value),
    sure: parseInt(container.querySelector("#cfg-sure").value),
    faiz: parseFloat(container.querySelector("#cfg-faiz").value),
    faizDusus: parseFloat(container.querySelector("#cfg-faizDusus").value),
    minFaiz: parseFloat(container.querySelector("#cfg-minFaiz").value),
    stopaj: parseFloat(container.querySelector("#cfg-stopaj").value),
  };

  ["gelirler", "giderler", "donemsel", "yillik"].forEach(type => {
    const rows = container.querySelectorAll(`.list-section[data-type="${type}"] .list-row`);
    config[type] = Array.from(rows).map(row => {
      const id = parseInt(row.dataset.id);
      const item = { id };
      const inputs = row.querySelectorAll("input");
      inputs.forEach(input => {
        const field = input.dataset.field;
        if (input.type === "checkbox") {
          item[field] = input.checked;
        } else if (input.classList.contains("currency-input")) {
          item[field] = parseCurrency(input.value);
        } else if (input.type === "number") {
          item[field] = parseFloat(input.value);
        } else {
          item[field] = input.value;
        }
      });
      return item;
    });
  });

  return config;
};
