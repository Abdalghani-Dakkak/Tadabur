export function removeDiacritics(text) {
  // Regular expression for Arabic diacritics
  const arabicDiacritics = /[\u064B-\u065F\u0670]/g;
  return text.replace(arabicDiacritics, "");
}

function removeStopSigns(text) {
  return text
    .replace(/ ۖ/g, "") // Normalize ۖ  to null
    .replace(/ ۗ/g, "") // Normalize ۗ  to null
    .replace(/ ۚ/g, "") // Normalize ۚ  to null
    .replace(/ ۘ/g, "") // Normalize ۘ  to null
    .replace(/ ۙ/g, ""); // Normalize ۙ  to null
}

function normalizeArabic(text) {
  return text
    .replace(/ٱ/g, "ا") // Convert Alef Wasla to Alef
    .replace(/إ|أ|آ/g, "ا") // Normalize Alef
    .replace(/ى/g, "ي") // Normalize Alef Maqsura to Yeh
    .replace(/ؤ/g, "و") // Normalize Waw Hamza
    .replace(/ة/g, "ه"); // Normalize Taa Marbuta to Haa
}

export function simpleText(text) {
  const textWithoutDiacritics = removeDiacritics(text);
  const normalizeArabicText = normalizeArabic(textWithoutDiacritics);
  const simplifiedText = removeStopSigns(normalizeArabicText);
  return simplifiedText.trim();
}
