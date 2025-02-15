import { View, ImageBackground, StyleSheet } from "react-native";
import styled from "styled-components/native";

import { getFontSize } from "@/Lib/font";

import suraFrame from "@/assets/images/surah-frame.png";
import darkSuraFrame from "@/assets/images/surah-frame-dark-theme.png";

export default function SurahNameAndBasmalah({ item, isDark }) {
  return (
    <View style={styles.container}>
      {/* Surah Name */}
      <View style={styles.surahNameContainer}>
        <ImageBackground
          source={isDark ? darkSuraFrame : suraFrame}
          resizeMode="stretch"
          style={styles.surahNameBackground}
        >
          <SurahName style={[styles.surahName, { fontSize: getFontSize(20) }]}>
            {item.surahName.slice(7).trim()}
          </SurahName>
        </ImageBackground>
      </View>

      {/* Basmalah */}
      {item.surahNumber !== 1 && item.surahNumber !== 9 && (
        <View
          style={[
            styles.basmalahContainer,
            item.surahNumber === 1 && { fontWeight: 600 },
          ]}
        >
          <Basmalah style={[styles.basmalah, { fontSize: getFontSize(18) }]}>
            {item.ayahs[0].text.slice(0, 38).trim()}
          </Basmalah>
        </View>
      )}
    </View>
  );
}

const SurahName = styled.Text`
  color: ${(props) => props.theme.secondary};
`;

const Basmalah = styled.Text`
  color: ${(props) => props.theme.basmalah};
`;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 5,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  surahNameContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  surahNameBackground: {
    width: "100%",
  },
  surahName: {
    fontSize: getFontSize(20),
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
  },
  basmalahContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  basmalah: {
    fontSize: getFontSize(18),
    fontWeight: "bold",
    textAlign: "center",
  },
});
