import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { themes } from "@/Helper/Colors";

import suraFrame from "@/assets/images/surah-frame.png";

export default function SurahNameAndBasmalah({ ayah }) {
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
}

const styles = StyleSheet.create({
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
});
