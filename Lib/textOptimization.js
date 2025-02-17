function removeExcessMem(text) {
  // Remove ۭ (regardless of context)
  text = text.replace(/ۭ/g, "");

  // Remove ۢ only if it is NOT followed by ب
  text = text.replace(/ۢ(?!ب)/g, "");

  return text;
}

function replaceSkonWithNewSkon(text) {
  return text.replace(/\u0652/g, "\u06E1");
}

function replaceDoNotReadWithSkon(text) {
  return text.replace(/\u06DF/g, "\u0652 ");
}

export function textOptimization(text) {
  const textwithoutExcessMem = removeExcessMem(text);

  const textWithNewSkon = replaceSkonWithNewSkon(textwithoutExcessMem);

  const fixedText = replaceDoNotReadWithSkon(textWithNewSkon);

  return fixedText;
}
