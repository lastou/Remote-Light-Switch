import { DEFAULT_SETTINGS, loadSettings } from "../lib/app-setting";
import { Settings } from "../lib/type";
import Config from "./config";
import App from "./index";

import { useEffect, useState } from "react";
import { Modal, PaperProvider, Portal } from "react-native-paper";
import { Appbar } from "react-native-paper";

export default function RootLayout() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    async function initializeSettings() {
      const savedSettings = await loadSettings();
      setSettings(savedSettings);
    }
    initializeSettings();
  }, []);

  return (
    <PaperProvider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <Config settings={settings} setSettings={setSettings} />
        </Modal>
      </Portal>
      <Appbar.Header>
        <Appbar.Content title="温湿度 & 灯开关" />
        <Appbar.Action icon="cog" onPress={showModal} />
      </Appbar.Header>
      <App settings={settings} />
    </PaperProvider>
  );
}
