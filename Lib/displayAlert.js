import { Alert } from "react-native";

export const displayAlert = (title, content) =>
  Alert.alert(title, content, [{ text: "موافق" }]);
