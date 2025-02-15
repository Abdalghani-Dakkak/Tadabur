export function removeExcessMem(text) {
  // Remove ۭ (regardless of context)
  text = text.replace(/ۭ/g, "");

  // Remove ۢ only if it is NOT followed by ب
  text = text.replace(/ۢ(?!ب)/g, "");

  return text;
}
