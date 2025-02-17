import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import styled from "styled-components/native";

import { handleGoToPage } from "@/Lib/handleGoToPage";
import { juzName } from "@/Lib/juzName";

import Meccan from "@/assets/images/mecca.png";
import Medinan from "@/assets/images/medina.png";

export default function NavigationModal({
  data,
  isModalVisible,
  setModalVisible,
  flatlistRef,
  type,
}) {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data.data);

  if (type === "page")
    useEffect(() => {
      if (search.trim().length) {
        setFilteredData(() =>
          data.data.filter((item) => item.toString().includes(search))
        );
      } else {
        setFilteredData(data.data);
      }
    }, [search]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={`${
        type === "page"
          ? `page_${index}`
          : type === "juz"
          ? `juz_${index}`
          : `surah_${index}`
      }`}
      activeOpacity={0.7}
      onPress={() =>
        handleGoToPage(
          type === "page"
            ? item
            : type === "juz"
            ? item[0].page
            : item.ayahs[0].page,
          flatlistRef,
          setModalVisible
        )
      }
    >
      <View style={styles.pageContainer}>
        <View style={[styles.textContainer, { flex: 2 }]}>
          <Text style={styles.text}>
            {type === "page"
              ? item
              : type === "juz"
              ? item[0].page
              : item.ayahs[0].page}
          </Text>
        </View>

        <SurahOrJuzNameContainer style={styles.surahOrJuzNameContainer}>
          {type !== "juz" && (
            <Image
              style={styles.tinyLogo}
              source={
                type === "page"
                  ? data.pages[item][data.pages[item].length - 1]
                      .revelationType === "Meccan"
                    ? Meccan
                    : Medinan
                  : item.revelationType === "Meccan"
                  ? Meccan
                  : Medinan
              }
            />
          )}
          <SurahOrJuzName style={styles.surahOrJuzName}>
            {type === "page"
              ? data.pages[item][data.pages[item].length - 1].surahName
              : type === "juz"
              ? juzName(index + 1)
              : item.name}
          </SurahOrJuzName>
        </SurahOrJuzNameContainer>

        <View style={[styles.textContainer, { flex: 1 }]}>
          <Text style={styles.text}>
            {type === "page"
              ? data.pages[item][data.pages[item].length - 1].surahNumber
              : type === "juz"
              ? index + 1
              : item.number}
          </Text>
        </View>
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
      <ModalContainer
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        {type === "page" && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.search}
              value={search}
              onChangeText={setSearch}
              placeholder="بحث عن طريق رقم الصفحة..."
              placeholderTextColor="#555"
              keyboardType="numeric" // Ensure only numeric keyboard is shown
              contextMenuHidden={true} // Disables copy/paste menu
            />
          </View>
        )}
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) =>
            type === "page"
              ? `page_${index}`
              : type === "juz"
              ? `juz_${index}`
              : `surah_${index}`
          }
          renderItem={renderItem}
        />
      </ModalContainer>
    </Modal>
  );
}

const ModalContainer = styled.KeyboardAvoidingView`
  background-color: ${(props) => props.theme.third};
`;

const SurahOrJuzNameContainer = styled.View`
  background-color: ${(props) => props.theme.third};
`;

const SurahOrJuzName = styled.Text`
  color: ${(props) => props.theme.secondary};
`;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  pageContainer: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#777",
  },
  textContainer: {
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 15,
  },
  text: {
    textAlign: "center",
    color: "#fff",
  },
  surahOrJuzNameContainer: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  surahOrJuzName: {
    flex: 1,
    fontSize: 20,
    textAlign: "right",
  },
  tinyLogo: {
    width: 45,
    height: 50,
  },
  searchContainer: {
    padding: 15,
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  search: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    textAlign: "right",
    padding: 10,
  },
});
