import { useEffect, useRef, useState } from "react";
import {
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  View,
} from "react-native";
import styled from "styled-components/native";

import { simpleText } from "@/Lib/getArabicText";
import { ayahs } from "@/quran/ayahs";

import quranSimple from "@/api/quranSimple.json";

export default function SearchModal({
  isModalVisible,
  setModalVisible,
  flatlistRef,
}) {
  const ayahsSimple = quranSimple.quran;
  const [search, setSearch] = useState("");
  const [filteredAyat, setFilteredAyat] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isModalVisible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (search.trim().length) {
      setFilteredAyat(() =>
        ayahs.filter((ayah, index) => {
          const ayahText =
            ayahsSimple[index].verse === 1 &&
            ayahsSimple[index].chapter !== 1 &&
            ayahsSimple[index].chapter !== 9
              ? ayahsSimple[index].text.slice(39).trim()
              : ayahsSimple[index].text;
          return simpleText(ayahText).includes(simpleText(search));
        })
      );
    } else {
      setFilteredAyat([]);
    }
  }, [search]);

  const handleAyahPress = (ayah) => {
    Keyboard.dismiss(); // Close the keyboard immediately
    setTimeout(() => {
      flatlistRef.current.scrollToIndex({
        animated: true,
        index: ayah.page - 1, // Scroll to selected ayah
      });
      setModalVisible(false); // Close modal after navigating
    }, 100);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={`ayah_${index}`}
      activeOpacity={0.7}
      onPress={() => handleAyahPress(item)}
    >
      <AyahContainer style={styles.ayahContainer}>
        <SurahName style={styles.surahName}>{item.surahName}</SurahName>
        <AyahText style={styles.ayahText}>
          {item.numberInSurah === 1 &&
          item.surahNumber !== 1 &&
          item.surahNumber !== 9
            ? item.text.slice(39).trim()
            : item.text}{" "}
          ({item.numberInSurah})
        </AyahText>
      </AyahContainer>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      {/* Wrap everything in TouchableWithoutFeedback to remove the keyboard when tapping anywhere */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ModalContainer
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.searchInputContainer}>
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              onChangeText={setSearch}
              value={search}
              placeholder="بحث..."
              placeholderTextColor="#555"
            />
          </View>
          <FlatList
            data={filteredAyat}
            keyExtractor={(item, index) => `ayah_${index}`}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled" // This ensures taps go through even when the keyboard is open
          />
        </ModalContainer>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const ModalContainer = styled.KeyboardAvoidingView`
  background-color: ${(props) => props.theme.third};
`;

const AyahContainer = styled.View`
  background-color: ${(props) => props.theme.third};
`;

const SurahName = styled.Text`
  color: ${(props) => props.theme.secondary};
`;

const AyahText = styled.Text`
  color: ${(props) => props.theme.text};
`;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  ayahContainer: {
    gap: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#777",
    padding: 5,
  },
  surahName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
  },
  ayahText: {
    fontSize: 18,
    textAlign: "right",
  },
  searchInputContainer: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    textAlign: "right",
    padding: 10,
  },
});
