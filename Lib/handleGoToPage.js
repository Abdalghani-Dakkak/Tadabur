import AsyncStorage from "@react-native-async-storage/async-storage";

const handleGoToPage = async (page, flatlistRef, setModalVisible) => {
  const jsonValue = JSON.stringify(page);
  try {
    await AsyncStorage.setItem("@page", jsonValue);

    flatlistRef.current.scrollToIndex({
      index: JSON.parse(jsonValue) - 1,
    });

    setModalVisible(false);
  } catch (e) {
    console.log("Error scrolling to index:", e);
  }
};

export { handleGoToPage };
