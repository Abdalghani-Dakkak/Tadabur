import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { themes } from "@/Helper/Colors";

export default function RecitationsModal({
  data,
  selectedValue,
  setSelectedValue,
  defaultValue,
}) {
  const [isModalVisible, setModalVisible] = useState(false);

  const selectedLabel =
    data.find((item) => item.subfolder === selectedValue) || defaultValue;

  return (
    <>
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectedText}>
          {selectedLabel.name
            ? `${
                selectedLabel.arabicName
                  ? selectedLabel.arabicName
                  : selectedLabel.name
              } ${
                selectedLabel.type
                  ? selectedLabel.arabicName
                    ? `(${selectedLabel.typeInArabic})`
                    : `(${selectedLabel.type})`
                  : ""
              }`
            : selectedLabel}
        </Text>
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
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.pickerContainer}>
              {data &&
                data.map((recitation, index) => (
                  <Text
                    key={`recitation_${index}`}
                    style={[
                      styles.pickerItem,
                      index !== data.length - 1 && styles.borderBottom,
                    ]}
                    onPress={() => {
                      setSelectedValue(recitation.subfolder);
                      setModalVisible(false);
                    }}
                  >
                    {`${
                      recitation.arabicName
                        ? recitation.arabicName
                        : recitation.name
                    } ${
                      recitation.type
                        ? recitation.arabicName
                          ? `(${recitation.typeInArabic})`
                          : `(${recitation.type})`
                        : ""
                    }`}
                  </Text>
                ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
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
  selectedText: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
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
