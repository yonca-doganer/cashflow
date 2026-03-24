export const getDemoConfig = () => ({
  bakiye: 1000000,
  yil: 2026,
  ay: 3,
  sure: 40,
  faiz: 37,
  faizDusus: 1.5,
  minFaiz: 15,
  stopaj: 20,
  gelirler: [
    { id: 1, ad: "Ali Maaş", tutar: 45000, artis: 25, aylar: "tum" },
    { id: 2, ad: "Ayşe Maaş", tutar: 35000, artis: 25, aylar: "tum" },
    { id: 3, ad: "Kira Geliri", tutar: 15000, artis: 20, aylar: "tum" },
    { id: 4, ad: "Ek Gelir", tutar: 5000, artis: 20, aylar: "10-5" }
  ],
  giderler: [
    { id: 5, ad: "Mutfak", tutar: 30000, artis: 35 },
    { id: 6, ad: "Aile Harcama", tutar: 25000, artis: 35 },
    { id: 7, ad: "Aidat", tutar: 2750, artis: 30 },
    { id: 8, ad: "Yakıt", tutar: 3000, artis: 30 },
    { id: 9, ad: "Kredi Kartı", tutar: 20000, artis: 35 },
    { id: 10, ad: "Kira", tutar: 12000, artis: 30 }
  ],
  donemsel: [
    { id: 11, ad: "Okul Ücreti", tutar: 95000, sure: 5, baslangic: 9, artis: 30, tekrar: true },
    { id: 12, ad: "Yurt Güz", tutar: 5000, sure: 6, baslangic: 9, artis: 20, tekrar: true },
    { id: 13, ad: "Yurt Bahar", tutar: 5500, sure: 4, baslangic: 3, artis: 20, tekrar: true }
  ],
  yillik: [
    { id: 14, ad: "MTV", tutar: 15000, ay: 1, artis: 30 },
    { id: 15, ad: "Araba Sigorta", tutar: 20000, ay: 1, artis: 30 },
    { id: 16, ad: "Araba Bakım", tutar: 15000, ay: 7, artis: 25 },
    { id: 17, ad: "Gelir Vergisi", tutar: 25000, ay: 3, artis: 25 }
  ]
});

export const getEmptyConfig = () => {
  const now = new Date();
  return {
    bakiye: 0,
    yil: now.getFullYear(),
    ay: now.getMonth() + 1,
    sure: 12,
    faiz: 0,
    faizDusus: 0,
    minFaiz: 0,
    stopaj: 0,
    gelirler: [],
    giderler: [],
    donemsel: [],
    yillik: []
  };
};
