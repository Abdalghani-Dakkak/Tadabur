import { removeExcessMem } from "@/Lib/removeExcessMem";
import QuranUthmani from "../api/quran-uthmani.json";

const quran = QuranUthmani.data.surahs;

const pages = {};
quran?.forEach((surah) => {
  surah.ayahs.forEach((ayah) => {
    if (!pages[ayah.page]) pages[ayah.page] = [];

    // Find the group for the current surah number in the page array
    let surahGroup = pages[ayah.page].find(
      (group) => group.surahNumber === surah.number
    );

    // If the group doesn't exist, create it
    if (!surahGroup) {
      surahGroup = {
        surahNumber: surah.number,
        surahName: surah.name,
        revelationType: surah.revelationType,
        ayahs: [],
      };
      pages[ayah.page].push(surahGroup);
    }

    // Add the ayah to the corresponding surah group
    surahGroup.ayahs.push({
      ...ayah,
      text: removeExcessMem(ayah.text),
      surahNumber: surah.number,
    });
  });
});

export { pages };
