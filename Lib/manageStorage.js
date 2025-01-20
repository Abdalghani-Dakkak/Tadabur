import AsyncStorage from "@react-native-async-storage/async-storage";

const getItemFromStorage = async (key, flatlistRef, setState) => {
  let ret = null;
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const value = JSON.parse(jsonValue);
    switch (key) {
      case "@page": {
        if (value)
          flatlistRef.current.scrollToIndex({
            index: value - 1,
          });
        break;
      }
      case "@recitation" || "@bookmark": {
        // if (value) setState(value);
        ret = value;
      }
    }
  } catch (e) {
    console.log(e);
  }
  if (ret) return JSON.parse(ret);
};

const setItemInStorage = async (key, value) => {
  const jsonValue = JSON.stringify(value);
  try {
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log("Error scrolling to index:", e);
  }
};

export { getItemFromStorage, setItemInStorage };
