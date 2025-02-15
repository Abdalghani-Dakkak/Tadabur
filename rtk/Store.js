import { configureStore } from "@reduxjs/toolkit";

import ThemesSlice from "./Slices/ThemesSlice";


export const store = configureStore({
  reducer: {
    theme: ThemesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
