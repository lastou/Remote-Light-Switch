import { Settings } from "../lib/type";
import { debounce } from "lodash";

import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Chip, Text } from "react-native-paper";

type SensorData = {
  temperature: number;
  humidity: number;
};

export default function App({ settings }: { settings: Settings }) {
  const [message, set_message] = useState("");
  const [data, setData] = useState<SensorData | null>(null);

  async function fetchSensorData() {
    try {
      const response = await fetch(`http://${settings.esp_ip}/sensor-data`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`[${response.status}] ${errorText}`);
      }
      const json: SensorData = await response.json();
      setData(json);
      set_message("");
    } catch (error) {
      set_message(`${error}`);
    }
  }

  async function setServoAngle(angle: number) {
    try {
      const response = await fetch(
        `http://${settings.esp_ip}/control?angleDest=${angle}&angleIdle=${settings.idle_angle}&duration=${settings.duration}`,
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
  const debouncedSetServoAngle = debounce(setServoAngle, 1000);

  useEffect(() => {
    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: "100%",
        padding: 16,
      }}
    >
      <View>
        <View style={{ height: 100 }}>
          <Chip style={{ alignSelf: "flex-start", minWidth: 50 }}>通讯</Chip>
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

        <Chip style={{ alignSelf: "flex-start", minWidth: 50, marginTop: 50 }}>
          温度
        </Chip>
        <Text
          variant="titleLarge"
          style={{
            textAlign: "center",
            marginTop: 6,
          }}
        >
          {data ? `${data.temperature}℃` : "Loading..."}
        </Text>

        <Chip style={{ alignSelf: "flex-start", minWidth: 50, marginTop: 16 }}>
          湿度
        </Chip>
        <Text
          variant="titleLarge"
          style={{
            textAlign: "center",
            marginTop: 6,
          }}
        >
          {data ? `${data.humidity}%` : "Loading..."}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 50,
        }}
      >
        <Button
          icon="lightbulb-on-outline"
          mode="contained"
          buttonColor="orange"
          onPress={() => debouncedSetServoAngle(settings.on_angle)}
          style={{ flex: 1, marginRight: 8, height: 120 }}
          contentStyle={{ height: "100%" }}
          labelStyle={{ fontSize: 18 }}
        >
          开灯
        </Button>
        <Button
          icon="lightbulb-off-outline"
          mode="contained"
          buttonColor="gray"
          onPress={() => debouncedSetServoAngle(settings.off_angle)}
          style={{ flex: 1, marginLeft: 8, height: 120 }}
          contentStyle={{ height: "100%" }}
          labelStyle={{ fontSize: 18 }}
        >
          关灯
        </Button>
      </View>
    </View>
  );
}
