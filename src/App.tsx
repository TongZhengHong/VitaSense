import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";

import BottomAppBar from "./components/BottomNavBar";
import AppBar from "./components/AppBar";
import useBluetooth from "./hooks/useBluetooth";
import React from "react";
import { openExternalFile } from "./utils/FileUtils";

export default function App() {
  const { requestPermissions, scanForDevices } = useBluetooth();

  const runBluetoothScan = async () => {
    console.log(
      "Bluetooth scan permissions result: ",
      await requestPermissions()
    );
    if (await requestPermissions()) {
      scanForDevices();
    }
  };

  const runOpenFile = async () => {
    openExternalFile();
  };

  React.useEffect(() => {
    // runBluetoothScan();
    runOpenFile();
  });

  return (
    <View style={styles.container}>
      <StatusBar />
      <AppBar />
      <BottomAppBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
