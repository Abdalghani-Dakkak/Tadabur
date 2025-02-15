import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { themes } from "../../Helper/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Async thunk to fetch the theme from AsyncStorage
export const fetchTheme = createAsyncThunk("theme/fetchTheme", async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@isDark");
    const value = JSON.parse(jsonValue);
    return value !== null ? value : false; // Default to false if no value is found
  } catch (e) {
    console.error("Error fetching theme from AsyncStorage:", e);
    return false; // Default to false in case of an error
  }
});

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: themes.light, // Default theme
    isDark: false, // Default to light theme
  },
  reducers: {
    switchTheme: (state, action) => {
      state.isDark = action.payload;
      state.theme = action.payload ? themes.dark : themes.light;
      // Save the new theme to AsyncStorage
      AsyncStorage.setItem("@isDark", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTheme.fulfilled, (state, action) => {
      state.isDark = action.payload;
      state.theme = action.payload ? themes.dark : themes.light;
    });
  },
});

export const { switchTheme } = themeSlice.actions;
export default themeSlice.reducer;