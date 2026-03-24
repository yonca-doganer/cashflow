export const formatCurrency = (num, isInput = false) => {
  if (num === 0 || num === null || num === undefined) return isInput ? "0" : "-";
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

export const parseCurrency = (str) => {
  if (!str) return 0;
  // Remove dots (thousand separators) and replace comma with dot if any
  const cleanStr = str.toString().replace(/\./g, '').replace(/,/g, '.');
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : num;
};

export const formatDate = (year, month) => {
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  return `${months[month - 1]} ${year}`;
};
