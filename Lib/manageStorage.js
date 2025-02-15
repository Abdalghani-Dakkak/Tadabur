import AsyncStorage from "@react-native-async-storage/async-storage";

const getItemFromStorage = async (key, flatlistRef, setState) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const value = JSON.parse(jsonValue);
    if (value)
      switch (key) {
        case "@page": {
          flatlistRef.current.scrollToIndex({
            index: value - 1,
          });
          break;
        }
        case "@recitation":
        case "@bookmark": 
        case "@isDark": {
          setState(value);
          break;
        }
      }
  } catch (e) {
    console.error(e);
  }
};

const setItemInStorage = async (key, value) => {
  const jsonValue = JSON.stringify(value);
  try {
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error scrolling to index:", e);
  }
};

export { getItemFromStorage, setItemInStorage };
