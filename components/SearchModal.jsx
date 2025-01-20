import { useEffect, useState } from "react";
import {
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";

import { themes } from "@/Helper/Colors";

import { handleGoToPage } from "@/Lib/handleGoToPage";

export default function SearchModal({
  data,
  isModalVisible,
  setModalVisible,
  flatlistRef,
}) {
  const [search, setSearch] = useState("");
  const [filteredAyat, setFilteredAyat] = useState([]);

  let ayat = [],
    ayatPages = [];

  for (const page in data) {
    ayat = [...ayat, ...data[page]];
    for (let i = 0; i < data[page].length; i++) ayatPages.push(page);
  }

  // for searching
  const getArabicText = (text) => {
    const regex = /[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]/g;
    return text
      .replace(/ٱلرَّحْمَٰنِ/g, "الرحمن") // Replace specific word "ٱلرَّحْمَٰنِ" with "الرحمن"
      .replace(regex, "") // Remove diacritics
      .replace(/ٱ/g, "ا") // Replace ٱ with ا
      .replace(/ٰ/g, "ا"); // Replace ٰ with ا
  };
  useEffect(() => {
    if (search.trim().length) {
      setFilteredAyat(() =>
        ayat.filter((ayah) =>
          getArabicText(ayah.text).includes(getArabicText(search))
        )
      );
    } else setFilteredAyat([...ayat]);
  }, [search]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={`ayah_${index}`}
      activeOpacity={0.7}
      onPress={() => handleGoToPage(item.page, flatlistRef, setModalVisible)}
    >
      <View style={styles.ayahContainer}>
        <Text style={styles.surahName}>{item.surahName}</Text>
        <Text
          style={styles.ayahText}
        >{`${item.text} (${item.numberInSurah})`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
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
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ayahContainer: {
    gap: 8,
    backgroundColor: themes.light.third,
    borderBottomWidth: 0.5,
    borderBottomColor: "#777",
    padding: 5,
  },
  surahName: {
    fontSize: 20,
    fontWeight: "bold",
    color: themes.light.secondary,
    textAlign: "right",
  },
  ayahText: {
    fontSize: 18,
    textAlign: "right",
  },
  searchInputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: themes.light.text,
  },
  searchInput: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    textAlign: "right",
    padding: 10,
  },
});
