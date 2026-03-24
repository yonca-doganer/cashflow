import { formatCurrency } from "../utils/format.js";

export const renderCards = (data, container) => {
  if (!data || !data.length) {
    container.innerHTML = "";
    return;
  }

  const startBakiye = data[0].oncekiBakiye;
  const endBakiye = data[data.length - 1].bakiye;
  const greenMonths = data.filter(d => d.bakiye >= 0).length;
  const criticalMonthData = data.find(d => d.bakiye < 0);
  const criticalMonth = criticalMonthData ? `${criticalMonthData.ay}/${criticalMonthData.yil}` : "Yok";

  const cards = [
    { label: "Başlangıç Bakiye", value: `${formatCurrency(startBakiye)} ₺`, color: "var(--text)" },
    { label: "Bitiş Bakiye", value: `${formatCurrency(endBakiye)} ₺`, color: endBakiye >= 0 ? "var(--primary)" : "var(--expense)" },
    { label: "Yeşil Ay Sayısı", value: `${greenMonths} Ay`, color: "var(--primary)" },
    { label: "Kritik Ay", value: criticalMonth, color: criticalMonth === "Yok" ? "var(--primary)" : "var(--expense)" }
  ];

  container.innerHTML = cards.map(card => `
    <div class="summary-card">
      <div class="label">${card.label}</div>
      <div class="value" style="color: ${card.color};">${card.value}</div>
    </div>
  `).join("");
};
