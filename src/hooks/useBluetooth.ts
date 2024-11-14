import React from "react";
import { platformApiLevel } from "expo-device";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";
import base64 from "react-native-base64";
import { Buffer } from "buffer";

const DEVICE_NAME = "DLG-PRPH";
//9D9CAF86-67BA-4C57-8D9B-66DF387ACC4D
const SERVICE_UUID = "18424398-7cbc-11e9-8f9e-2a86e4085a59";
const CHARACTERISTIC_UUID = "5A87B4EF-3BFA-76A8-E642-92933C31434F";
//00002A29-0000-1000-8000-00805f9b34fb

type BluetoothAPI = {
  requestPermissions: () => Promise<boolean>;
  scanForDevices: () => void;
  devices: Device[];
  connectToDevice: (d: Device) => Promise<void>;
  connectedDevice: Device | null;
  disconnectDevice: () => void;
};

const requestPermissions = async (): Promise<boolean> => {
  // Permissions immediately gets requested at start of app
  if (Platform.OS == "ios") return true;

  // Platform OS ANDROID
  if ((platformApiLevel ?? -1) < 31) {
    const belowAndroid31 = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Bluetooth Scan Permission",
        message: "VitaSense requires fine location access",
        buttonPositive: "Ok",
      }
    );
    return belowAndroid31 == "granted";
  }

  // Android API level >= 31
  const bluetoothScanPermission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    {
      title: "Bluetooth Scan Permission",
      message: "VitaSense requires bluetooth scanning",
      buttonPositive: "Ok",
    }
  );
  const bluetoothConnectPermission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    {
      title: "Bluetooth Scan Permission",
      message: "VitaSense requires to connect to bluetooth",
      buttonPositive: "Ok",
    }
  );
  const accessFineLocationPermission = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: "Bluetooth Scan Permission",
      message: "VitaSense requires fine location access",
      buttonPositive: "Ok",
    }
  );

  return (
    bluetoothScanPermission == "granted" &&
    bluetoothConnectPermission == "granted" &&
    accessFineLocationPermission == "granted"
  );
};

const isDuplicatedDevice = (devices: Device[], nextDevice: Device) =>
  devices.findIndex((device) => nextDevice.id === device.id) > -1;

const useBluetooth = (): BluetoothAPI => {
  const bleManager = React.useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = React.useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = React.useState<Device | null>(
    null
  );
  const deviceList: Device[] = [];

  const scanForDevices = () => {
    bleManager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.log(error.message);
          return;
        }

        // Ignore if device is null
        if (!device || device.name === null) return;

        if (!isDuplicatedDevice(deviceList, device)) {
          deviceList.push(device);
          console.log(device.id, device.name, device.serviceUUIDs);
        }

        if (device.name === DEVICE_NAME) {
          console.log("DEVICE FOUND!", device.id, device.serviceUUIDs);
          bleManager.stopDeviceScan();
          connectToDevice(device);
        }
      }
    );
  };

  const connectToDevice = async (device: Device) => {
    try {
      const connectedDevice = await device.connect();
      // setConnectedDevice(connectedDevice);

      const populatedDevice =
        await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log("Successfully connected to:", populatedDevice.name);

      const characteristics = await populatedDevice.characteristicsForService(
        SERVICE_UUID
      );
      characteristics.forEach((item) =>
        console.log(
          item.uuid,
          "|",
          item.isWritableWithResponse,
          "|",
          item.isWritableWithoutResponse
        )
      );

      const writeValue = 1;
      // Encode 8-bit value to hex, different from 16-bit values!
      const hexString = Buffer.from([writeValue]).toString("hex");
      const writeValueBase64 = Buffer.from(hexString, "hex").toString("base64");

      device
        .writeCharacteristicWithoutResponseForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          writeValueBase64
        )
        .then(() => {
          console.log(
            "Write characteristic success",
            writeValueBase64,
            writeValue
          );
        })
        .catch((error) => {
          console.error("Write characteristic error:", error);
        });

      await device.cancelConnection();
      // startStreamingData(populatedDevice);
    } catch (error) {
      console.log("Error connecting to:", device.id, error);
    }
  };

  const onReceiveData = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    console.log("RECEIVE BLUETOOTH DATA");
    if (error) {
      console.log("Receive error:", error);
      return;
    }

    if (!characteristic?.value) {
      console.log("No data received!");
      return;
    }

    const rawData = characteristic.value;
    console.log(rawData);
    // const rawData = base64.decode(characteristic.value);
    // Do some bit shifting here to decode value further
    //TODO: Set data to rawData!!!
    //TODO: Expose data to the hook
  };

  const startStreamingData = async (device: Device) => {
    if (!device) {
      console.log("No device connected");
      return;
    }

    device.writeCharacteristicWithoutResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      base64.encode("1")
    );

    device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      onReceiveData
    );
  };

  const disconnectDevice = () => {
    if (!connectedDevice) return;

    bleManager.cancelDeviceConnection(connectedDevice.id);
    setConnectedDevice(null);
    //TODO: Set data back to 0/null !!!
  };

  return {
    requestPermissions: requestPermissions,
    scanForDevices: scanForDevices,
    devices: allDevices,
    connectToDevice: connectToDevice,
    connectedDevice: connectedDevice,
    disconnectDevice: disconnectDevice,
  };
};

export default useBluetooth;
