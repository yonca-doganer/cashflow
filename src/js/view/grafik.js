import { formatCurrency } from "../utils/format.js";

export const renderChart = (data, container) => {
  if (!data || !data.length) {
    container.innerHTML = "";
    return;
  }

  const width = 1000;
  const height = 300;
  const padding = 40;

  const bakiyeler = data.map(d => d.bakiye);
  const maxBakiye = Math.max(...bakiyeler, 0);
  const minBakiye = Math.min(...bakiyeler, 0);
  const range = maxBakiye - minBakiye;

  const getX = (i) => padding + (i * (width - 2 * padding) / (data.length - 1));
  const getY = (val) => height - padding - ((val - minBakiye) * (height - 2 * padding) / (range || 1));

  const points = data.map((d, i) => `${getX(i)},${getY(d.bakiye)}`).join(" ");
  const zeroY = getY(0);

  const hasNegative = minBakiye < 0;

  let html = `
    <div class="chart-header">
      <div class="chart-stat">
        <div class="label">En Yüksek Bakiye</div>
        <div class="value" style="color: var(--primary);">${formatCurrency(maxBakiye)} ₺</div>
      </div>
      <div class="chart-stat">
        <div class="label">En Düşük Bakiye</div>
        <div class="value" style="color: var(--expense);">${formatCurrency(minBakiye)} ₺</div>
      </div>
    </div>
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block;">
      <!-- Zero Line -->
      <line x1="${padding}" y1="${zeroY}" x2="${width - padding}" y2="${zeroY}" stroke="#e74c3c" stroke-width="1" stroke-dasharray="5,5" />
      
      <!-- Trend Line -->
      <polyline points="${points}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linejoin="round" />
      
      <!-- Points -->
      ${data.map((d, i) => `
        <circle cx="${getX(i)}" cy="${getY(d.bakiye)}" r="4" fill="white" stroke="var(--primary)" stroke-width="2" />
      `).join("")}
    </svg>
    ${hasNegative ? `
      <div style="margin-top: 12px; padding: 10px; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; color: #c53030; font-size: 12px; font-weight: 600; text-align: center;">
        ⚠️ Dikkat: Projeksiyon süresince bakiyeniz negatife düşmektedir!
      </div>
    ` : ""}
  `;

  container.innerHTML = html;
};
