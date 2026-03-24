export const calculateCashFlow = (config) => {
  const { bakiye, yil, ay, sure, faiz, faizDusus, minFaiz, stopaj } = config;
  const results = [];
  let currentBakiye = bakiye;
  let currentFaiz = faiz;

  for (let i = 0; i < sure; i++) {
    const currentMonth = ((ay + i - 1) % 12) + 1;
    const currentYear = yil + Math.floor((ay + i - 1) / 12);
    const yilFark = currentYear - yil;

    // Faiz düşüşü (her 2 ayda bir)
    if (i > 0 && i % 2 === 0) {
      currentFaiz = Math.max(minFaiz, currentFaiz - faizDusus);
    }

    // Faiz geliri (aylık net)
    const faizGeliri = (currentBakiye * currentFaiz / 100 / 12) * (1 - stopaj / 100);

    // Gelirler
    const aylikGelirler = config.gelirler.map(g => {
      let active = false;
      if (g.aylar === "tum") {
        active = true;
      } else {
        const [start, end] = g.aylar.split("-").map(Number);
        if (start <= end) {
          active = currentMonth >= start && currentMonth <= end;
        } else {
          // Cross year (e.g., 10-5)
          active = currentMonth >= start || currentMonth <= end;
        }
      }
      const tutar = active ? g.tutar * Math.pow(1 + g.artis / 100, yilFark) : 0;
      return { ...g, hesaplanan: tutar };
    });

    // Giderler
    const aylikGiderler = config.giderler.map(g => {
      const tutar = g.tutar * Math.pow(1 + g.artis / 100, yilFark);
      return { ...g, hesaplanan: tutar };
    });

    // Dönemsel Giderler
    const aylikDonemsel = config.donemsel.map(g => {
      let active = false;
      const startMonth = g.baslangic;
      const duration = g.sure;
      
      // Calculate how many months since the start of the projection
      // but we need to consider if it repeats every year.
      if (g.tekrar) {
        // Find the start month in the current or previous year
        // A simple way: check if currentMonth is within [startMonth, startMonth + duration - 1]
        // taking modulo 12 into account.
        const monthsFromStart = (currentMonth - startMonth + 12) % 12;
        active = monthsFromStart < duration;
      } else {
        // Only once from the first occurrence
        // This is a bit more complex as we need to know the absolute start date.
        // For simplicity, let's assume it starts at the first occurrence of baslangic ay.
        // But the prompt says "başlangıç ayı" in the context of the item.
        // Let's assume it starts at the first occurrence of that month in the projection.
        // Actually, let's just use the same logic as repeat for now or check if it's the first year.
        const monthsFromStart = (currentMonth - startMonth + 12) % 12;
        const firstOccurrenceIndex = (startMonth - ay + 12) % 12;
        const absoluteMonthIndex = i;
        active = absoluteMonthIndex >= firstOccurrenceIndex && absoluteMonthIndex < firstOccurrenceIndex + duration;
      }

      const tutar = active ? g.tutar * Math.pow(1 + g.artis / 100, yilFark) : 0;
      return { ...g, hesaplanan: tutar, active };
    });

    // Yıllık Giderler
    const aylikYillik = config.yillik.map(g => {
      const active = currentMonth === g.ay;
      const tutar = active ? g.tutar * Math.pow(1 + g.artis / 100, yilFark) : 0;
      return { ...g, hesaplanan: tutar, active };
    });

    const toplamGelir = aylikGelirler.reduce((sum, g) => sum + g.hesaplanan, 0) + faizGeliri;
    
    // Include Faiz TL in the incomes list for the view
    const allGelirler = [
      { ad: "Faiz TL", hesaplanan: faizGeliri },
      ...aylikGelirler
    ];

    const toplamGider = aylikGiderler.reduce((sum, g) => sum + g.hesaplanan, 0) +
                        aylikDonemsel.reduce((sum, g) => sum + g.hesaplanan, 0) +
                        aylikYillik.reduce((sum, g) => sum + g.hesaplanan, 0);
    
    const net = toplamGelir - toplamGider;
    const oncekiBakiye = currentBakiye;
    currentBakiye += net;

    results.push({
      ay: currentMonth,
      yil: currentYear,
      faizOrani: currentFaiz,
      faizGeliri,
      gelirler: allGelirler,
      giderler: aylikGiderler,
      donemsel: aylikDonemsel,
      yillik: aylikYillik,
      toplamGelir,
      toplamGider,
      net,
      bakiye: currentBakiye,
      oncekiBakiye
    });
  }

  return results;
};
