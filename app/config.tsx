import { saveSettings } from "../lib/app-setting";
import { Settings } from "../lib/type";

import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";

type ConfigProps = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

export default function Config({ settings, setSettings }: ConfigProps) {
  async function handleSaveSettings() {
    await saveSettings(settings);
  }

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 12,
      }}
    >
      <TextInput
        label="IP地址"
        value={settings.esp_ip}
        onChangeText={(text) =>
          setSettings((prev) => ({ ...prev, esp_ip: text }))
        }
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="开灯角度"
        value={String(settings.on_angle)}
        onChangeText={(text) =>
          setSettings((prev) => ({ ...prev, on_angle: Number(text) }))
        }
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="关灯角度"
        value={String(settings.off_angle)}
        onChangeText={(text) =>
          setSettings((prev) => ({ ...prev, off_angle: Number(text) }))
        }
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="中间角度"
        value={String(settings.idle_angle)}
        onChangeText={(text) =>
          setSettings((prev) => ({ ...prev, idle_angle: Number(text) }))
        }
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="停留时间"
        value={String(settings.duration)}
        onChangeText={(text) =>
          setSettings((prev) => ({ ...prev, duration: Number(text) }))
        }
        style={{ marginBottom: 12 }}
      />
      <Button
        mode="outlined"
        onPress={handleSaveSettings}
        style={{ alignSelf: "center", minWidth: 100 }}
      >
        保存设置
      </Button>
    </View>
  );
}
