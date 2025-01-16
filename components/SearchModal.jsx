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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes } from "@/Helper/Colors";

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

  const handleGoToPage = async (page) => {
    const jsonValue = JSON.stringify(page);
    try {
      await AsyncStorage.setItem("@page", jsonValue);

      // Scroll to the selected index
      flatlistRef.current.scrollToIndex({
        index: JSON.parse(jsonValue) - 1,
        animated: true,
      });

      setModalVisible(false);
    } catch (e) {
      console.log("Error scrolling to index:", e);
    }
  };

  // Function to extract Arabic text from a string
  // const getArabicText = (text) =>
  //   text.match(/[\u0600-\u06FF\s]+/g)?.join("") || "";

  function isAcceptedCharacter(char) {
    const regex = /^[\u0621-\u064A\u06BE\u06C1\s]$/;
    return regex.test(char);
  }
  const getArabicText = (text) => {
    let newText = "";
    for (let i = 0; i < text.length; i++)
      if (isAcceptedCharacter(text[i])) newText += text[i];
    return newText;
  };

  useEffect(() => {
    if (search.trim().length) {
      setFilteredAyat(() =>
        ayat.filter(
          (ayah) => getArabicText(ayah.text).includes(getArabicText(search))
          // getArabicText(ayah.text).split(" ").includes(getArabicText(search))
          // console.log(getArabicText(ayah.text))
        )
      );
    } else setFilteredAyat([...ayat]);
  }, [search]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={`ayah_${index}`}
      activeOpacity={0.7}
      onPress={() => handleGoToPage(item.page)}
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
