import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Meccan from "../assets/images/mecca.png";
import Medinan from "../assets/images/medina.png";
import { themes } from "@/Helper/Colors";

export default function CustomModal({
  data,
  isModalVisible,
  setModalVisible,
  flatlistRef,
}) {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data.data);

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

  useEffect(() => {
    const numericSearch = search.replace(/\D/g, ""); // Remove non-numeric characters
    setSearch(numericSearch); // Ensure search only contains numbers

    if (numericSearch.trim().length) {
      setFilteredData(() =>
        data.data.filter((item) =>
          // data.pages
          //   ? item.toString().includes(numericSearch) // Filter for pages
          //   : item.ayahs[0].page.toString().includes(numericSearch) // Filter for surahs
          item.toString().includes(numericSearch)
        )
      );
    } else {
      setFilteredData(data.data);
    }
  }, [search]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={`${data.pages ? `page_${index}` : `surah_${index}`}`}
      activeOpacity={0.7}
      onPress={() => handleGoToPage(data.pages ? item : item.ayahs[0].page)}
    >
      <View style={styles.pageContainer}>
        <Text style={[styles.text, { flex: 2 }]}>
          {data.pages ? item : item.ayahs[0].page}
        </Text>

        <View style={styles.surahNameContainer}>
          <Image
            style={styles.tinyLogo}
            source={
              data.pages
                ? data.pages[item][data.pages[item].length - 1]
                    .revelationType === "Meccan"
                  ? Meccan
                  : Medinan
                : item.revelationType === "Meccan"
                ? Meccan
                : Medinan
            }
          />
          <Text style={styles.surahName}>
            {data.pages
              ? data.pages[item][data.pages[item].length - 1].surahName
              : item.name}
          </Text>
        </View>

        <Text style={[styles.text, { flex: 1 }]}>
          {data.pages
            ? data.pages[item][data.pages[item].length - 1].surahNumber
            : item.number}
        </Text>
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
        {data.pages && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.search}
              value={search}
              onChangeText={setSearch}
              placeholder="بحث عن طريق رقم الصفحة..."
              placeholderTextColor="#555"
              keyboardType="numeric" // Ensure only numeric keyboard is shown
            />
          </View>
        )}
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) =>
            data.pages ? `page_${index}` : `surah_${index}`
          }
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
  pageContainer: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#777",
  },
  text: {
    padding: 15,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#000",
  },
  surahNameContainer: {
    flex: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: themes.light.third,
    padding: 5,
  },
  surahName: {
    fontSize: 20,
    textAlign: "right",
    color: themes.light.secondary,
  },
  tinyLogo: {
    width: 45,
    height: 50,
  },
  searchContainer: {
    padding: 15,
    paddingHorizontal: 20,
    backgroundColor: themes.light.text,
  },
  search: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    textAlign: "right",
    padding: 10,
  },
});
