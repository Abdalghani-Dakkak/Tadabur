import hafsData from "@/api/hafsData.json";

const quran = hafsData.data.surahs;

const juzGroups = [];

quran.forEach((surah) => {
  surah.ayahs.forEach((ayah) => {
    const juzNumber = ayah.juz - 1;

    if (!juzGroups[juzNumber]) {
      juzGroups[juzNumber] = [];
    }

    juzGroups[juzNumber].push({
      surah: surah.number,
      surahName: surah.name,
      ayahNumber: ayah.numberInSurah,
      text: ayah.text,
      page: ayah.page,
    });
  });
});

export { juzGroups as juz };
