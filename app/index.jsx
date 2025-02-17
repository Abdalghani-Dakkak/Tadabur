import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  I18nManager,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";
import * as Localization from "expo-localization";
import { useDispatch, useSelector } from "react-redux";
import { switchTheme } from "@/rtk/Slices/ThemesSlice";
import styled from "styled-components/native";
import {
  GestureHandlerRootView,
  State,
  PinchGestureHandler,
  PanGestureHandler,
} from "react-native-gesture-handler";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlay,
  faPause,
  faSpinner,
  faStop,
  faMagnifyingGlass,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

import SurahNameAndBasmalah from "@/components/SurahNameAndBasmalah";
import RecitationsModal from "@/components/RecitationsModal";
import BookmarkModal from "@/components/BookmarkModal";
import NavigationModal from "@/components/NavigationModal";
import SearchModal from "@/components/SearchModal";

import { pages } from "@/quran/pages";
import { juz } from "@/quran/juz";
import { ayahs } from "@/quran/ayahs";

import { juzName } from "@/Lib/juzName";
import { getItemFromStorage, setItemInStorage } from "@/Lib/manageStorage";
import { removeDiacritics } from "@/Lib/getArabicText";
import { displayAlert } from "@/Lib/displayAlert";
import { checkOfThePlayedVerse } from "@/Lib/checkOfThePlayedVerse";
import {
  adjustFontConfig,
  getDeviceType,
  getFontSize,
  getScreenSizeCategory,
} from "@/Lib/font";
import { numberToArabicIndic } from "@/Lib/numberToArabicIndic";

import QuranUthmani from "@/api/quran-uthmani.json";
import Recitations from "@/api/recitations.json";

import frame from "@/assets/images/islamic-frame.png";
import darkFrame from "@/assets/images/islamic-frame-dark-theme.png";
import bookmarkImage from "@/assets/images/bookmark.png";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAyah, setSelectedAyah] = useState({});

  const [options, setOptions] = useState(false);
  const [isPagesModalOpen, setIsPagesModalOpen] = useState(false);
  const [isSurahModalOpen, setIsSurahModalOpen] = useState(false);
  const [isChaptersModalOpen, setIsChaptersModalOpen] = useState(false);
  const [isSearchModalIsOpen, setIsSearchModalIsOpen] = useState(false);

  const [recitations, setRecitations] = useState(null);
  const [selectedRecitation, setSelectedRecitation] = useState(
    "Yasser_Ad-Dussary_128kbps"
  );

  const dispatch = useDispatch();

  const [bookmark, setBookmark] = useState(1);
  const isDark = useSelector((state) => state.theme.isDark); // Get the theme state from Redux

  const [currentSound, setCurrentSound] = useState(null);
  const [soundCreated, setSoundCreated] = useState(false);
  const [soundPlay, setSoundPlay] = useState(false);
  const [soundLoader, setSoundLoader] = useState(false);
  const [playNext, setPlayNext] = useState(0);

  // Add these state variables near other useState hooks
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [baseScale, setBaseScale] = useState(1.0);
  const [currentScale, setCurrentScale] = useState(1.0);
  const [showZoomLevel, setShowZoomLevel] = useState(false);

  const pageNumbers = Object.keys(pages);

  const flatlistRef = useRef(null);
  const zoomRef = useRef(1.0); // Store zoom level without triggering re-renders

  const selectedAyahRef = useRef(selectedAyah);
  const selectedRecitationRef = useRef(selectedRecitation);
  const currentSoundRef = useRef(currentSound);

  useEffect(() => {
    selectedAyahRef.current = selectedAyah;
  }, [selectedAyah]);
  useEffect(() => {
    selectedRecitationRef.current = selectedRecitation;
  }, [selectedRecitation]);
  useEffect(() => {
    currentSoundRef.current = currentSound;
  }, [currentSound]);

  const [fontsLoaded] = useFonts({
    kfgqpchafsuthmanicscript_regula: require("../assets/fonts/kfgqpchafsuthmanicscript_regula.otf"),
  });

  I18nManager.forceRTL(false); // Forces Left-to-Right layout
  I18nManager.allowRTL(false); // Prevents switching to Right-to-Left

  const deviceLanguage = Localization.locale; // Example: "ar", "en-US"

  useEffect(() => {
    getItemFromStorage("@page", flatlistRef);
    getItemFromStorage("@recitation", null, setSelectedRecitation);
    getItemFromStorage("@bookmark", null, setBookmark);

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

  useEffect(() => {
    if (pages[currentPage]) setSelectedAyah(pages[currentPage][0].ayahs[0]);
    setItemInStorage("@page", currentPage);
  }, [currentPage]);
  useEffect(() => {
    setItemInStorage("@recitation", selectedRecitation);
  }, [selectedRecitation]);

  const _onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.isLoaded) {
      setSoundLoader(false);

      if (
        !checkOfThePlayedVerse(
          playbackStatus,
          selectedAyahRef.current,
          selectedRecitationRef.current
        )
      ) {
        stopAudio(true);
      }

      if (playbackStatus.isPlaying) {
        setSoundLoader(false); // Stop loader when audio actually starts playing
        setSoundPlay(true);
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        setSoundCreated(false);
        setCurrentSound(null);

        if (ayahs[selectedAyah.number]) {
          setSelectedAyah(ayahs[selectedAyah.number]); // selected next ayah
          setPlayNext((prev) => prev + 1); // play next ayah sound
          setSoundLoader(true); // Keep loader active before loading the next Ayah
        }

        // for going to next page if next ayah of selceted ayah position in the next page
        if (
          ayahs[selectedAyah.number] &&
          +ayahs[selectedAyah.number].page !== currentPage
        )
          flatlistRef.current.scrollToIndex({
            animated: true,
            index: currentPage,
          });
      }
    }
  };

  const playAudio = async () => {
    if (!soundCreated) {
      setSoundLoader(true);

      try {
        // Stop and unload any existing sound before playing a new one
        if (currentSound) {
          await currentSound.stopAsync();
          await currentSound.unloadAsync(); // Stop and unload the current sound
          setCurrentSound(null);
          setSoundCreated(false);
        }

        const surahNum = selectedAyah.surahNumber.toString().padStart(3, "0"),
          ayahNum = selectedAyah.numberInSurah.toString().padStart(3, "0");

        const { sound } = await Audio.Sound.createAsync(
          {
            uri: `https://everyayah.com/data/${selectedRecitation}/${surahNum}${ayahNum}.mp3`,
          },
          {
            shouldPlay: true,
            staysActiveInBackground: true,
          }
        );

        sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);

        setSoundCreated(true);
        setCurrentSound(sound);

        await sound.playAsync();
      } catch (e) {
        displayAlert("فشل تشغيل الصوت", "حدث خطأ في الاتصال");
      } finally {
        setSoundLoader(false);
      }
    } else {
      try {
        currentSound.playAsync();
      } catch (e) {
        console.error("Error playing audio:", e);
      } finally {
        setSoundLoader(false);
      }
    }
  };
  const pauseAudio = () => {
    if (currentSound) {
      setSoundPlay(false);
      currentSound.pauseAsync();
    }
  };
  const stopAudio = async (flag) => {
    if (currentSound || flag) {
      await currentSoundRef.current.stopAsync();
      await currentSoundRef.current.unloadAsync();
      currentSoundRef.current = null;
      setCurrentSound(null);
      setSoundCreated(false);
      setSoundPlay(false);
    }
  };

  // Ensure audio continues playing in the background
  useEffect(() => {
    const configureAudioForBackground = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false, // No recording needed
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX, // Don't mix with other apps
          playsInSilentModeIOS: true, // Allow playback in silent mode
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX, // Don't mix with other apps on Android
          shouldDuckAndroid: false, // Avoid lowering volume for other sounds
          staysActiveInBackground: true, // Keeps the sound active when the app is in the background
          playThroughEarpieceAndroid: false, // Route audio to the speaker instead of the earpiece
        });
      } catch (error) {
        console.error(
          "Error configuring audio for background playback:",
          error
        );
      }
    };

    configureAudioForBackground();
  }, []);

  useEffect(() => {
    stopAudio();
  }, [selectedAyah, selectedRecitation]);

  useEffect(() => {
    if (playNext) playAudio();
  }, [playNext]);

  // for animation
  // ###################################################################################################################
  const rotation = useRef(new Animated.Value(0)).current;

  // Start rotation animation
  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000, // Duration of one full rotation
        easing: Easing.linear, // Smooth linear rotation
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  };

  // Stop rotation animation
  const stopRotation = () => {
    rotation.stopAnimation();
    rotation.setValue(0); // Reset rotation value
  };

  // Trigger animation when soundLoader changes
  useEffect(() => {
    if (soundLoader) startRotation();
    else stopRotation();
  }, [soundLoader]);

  // Interpolate rotation value to degrees
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const loaderStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };
  // ###################################################################################################################

  // index.jsx
  const handlePinchGesture = (event) => {
    const { scale } = event.nativeEvent;
    const newScale = baseScale * scale;

    // Clamp the scale between 0.7 and 2.0
    const clampedScale = Math.max(0.7, Math.min(2.0, newScale));
    setCurrentScale(clampedScale);
  };

  const handlePinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Determine if the user is zooming in or out
      const isZoomingIn = currentScale > baseScale;

      // Adjust the zoom level by 0.2
      let newZoomLevel = zoomLevel;
      if (isZoomingIn) {
        // Increase by 0.2, capped at 2.0
        if (zoomLevel >= 1) newZoomLevel = Math.min(2.0, zoomLevel + 0.2);
        else newZoomLevel = Math.min(2.0, zoomLevel + 0.1); // Increase by 0.1, capped at 2.0
      } else {
        // Decrease by 0.2, capped at 0.7
        if (zoomLevel > 1) newZoomLevel = Math.max(0.7, zoomLevel - 0.2);
        else newZoomLevel = Math.max(0.7, zoomLevel - 0.1); // Decrease by 0.1, capped at 0.7
      }

      // Round to 1 decimal place
      newZoomLevel = Math.round(newZoomLevel * 10) / 10;

      // Update the zoom level and reset scale values
      setZoomLevel(newZoomLevel);
      setBaseScale(1.0);
      setCurrentScale(1.0);

      adjustFontConfig(
        getDeviceType(),
        getScreenSizeCategory(),
        0.95 * zoomLevel,
        1.15 * zoomLevel
      );

      setShowZoomLevel(true);

      // Hide the zoom level indicator after 1 second
      setTimeout(() => {
        setShowZoomLevel(false);
      }, 1000);
    }
  };

  const renderPage = ({ item: pageNumber }) => {
    return (
      <Background source={isDark ? darkFrame : frame} resizeMode="stretch">
        {+pageNumber === bookmark && (
          <Image source={bookmarkImage} style={styles.bookmark} />
        )}
        <TouchableWithoutFeedback
          onPress={() => setOptions((prev) => !prev)}
          accessible={false}
        >
          <View style={{ flex: 1 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              {/* PinchGestureHandler for zooming (two fingers) */}
              <PinchGestureHandler
                onGestureEvent={handlePinchGesture}
                onHandlerStateChange={handlePinchStateChange}
                minPointers={2} // Require two fingers for zoom
                maxPointers={2} // Allow only two fingers
                simultaneousHandlers={flatlistRef} // Allow simultaneous gestures
              >
                <View style={{ flex: 1 }}>
                  {/* ScrollView for one-finger scrolling */}
                  <ScrollView
                    style={[styles.page]}
                    contentContainerStyle={{ flexGrow: 1 }}
                  >
                    {pages[pageNumber].map(
                      (item) =>
                        +pageNumber === +currentPage && (
                          <View>
                            {item.ayahs[0].numberInSurah === 1 && (
                              <SurahNameAndBasmalah
                                item={item}
                                isDark={isDark}
                              />
                            )}

                            <Text
                              style={{
                                textAlign: "justify",
                              }}
                            >
                              {item.ayahs.map((ayah, index) => (
                                <AyahText
                                  style={[
                                    styles.ayahText,
                                    {
                                      fontSize: getFontSize(20),
                                      fontFamily: fontsLoaded
                                        ? "kfgqpchafsuthmanicscript_regula"
                                        : "",
                                    },
                                    ayah.number === selectedAyah?.number && {
                                      backgroundColor: isDark
                                        ? "#cccccc55"
                                        : "#03a9f422",
                                    },
                                  ]}
                                  onPress={() => setOptions((prev) => !prev)}
                                  onLongPress={() => setSelectedAyah(ayah)}
                                >
                                  {`${
                                    ayah.numberInSurah !== 1 && index !== 0
                                      ? " "
                                      : ""
                                  }${
                                    ayah.numberInSurah === 1 &&
                                    item.surahNumber !== 1 &&
                                    item.surahNumber !== 9
                                      ? ayah.text.slice(39).trim()
                                      : ayah.text
                                  } ${numberToArabicIndic(ayah.numberInSurah)}`}
                                </AyahText>
                              ))}
                            </Text>
                          </View>
                        )
                    )}
                  </ScrollView>
                </View>
              </PinchGestureHandler>
            </GestureHandlerRootView>
          </View>
        </TouchableWithoutFeedback>
      </Background>
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler
            minPointers={2} // Allow one finger for sliding between pages
            maxPointers={1} // Allow only one finger for sliding
            simultaneousHandlers={flatlistRef} // Allow simultaneous gestures
          >
            <FlatList
              ref={flatlistRef}
              data={pageNumbers}
              keyExtractor={(item) => item.toString()}
              renderItem={renderPage}
              horizontal
              pagingEnabled
              inverted
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged.current}
              viewabilityConfig={viewabilityConfig}
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
            />
          </PanGestureHandler>
        </GestureHandlerRootView>
        {options && (
          <>
            {pages[currentPage] && (
              <SafeAreaView
                style={styles.details}
                edges={["top", "left", "right"]}
              >
                <Text style={styles.textDetails}>
                  {removeDiacritics(
                    pages[currentPage][pages[currentPage]?.length - 1].surahName
                  ).replace(/ٱ/g, "ا")}
                </Text>
                <Text style={styles.textDetails}>{currentPage}</Text>
                <Text style={styles.textDetails}>
                  {juzName(
                    pages[currentPage][pages[currentPage]?.length - 1].ayahs[0]
                      .juz
                  )}
                </Text>
              </SafeAreaView>
            )}
            <SafeAreaView style={styles.options} edges={["bottom"]}>
              <View
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: "#aaa",
                }}
              >
                {soundLoader ? (
                  <View
                    style={!deviceLanguage.includes("ar") && styles.borderEnd}
                  >
                    <Animated.View style={[loaderStyle, styles.optionIcon]}>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        color="#fff"
                        size={25}
                      />
                    </Animated.View>
                  </View>
                ) : (
                  <TouchableWithoutFeedback
                    onPress={() => (!soundPlay ? playAudio() : pauseAudio())}
                  >
                    <View
                      style={[
                        styles.optionIcon,
                        !deviceLanguage.includes("ar") && styles.borderEnd,
                      ]}
                    >
                      <FontAwesomeIcon
                        icon={!soundPlay ? faPlay : faPause}
                        color="#fff"
                        size={25}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                )}
                <TouchableWithoutFeedback
                  disabled={soundLoader}
                  onPress={stopAudio}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      deviceLanguage.includes("ar")
                        ? styles.borderStart
                        : styles.borderEnd,
                    ]}
                  >
                    <FontAwesomeIcon
                      icon={faStop}
                      color={soundLoader ? "#ccc" : "#fff"}
                      size={25}
                    />
                  </View>
                </TouchableWithoutFeedback>
                {recitations && (
                  <RecitationsModal
                    data={recitations}
                    selectedValue={selectedRecitation}
                    setSelectedValue={setSelectedRecitation}
                    defaultValue="القارئ"
                    deviceLanguage={deviceLanguage}
                  />
                )}
                <TouchableWithoutFeedback
                  onPress={() => {
                    dispatch(switchTheme(!isDark)); // Toggle the theme
                    setItemInStorage("@isDark", !isDark); // Save the new theme preference
                  }}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      deviceLanguage.includes("ar")
                        ? styles.borderStart
                        : styles.borderEnd,
                    ]}
                  >
                    <FontAwesomeIcon
                      icon={isDark ? faMoon : faSun}
                      color="#fff"
                      size={25}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <BookmarkModal
                  bookmark={bookmark}
                  setBookmark={setBookmark}
                  page={currentPage}
                  flatlistRef={flatlistRef}
                  deviceLanguage={deviceLanguage}
                />
                <TouchableWithoutFeedback
                  onPress={() => {
                    stopAudio();
                    setIsSearchModalIsOpen(true);
                  }}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      deviceLanguage.includes("ar") && styles.borderStart,
                    ]}
                  >
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      color="#fff"
                      size={25}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <SearchModal
                  isModalVisible={isSearchModalIsOpen}
                  setModalVisible={setIsSearchModalIsOpen}
                  flatlistRef={flatlistRef}
                />
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[
                    styles.optionTextContainer,
                    !deviceLanguage.includes("ar") && styles.borderEnd,
                  ]}
                  onPress={() => {
                    stopAudio();
                    setIsPagesModalOpen(true);
                  }}
                >
                  <Text style={styles.optionText}>الصفحات</Text>
                </TouchableOpacity>
                <NavigationModal
                  data={{
                    data: pageNumbers,
                    pages: pages,
                  }}
                  isModalVisible={isPagesModalOpen}
                  setModalVisible={setIsPagesModalOpen}
                  flatlistRef={flatlistRef}
                  type="page"
                />
                <TouchableOpacity
                  style={[
                    styles.optionTextContainer,
                    deviceLanguage.includes("ar")
                      ? styles.borderStart
                      : styles.borderEnd,
                  ]}
                  onPress={() => {
                    stopAudio();
                    setIsChaptersModalOpen(true);
                  }}
                >
                  <Text style={styles.optionText}>الأجزاء</Text>
                </TouchableOpacity>
                <NavigationModal
                  data={{ data: juz }}
                  isModalVisible={isChaptersModalOpen}
                  setModalVisible={setIsChaptersModalOpen}
                  flatlistRef={flatlistRef}
                  type="juz"
                />
                <TouchableOpacity
                  style={[
                    styles.optionTextContainer,
                    deviceLanguage.includes("ar") && styles.borderStart,
                  ]}
                  onPress={() => {
                    stopAudio();
                    setIsSurahModalOpen(true);
                  }}
                >
                  <Text style={styles.optionText}>الفهرس</Text>
                </TouchableOpacity>
                <NavigationModal
                  data={{ data: QuranUthmani.data.surahs }}
                  isModalVisible={isSurahModalOpen}
                  setModalVisible={setIsSurahModalOpen}
                  flatlistRef={flatlistRef}
                  type="surah"
                />
              </View>
            </SafeAreaView>
          </>
        )}
        {showZoomLevel && (
          <SafeAreaView
            style={styles.zoomLevelContainer}
            edges={["top", "bottom", "left", "right"]}
          >
            <View style={styles.zoomLevel}>
              <Text style={styles.zoomLevelText}>x{zoomLevel}</Text>
            </View>
          </SafeAreaView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const Background = styled.ImageBackground`
  background-color: ${(props) => props.theme.background};
  padding-block: ${height / 15}px;
`;

const AyahText = styled.Text`
  color: ${(props) => props.theme.text};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  page: {
    width: width,
    height: height - 80,
    paddingHorizontal: "10%",
    flex: 1,
  },
  bookmark: {
    width: 25,
    height: 100,
    position: "absolute",
    top: 0,
    right: 50,
  },
  ayahText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  ayahNumber: {
    fontWeight: "bold",
    textAlign: "center",
  },
  options: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  optionIcon: {
    padding: 12,
    justifyContent: "center",
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
  borderStart: {
    borderLeftWidth: 1,
    borderLeftColor: "#aaa",
  },
  details: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    paddingVertical: 10,
    pointerEvents: "none",
  },
  textDetails: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },
  zoomLevelContainer: {
    position: "absolute",
    top: 0,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  zoomLevel: {
    width: width / 3,
    height: width / 3,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomLevelText: {
    color: "#fff",
    fontSize: 20,
  },
});
