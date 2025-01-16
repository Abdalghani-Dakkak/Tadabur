import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { themes } from "@/Helper/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookmarkModal({
  selectedValue,
  setSelectedValue,
  page,
  flatlistRef,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const bookmarkActions = [
    { value: "تحديد علامة حفظ", numAction: 1 },
    { value: "انتقال الى علامة حفظ", numAction: 2 },
  ];

  const handleAddBookmark = async (bookmark) => {
    setSelectedValue(bookmark);

    const jsonValue = JSON.stringify(bookmark);
    try {
      await AsyncStorage.setItem("@bookmark", jsonValue);

      setModalVisible(false);
    } catch (e) {
      console.log("Error scrolling to index:", e);
    }
  };

  const handleGoToPage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@bookmark");
      const value = JSON.parse(jsonValue);

      // Scroll to the selected index
      flatlistRef.current.scrollToIndex({
        index: value - 1,
        animated: true,
      });

      setModalVisible(false);
    } catch (e) {
      console.log("Error scrolling to index:", e);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons
          name={selectedValue === page ? "bookmark" : "bookmark-outline"}
          size={25}
          color="white"
          style={styles.selectBox}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.pickerContainer}>
            {bookmarkActions.map((bookmark, index) => (
              <Text
                key={`bookmarkAction_${index}`}
                style={[
                  styles.pickerItem,
                  index !== bookmarkActions.length - 1 && styles.borderBottom,
                ]}
                onPress={() => {
                  if (bookmark.numAction === 1) handleAddBookmark(page);
                  else handleGoToPage();
                  setModalVisible(false);
                }}
              >
                {bookmark.value}
              </Text>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectBox: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#aaa",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    width: "80%",
    backgroundColor: themes.light.main,
    borderRadius: 10,
  },
  pickerItem: {
    color: "#fff",
    textAlign: "center",
    padding: 10,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#fff",
  },
});
