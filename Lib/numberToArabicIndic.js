import { I18nManager } from "react-native";

export function numberToArabicIndic(number) {
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


  const numberStr = number.toString();
  const arabicIndicNumber = numberStr
    .split("")
    .map((digit) => arabicIndicDigits[digit] || digit)
    .join("");

  let result = I18nManager.isRTL
    ? arabicIndicNumber
    : arabicIndicNumber.split("").reverse().join("");

  // Only reverse if the layout is NOT RTL
  return result.split("").reverse().join("");
}
