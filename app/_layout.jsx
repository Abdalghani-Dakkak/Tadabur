import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/rtk/Store";
import { fetchTheme } from "@/rtk/Slices/ThemesSlice";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

function AppWrapper() {
  const dispatch = useDispatch();
  const { theme, isDark } = useSelector((state) => state.theme);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const initializeTheme = async () => {
      await dispatch(fetchTheme());
      setThemeLoaded(true);
    };
    initializeTheme();
  }, [dispatch]);

  if (!themeLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="+not-found"
          options={{
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}
