import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";

import { setItemInStorage } from "@/Lib/manageStorage";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkOutline } from "@fortawesome/free-regular-svg-icons";

export default function BookmarkModal({
  bookmark,
  setBookmark,
  page,
  flatlistRef,
  deviceLanguage,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const bookmarkActions = [
    { value: "تحديد علامة حفظ", numAction: 1 },
    { value: "انتقال الى علامة حفظ", numAction: 2 },
  ];

  const handleAddBookmark = async (page) => {
    setBookmark(page);
    setItemInStorage("@bookmark", page);
    setModalVisible(false);
  };

  const handleGoToPage = async () => {
    flatlistRef.current.scrollToIndex({
      index: bookmark - 1,
      animated: true,
    });
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View
          style={[
            styles.selectBox,
            deviceLanguage.includes("ar")
              ? styles.borderStart
              : styles.borderEnd,
          ]}
        >
          <FontAwesomeIcon
            icon={bookmark === page ? faBookmark : faBookmarkOutline}
            size={25}
            color="#fff"
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
          accessible={false}
        >
          <View
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <PickerContainer style={styles.pickerContainer}>
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
            </PickerContainer>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const PickerContainer = styled.View`
  background-color: ${(props) => props.theme.pickerColor};
`;

const styles = StyleSheet.create({
  selectBox: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    width: "80%",
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
  borderEnd: {
    borderRightWidth: 1,
    borderRightColor: "#aaa",
  },
  borderStart: {
    borderLeftWidth: 1,
    borderLeftColor: "#aaa",
  },
});
