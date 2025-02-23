import { loadSettings, saveSettings } from "../lib/app-setting";
import { debounce } from "lodash";

import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Chip, Text, TextInput } from "react-native-paper";

export default function Index() {
  const [esp_ip, set_esp_ip] = useState("");
  const [on_angle, set_on_angle] = useState(0);
  const [off_angle, set_off_angle] = useState(0);
  const [message, set_message] = useState("");
  useEffect(() => {
    async function initializeSettings() {
      const savedSettings = await loadSettings();
      set_esp_ip(savedSettings.esp_ip);
      set_on_angle(savedSettings.on_angle);
      set_off_angle(savedSettings.off_angle);
    }
    initializeSettings();
  }, []);

  async function handleSaveSettings() {
    await saveSettings({ esp_ip, on_angle, off_angle });
  }

  async function sendRequest(angle: number) {
    try {
      const response = await fetch(`http://${esp_ip}/control?angle=${angle}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`[${response.status}] ${errorText}`);
      }
      set_message(`set angle to ${angle}`);
    } catch (error) {
      set_message(`${error}`);
    }
  }
  const debouncedSend = debounce(sendRequest, 1000);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: "100%",
        padding: 16,
      }}
    >
      <TextInput
        label="IP地址"
        value={esp_ip}
        onChangeText={(text) => set_esp_ip(text)}
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="开灯角度"
        value={String(on_angle)}
        onChangeText={(text) => set_on_angle(Number(text))}
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="关灯角度"
        value={String(off_angle)}
        onChangeText={(text) => set_off_angle(Number(text))}
        style={{ marginBottom: 12 }}
      />
      <Button
        mode="outlined"
        onPress={handleSaveSettings}
        style={{ marginBottom: 32, alignSelf: "center", minWidth: 100 }}
      >
        保存设置
      </Button>
      <View>
        <Chip style={{ alignSelf: "flex-start", minWidth: 50 }}>状态</Chip>
        <Text
          variant="titleLarge"
          style={{
            textAlign: "center",
            marginTop: 6,
            paddingVertical: 5,
            borderWidth: 1,
          }}
        >
          {message}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 32,
        }}
      >
        <Button
          icon="lightbulb-on-outline"
          mode="contained"
          buttonColor="orange"
          onPress={() => debouncedSend(on_angle)}
          style={{ flex: 1, marginRight: 8, height: 150 }}
          contentStyle={{ height: "100%" }}
          labelStyle={{ fontSize: 18 }}
        >
          开灯
        </Button>
        <Button
          icon="lightbulb-off-outline"
          mode="contained"
          buttonColor="gray"
          onPress={() => debouncedSend(off_angle)}
          style={{ flex: 1, marginLeft: 8, height: 150 }}
          contentStyle={{ height: "100%" }}
          labelStyle={{ fontSize: 18 }}
        >
          关灯
        </Button>
      </View>
    </View>
  );
}
