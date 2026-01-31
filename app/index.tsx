import { Settings } from "../lib/type";
import { debounce } from "lodash";

import { useState } from "react";
import { View } from "react-native";
import { Button, Chip, Text } from "react-native-paper";

export default function App({ settings }: { settings: Settings }) {
  const [message, set_message] = useState("");

  async function sendRequest(angle: number) {
    try {
      const response = await fetch(
        `http://${settings.esp_ip}/control?angleDest=${angle}&angleZero=${settings.idle_angle}&duration=${settings.duration}`,
      );
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
          onPress={() => debouncedSend(settings.on_angle)}
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
          onPress={() => debouncedSend(settings.off_angle)}
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
