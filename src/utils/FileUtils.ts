// import { Platform } from "react-native";
// import * as FileSystem from "expo-file-system";
// import * as DocumentPicker from "expo-document-picker";
// const { StorageAccessFramework } = FileSystem;

// const fileDir = FileSystem.cacheDirectory + "data/";
// const fileUri = (fileName: string) => fileDir + `${fileName}.txt`;

// /**
//  * Checks if gif directory exists. If not, creates the directory.
//  */
// async function ensureDirExists() {
//   const dirInfo = await FileSystem.getInfoAsync(fileDir);

//   if (!dirInfo.exists) {
//     console.log("VitaSense directory doesn't exist, creating…");
//     await FileSystem.makeDirectoryAsync(fileDir, { intermediates: true });

//     // This call allows android to link SAF URI to Expo FileSystem
//     if (Platform.OS == "android")
//       StorageAccessFramework.getUriForDirectoryInRoot("VitaSense");
//   }
// }

// /**
//  * Returns the text contents at the specified file.
//  *
//  * If file cannot be found, create new empty file and return empty string.
//  * @param fileName
//  * @returns
//  */
// export async function readFile(fileName: string): Promise<string> {
//   await ensureDirExists();

//   console.log(fileUri(fileName));

//   const fileInfo = await FileSystem.getInfoAsync(fileUri(fileName));
//   if (!fileInfo.exists) {
//     // File does not exist, create new empty file
//     await saveFile(fileName, "");
//     return "";
//   }

//   const text = await FileSystem.readAsStringAsync(fileUri(fileName));
//   return text;
// }

// /**
//  * Saves string content to specified file name.
//  * @param fileName
//  * @param content
//  */
// export async function saveFile(fileName: string, content: string) {
//   try {
//     await FileSystem.writeAsStringAsync(fileUri(fileName), content);
//     console.log("Saved:", fileName);
//   } catch (e) {
//     console.error("Couldn't save string:", fileName, e);
//   }
// }

// export async function openExternalFile() {
//   try {
//     const { assets, canceled } = await DocumentPicker.getDocumentAsync({
//       type: ["text/csv"],
//     });
//     if (canceled) {
//       console.log("Pick operation cancelled by user");
//       return "";
//     }
//     const { name, uri } = assets[0];
//     console.log(name, uri);
//     const content = await FileSystem.readAsStringAsync(uri);
//     console.log(content)
//   } catch (error) {}
// }

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

export async function openExternalFile() {
  try {
    const pickedFile = await DocumentPicker.pickSingle({
      type: DocumentPicker.types.csv,
      copyTo: 'documentDirectory',
    });
    console.log('pickedFile', pickedFile);

    await RNFS.readFile(pickedFile.uri).then(data => {
      console.log(data);
    });
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      console.log(error);
    } else {
      console.log(error);
      throw error;
    }
  }
}
