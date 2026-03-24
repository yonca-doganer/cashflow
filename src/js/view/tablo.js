import { formatCurrency } from "../utils/format.js";

export const renderTable = (data, container) => {
  if (!data || !data.length) {
    container.innerHTML = "<p class='p-4 text-center text-muted'>Hesaplanacak veri yok.</p>";
    return;
  }

  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  
  // Get all unique income/expense names for columns
  const incomeNames = Array.from(new Set(data.flatMap(d => d.gelirler.map(g => g.ad))));
  const expenseNames = Array.from(new Set(data.flatMap(d => d.giderler.map(g => g.ad))));
  const periodicNames = Array.from(new Set(data.flatMap(d => d.donemsel.map(g => g.ad))));
  const annualNames = Array.from(new Set(data.flatMap(d => d.yillik.map(g => g.ad))));

  let html = `
    <table>
      <thead>
        <tr>
          <th>Ay / Yıl</th>
          <th>Başlangıç</th>
          <th>Faiz %</th>
          ${incomeNames.map(name => `<th class="col-income">${name}</th>`).join("")}
          <th class="col-total-income">Top. Gelir</th>
          ${expenseNames.map(name => `<th class="col-expense">${name}</th>`).join("")}
          ${periodicNames.map(name => `<th class="col-periodic">${name}</th>`).join("")}
          ${annualNames.map(name => `<th class="col-annual">${name}</th>`).join("")}
          <th class="col-total-expense">Top. Gider</th>
          <th class="col-net">Net</th>
          <th>Bakiye</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((row, index) => {
    const isYearChange = index > 0 && data[index-1].yil !== row.yil;
    const rowClass = row.bakiye < 0 ? "row-negative" : "";
    const dividerClass = isYearChange ? "row-year-divider" : "";

    html += `
      <tr class="${rowClass} ${dividerClass}">
        <td>${months[row.ay - 1]} ${row.yil}</td>
        <td>${formatCurrency(row.oncekiBakiye)}</td>
        <td>%${row.faizOrani.toFixed(1)}</td>
        ${incomeNames.map(name => {
          const val = row.gelirler.find(g => g.ad === name)?.hesaplanan || 0;
          return `<td class="col-income ${val === 0 ? 'cell-zero' : ''}">${formatCurrency(val)}</td>`;
        }).join("")}
        <td class="col-total-income">${formatCurrency(row.toplamGelir)}</td>
        ${expenseNames.map(name => {
          const val = row.giderler.find(g => g.ad === name)?.hesaplanan || 0;
          return `<td class="col-expense ${val === 0 ? 'cell-zero' : ''}">${formatCurrency(val)}</td>`;
        }).join("")}
        ${periodicNames.map(name => {
          const item = row.donemsel.find(g => g.ad === name);
          const val = item?.hesaplanan || 0;
          const activeClass = item?.active ? "cell-periodic-active" : "";
          return `<td class="col-periodic ${activeClass} ${val === 0 ? 'cell-zero' : ''}">${formatCurrency(val)}</td>`;
        }).join("")}
        ${annualNames.map(name => {
          const item = row.yillik.find(g => g.ad === name);
          const val = item?.hesaplanan || 0;
          const activeClass = item?.active ? "cell-annual-active" : "";
          return `<td class="col-annual ${activeClass} ${val === 0 ? 'cell-zero' : ''}">${formatCurrency(val)}</td>`;
        }).join("")}
        <td class="col-total-expense">${formatCurrency(row.toplamGider)}</td>
        <td class="col-net">${formatCurrency(row.net)}</td>
        <td style="font-weight: 700;">${formatCurrency(row.bakiye)}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
};
