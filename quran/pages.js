import QuranUthmani from "../api/quran-uthmani.json";

const quran = QuranUthmani.data.surahs;

const pages = {};
quran?.forEach((surah) => {
  surah.ayahs.forEach((ayah) => {
    if (!pages[ayah.page]) pages[ayah.page] = [];

    pages[ayah.page].push({
      ...ayah,
      surahName: surah.name,
      surahNumber: surah.number,
      revelationType: surah.revelationType,
    });
  });
});

export { pages };
