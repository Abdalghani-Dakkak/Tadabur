import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RecitationsModal from "../components/RecitationsModal";
import TafaserModal from "../components/TafaserModal";
import BookmarkModal from "../components/BookmarkModal";
import CustomModal from "../components/CustomModal";
import SearchModal from "../components/SearchModal";

import { pages } from "../quran/pages";
import { themes } from "../Helper/Colors";

import QuranUthmani from "../api/quran-uthmani.json";
import Recitations from "../api/recitations.json";

import frame from "../assets/images/islamic-frame.png";
import ayahsSeparator from "../assets/images/ayahs-separetor.png";
import suraFrame from "../assets/images/surah-frame.png";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAyah, setSelectedAyah] = useState({});

  const [options, setOptions] = useState(true);
  const [isPagesModalOpen, setIsPagesModalOpen] = useState(false);
  const [isSurahModalOpen, setIsSurahModalOpen] = useState(false);
  const [isChaptersModalOpen, setIsChaptersModalOpen] = useState(false);
  const [isSearchModalIsOpen, setIsSearchModalIsOpen] = useState(false);

  const [recitations, setRecitations] = useState(null);
  const [selectedRecitation, setSelectedRecitation] = useState(null);

  const [bookmark, setBookmark] = useState(null);

  const [currentSound, setCurrentSound] = useState(null);
  const [soundCreated, setSoundCreated] = useState(false);
  const [soundPlay, setSoundPlay] = useState(false);
  const [soundLoader, setSoundLoader] = useState(false);
  const [playNext, setPlayNext] = useState(0);

  const flatlistRef = useRef();

  const getItemFromStorage = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const value = JSON.parse(jsonValue);
      switch (key) {
        case "@page":
          flatlistRef.current.scrollToIndex({
            index: value - 1,
          });
        case "@recitation":
          setSelectedRecitation(value);
        case "@bookmark":
          setBookmark(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const setItemInStorage = async (key, value) => {
    const jsonValue = JSON.stringify(value);
    try {
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log("Error scrolling to index:", e);
    }
  };

  useEffect(() => {
    getItemFromStorage("@page");
    // getItemFromStorage("@recitation");
    getItemFromStorage("@bookmark");

    const recitationArr = [];
    for (let recitation in Recitations)
      recitationArr.push(Recitations[recitation]);
    setRecitations(recitationArr);
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Trigger the callback when at least 50% of the item is visible
  };
  const onViewableItemsChanged = useRef(async ({ viewableItems }) => {
    if (viewableItems.length > 0)
      setCurrentPage(parseInt(viewableItems[0].item, 10)); // Set the index of the first visible item
  });

  const pageNumbers = Object.keys(pages);

  useEffect(() => {
    if (pages[currentPage]) setSelectedAyah(pages[currentPage][0]);
    setItemInStorage("@page", currentPage);
  }, [currentPage]);

  useEffect(() => {
    setItemInStorage("@recitation", selectedRecitation);
  }, [selectedRecitation]);

  const playAudio = async () => {
    _onPlaybackStatusUpdate = (playbackStatus) => {
      if (!playbackStatus.isLoaded) {
        setSoundLoader(true);
      } else {
        setSoundLoader(false);

        if (playbackStatus.isPlaying) setSoundPlay(true);
        else setSoundPlay(false);

        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          let ayat = [],
            ayatPages = [],
            indexOfNewAyah;
          for (const page in pages) {
            ayat = [...ayat, ...pages[page]];
            for (let i = 0; i < pages[page].length; i++) ayatPages.push(page);
          }

          for (let i = 0; i < ayat.length; i++)
            if (
              +ayat[i].numberInSurah === +selectedAyah.numberInSurah &&
              +ayat[i].surahNumber === +selectedAyah.surahNumber
            ) {
              if (i !== ayat.length - 1) indexOfNewAyah = i + 1;
              break;
            }

          setSelectedAyah(ayat[indexOfNewAyah]);
          setSoundCreated(false);
          setPlayNext((prev) => prev + 1);

          if (+ayatPages[indexOfNewAyah] !== currentPage)
            flatlistRef.current.scrollToIndex({
              animated: true,
              index: currentPage,
            });
        }
      }
    };

    if (!soundCreated) {
      try {
        const surahNum = selectedAyah.surahNumber.toString().padStart(3, "0"),
          ayahNum = selectedAyah.numberInSurah.toString().padStart(3, "0");

        const { sound } = await Audio.Sound.createAsync({
          uri: `https://everyayah.com/data/${selectedRecitation}/${surahNum}${ayahNum}.mp3`,
        });

        sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);

        setSoundCreated(true);
        setCurrentSound(sound);

        await sound.playAsync();
      } catch (e) {
        console.log("Error playing audio:", e);
      }
    } else {
      currentSound.playAsync();
    }
  };
  const pauseAudio = () => {
    if (currentSound) currentSound.pauseAsync();
  };
  const stopAudio = async () => {
    if (currentSound) await currentSound.stopAsync();
  };

  useEffect(() => {
    if (currentSound) {
      setSoundCreated(false);
      stopAudio();
    }
  }, [selectedAyah, selectedRecitation]);

  useEffect(() => {
    if (playNext) playAudio();
  }, [playNext]);

  function juzName(number) {
    const arabicNumbers = [
      "الأَوَّلُ",
      "الثَّانِي",
      "الثَّالِثُ",
      "الرَّابِعُ",
      "الخَامِسُ",
      "السَّادِسُ",
      "السَّابِعُ",
      "الثَّامِنُ",
      "التَّاسِعُ",
      "العَاشِرُ",
      "الحَادِيَ عَشَرَ",
      "الثَّانِيَ عَشَرَ",
      "الثَّالِثَ عَشَرَ",
      "الرَّابِعَ عَشَرَ",
      "الخَامِسَ عَشَرَ",
      "السَّادِسَ عَشَرَ",
      "السَّابِعَ عَشَرَ",
      "الثَّامِنَ عَشَرَ",
      "التَّاسِعَ عَشَرَ",
      "العِشْرُونَ",
      "الحَادِيَ وَالعِشْرُونَ",
      "الثَّانِيَ وَالعِشْرُونَ",
      "الثَّالِثَ وَالعِشْرُونَ",
      "الرَّابِعَ وَالعِشْرُونَ",
      "الخَامِسَ وَالعِشْرُونَ",
      "السَّادِسَ وَالعِشْرُونَ",
      "السَّابِعَ وَالعِشْرُونَ",
      "الثَّامِنَ وَالعِشْرُونَ",
      "التَّاسِعَ وَالعِشْرُونَ",
      "الثَّلاَثُونَ",
    ];

    if (number < 1 || number > 30) {
      throw new Error("رقم غير صالح. يُرجى إدخال رقم بين 1 و 30.");
    }

    return `الجُزْءُ ${arabicNumbers[number - 1]}`;
  }

  const renderSurahNameAndBasmalah = (ayah) => {
    if (ayah.numberInSurah === 1)
      return (
        <>
          {/* Surah Name */}
          <View style={styles.surahNameContainer}>
            <ImageBackground
              source={suraFrame}
              resizeMode="stretch"
              style={styles.surahNameBackground}
            >
              <Text style={styles.surahName}>
                {ayah.surahName.slice(7).trim()}
              </Text>
            </ImageBackground>
          </View>

          {/* Basmalah */}
          <View style={styles.basmalahContainer}>
            <Text style={styles.basmalah}>{ayah.text.slice(0, 38).trim()}</Text>
          </View>
        </>
      );
  };

  const renderPage = ({ item: pageNumber }) => {
    if (!pages[pageNumber]) {
      return (
        <View>
          <Text>Page not available</Text>
        </View>
      );
    }

    return (
      <ImageBackground source={frame} resizeMode="stretch">
        <TouchableWithoutFeedback
          onPress={() => setOptions((prev) => !prev)} // Toggle visibility on press
          accessible={false} // Ensure it doesn't block other accessibility features
        >
          <View
            style={[
              styles.page,
              {
                paddingTop: pages[pageNumber][0].numberInSurah === 1 && 60,
              },
            ]}
          >
            <Text>
              {pages[pageNumber].map((ayah, index) => (
                <Text
                  key={`ayah_${ayah.number}`}
                  style={{ textAlign: "right" }}
                >
                  {renderSurahNameAndBasmalah(ayah)}
                  <Text
                    style={[
                      styles.ayahText,
                      ayah.number === selectedAyah?.number && {
                        color: themes.light.secondary,
                        fontWeight: "600",
                      },
                    ]}
                    onPress={() => setOptions((prev) => !prev)}
                    onLongPress={() => setSelectedAyah(ayah)}
                  >
                    {` ${
                      ayah.numberInSurah === 1
                        ? ayah.text.slice(39).trim()
                        : ayah.text
                    } `}
                    <ImageBackground
                      source={ayahsSeparator}
                      resizeMode="stretch"
                      style={{
                        width: 30,
                        height: 30,
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        transform: "translateY(8px)",
                      }}
                    >
                      <Text
                        style={[
                          styles.ayahNumber,
                          ayah.number === selectedAyah?.number &&
                            styles.ayahSelected,
                        ]}
                      >{`${ayah.numberInSurah}`}</Text>
                    </ImageBackground>
                  </Text>
                </Text>
              ))}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#111" />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <FlatList
          data={pageNumbers}
          keyExtractor={(item) => item.toString()}
          renderItem={renderPage}
          horizontal
          pagingEnabled
          inverted
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged.current} // Add this callback
          viewabilityConfig={viewabilityConfig} // Add the config
          ref={flatlistRef}
          getItemLayout={(data, index) => ({
            length: width, // Item width
            offset: width * index, // Offset based on width and index
            index,
          })}
        />
        {options && (
          <>
            {pages[currentPage] && (
              <SafeAreaView
                style={styles.details}
                edges={["top", "left", "right"]}
              >
                <Text style={styles.textDetails}>
                  {pages[currentPage][pages[currentPage]?.length - 1].surahName}
                </Text>
                <Text style={styles.textDetails}>{currentPage}</Text>
                <Text style={styles.textDetails}>
                  {juzName(
                    pages[currentPage][pages[currentPage]?.length - 1].juz
                  )}
                </Text>
              </SafeAreaView>
            )}
            <SafeAreaView style={styles.options} edges="bottom">
              <View
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: "#aaa",
                }}
              >
                {soundLoader ? (
                  <Feather
                    name="loader"
                    size={25}
                    color="white"
                    style={[styles.optionIcon, styles.borderEnd]}
                  />
                ) : (
                  <Ionicons
                    name={!soundPlay ? "play" : "pause"}
                    size={25}
                    color="white"
                    onPress={() => (!soundPlay ? playAudio() : pauseAudio())}
                    style={[styles.optionIcon, styles.borderEnd]}
                  />
                )}
                <Ionicons
                  name="stop"
                  size={25}
                  color="white"
                  onPress={stopAudio}
                  style={[styles.optionIcon, styles.borderEnd]}
                />
                {recitations && (
                  <>
                    <RecitationsModal
                      data={recitations}
                      selectedValue={selectedRecitation}
                      setSelectedValue={setSelectedRecitation}
                      defaultValue="القارئ"
                    />

                    {/* <TafaserModal
                      data={recitations}
                      selectedValue={selectedRecitation}
                      setSelectedValue={setSelectedRecitation}
                      defaultValue="القارئ"
                    /> */}
                  </>
                )}
                <BookmarkModal
                  selectedValue={bookmark}
                  setSelectedValue={setBookmark}
                  page={currentPage}
                  flatlistRef={flatlistRef}
                />
                <Ionicons
                  name="search"
                  size={25}
                  color="white"
                  onPress={() => setIsSearchModalIsOpen(true)}
                  style={styles.optionIcon}
                />
                <SearchModal
                  data={pages}
                  isModalVisible={isSearchModalIsOpen}
                  setModalVisible={setIsSearchModalIsOpen}
                  flatlistRef={flatlistRef}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[styles.optionTextContainer, styles.borderEnd]}
                  onPress={() => setIsPagesModalOpen(true)}
                >
                  <Text style={styles.optionText}>الصفحات</Text>
                </TouchableOpacity>
                <CustomModal
                  data={{
                    data: pageNumbers,
                    pages: pages,
                  }}
                  isModalVisible={isPagesModalOpen}
                  setModalVisible={setIsPagesModalOpen}
                  flatlistRef={flatlistRef}
                />
                <TouchableOpacity
                  style={[styles.optionTextContainer, styles.borderEnd]}
                  onPress={() => setIsChaptersModalOpen(true)}
                >
                  <Text style={styles.optionText}>الأجزاء</Text>
                </TouchableOpacity>
                <CustomModal
                  data={{ data: QuranUthmani.data.surahs }}
                  isModalVisible={isChaptersModalOpen}
                  setModalVisible={setIsChaptersModalOpen}
                  flatlistRef={flatlistRef}
                />
                <TouchableOpacity
                  style={styles.optionTextContainer}
                  onPress={() => setIsSurahModalOpen(true)}
                >
                  <Text style={styles.optionText}>الفهرس</Text>
                </TouchableOpacity>
                <CustomModal
                  data={{ data: QuranUthmani.data.surahs }}
                  isModalVisible={isSurahModalOpen}
                  setModalVisible={setIsSurahModalOpen}
                  flatlistRef={flatlistRef}
                />
              </View>
            </SafeAreaView>
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width: width,
    height: height,
    paddingVertical: 40,
    paddingHorizontal: 35,
  },
  surahNameContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  surahNameBackground: {
    width: "100%",
    paddingVertical: 10,
  },
  surahName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: themes.light.secondary,
  },
  basmalahContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  basmalah: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: themes.light.text,
  },
  ayahText: {
    fontFamily: "HafsUthmanic",
    fontSize: 17,
    color: themes.light.text,
    lineHeight: 27,
    textAlign: "right",
    writingDirection: "rtl", // Ensures proper alignment for Arabic text
  },
  ayahNumber: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    color: themes.light.text,
  },
  ayahSelected: {
    color: themes.light.secondary,
    fontWeight: "600",
  },
  options: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  optionIcon: {
    padding: 12,
  },
  optionTextContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
  },
  borderEnd: {
    borderRightWidth: 1,
    borderRightColor: "#aaa",
  },
  details: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: 10,
  },
  textDetails: {
    color: "#fff",
    fontSize: 20,
  },
});
