import * as Localization from "expo-localization";

const deviceLanguage = Localization.locale;

export function numberToArabicIndic(number) {
  // Mapping of digits to their Arabic-Indic equivalents
  const arabicIndicDigits = {
    0: "\u0660",
    1: "\u0661",
    2: "\u0662",
    3: "\u0663",
    4: "\u0664",
    5: "\u0665",
    6: "\u0666",
    7: "\u0667",
    8: "\u0668",
    9: "\u0669",
  };

  // Convert the number to a string and replace each digit
  const numberStr = number.toString();
  const arabicIndicNumber = numberStr
    .split("")
    .map((digit) => arabicIndicDigits[digit] || digit) // Fallback to original digit if not found
    .join("");

  return deviceLanguage.includes("ar")
    ? arabicIndicNumber
    : arabicIndicNumber.split("").reverse().join("");
}
