export function checkOfThePlayedVerse(
  playbackState,
  selectedAyah,
  selectedRecitation
) {
  // const playedRecitation = currentSound?._lastStatusUpdate
  //   .split('"')
  //   [
  //     currentSound?._lastStatusUpdate
  //       ?.split('"')
  //       ?.findIndex((item) => item === "uri") + 2
  //   ].split("/")[
  //   currentSound?._lastStatusUpdate
  //     .split('"')
  //     [
  //       currentSound?._lastStatusUpdate
  //         ?.split('"')
  //         ?.findIndex((item) => item === "uri") + 2
  //     ].split("/")
  //     .findIndex((innerItem) => innerItem === "data") + 1
  // ];

  // const playedAyah = {
  //   surahNumber: +currentSound?._lastStatusUpdate
  //     .split('"')
  //     [
  //       currentSound?._lastStatusUpdate
  //         ?.split('"')
  //         ?.findIndex((item) => item === "uri") + 2
  //     ].split("/")
  //     [
  //       currentSound?._lastStatusUpdate
  //         .split('"')
  //         [
  //           currentSound?._lastStatusUpdate
  //             ?.split('"')
  //             ?.findIndex((item) => item === "uri") + 2
  //         ].split("/")
  //         .findIndex((innerItem) => innerItem === "data") + 2
  //     ]?.slice(0, 3),
  //   ayahNumber: +currentSound?._lastStatusUpdate
  //     .split('"')
  //     [
  //       currentSound?._lastStatusUpdate
  //         ?.split('"')
  //         ?.findIndex((item) => item === "uri") + 2
  //     ].split("/")
  //     [
  //       currentSound?._lastStatusUpdate
  //         .split('"')
  //         [
  //           currentSound?._lastStatusUpdate
  //             ?.split('"')
  //             ?.findIndex((item) => item === "uri") + 2
  //         ].split("/")
  //         .findIndex((innerItem) => innerItem === "data") + 2
  //     ]?.slice(3, 6),
  // }

  // const playedRecitation = currentSound?._lastStatusUpdate
  //   ? JSON.parse(currentSound?._lastStatusUpdate).uri.split("/")[2]
  //   : null;

  // const playedAyah = {
  //   surahNumber: currentSound?._lastStatusUpdate
  //     ? +JSON.parse(currentSound?._lastStatusUpdate)
  //         .uri.split("/")[3]
  //         .slice(0, 3)
  //     : null,
  //   ayahNumber: currentSound?._lastStatusUpdate
  //     ? +JSON.parse(currentSound?._lastStatusUpdate)
  //         .uri.split("/")[3]
  //         .slice(3, 6)
  //     : null,
  // };

  const playedRecitation = playbackState.uri.split("/")[2];

  const playedAyah = {
    surahNumber: +playbackState.uri.split("/")[3].slice(0, 3),
    ayahNumber: +playbackState.uri.split("/")[3].slice(3, 6),
  };

  if (
    (playedRecitation && playedRecitation !== selectedRecitation) ||
    (playedAyah.surahNumber &&
      playedAyah.surahNumber !== selectedAyah.surahNumber) ||
    (playedAyah.ayahNumber &&
      playedAyah.ayahNumber !== selectedAyah.numberInSurah)
  )
    return false;
  else return true;
}
