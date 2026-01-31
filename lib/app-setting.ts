import { Settings } from "./type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DEFAULT_SETTINGS: Settings = {
  esp_ip: "192.168.31.15",
  on_angle: 180,
  off_angle: 0,
  idle_angle: 90,
  duration: 1000,
};

export async function saveSettings(settings: Settings) {
  await AsyncStorage.setItem("@app_settings", JSON.stringify(settings));
}

export async function loadSettings() {
  const jsonValue = await AsyncStorage.getItem("@app_settings");
  console.log("saved settings:", jsonValue);
  return jsonValue ? JSON.parse(jsonValue) : DEFAULT_SETTINGS;
}
