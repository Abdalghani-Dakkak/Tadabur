import { pages } from "@/quran/pages";

let ayahs = [];

for (const page in pages) {
  pages[page].forEach((item) => {
    ayahs = [...ayahs, ...item.ayahs];
  });
}

export { ayahs };
