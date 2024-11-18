# VitaSense

## Health monitoring mobile application built with React Native

![Vitasense](images/overview.png)

This project is part of EG2605 Undergraduate Research Opportunities Programme (UROP) undertaken during Year 2 Semester 2.

Features:

- View live raw sound data from sensors via Bluetooth Low Energy (BLE)
- Display processed data
  - Heart Rate
  - Blood Pressure
  - Respiratory Rate
- Store and view historic data
  - Stored as ranges and averages over different intervals

More detailed information can be found in the [report](report.pdf). Link to initial Figma design can be found [here](https://www.figma.com/proto/rscaqvvfQG3oc2lAk9ymbp/UROP-Project?node-id=0-1&t=D2Rvm3p4Alzlo0zG-1).

> Note: This react native project has been recently migrated to a bare React Native CLI project due to the need for Turbo Modules to run C++ code (which Expo lacks support for). 

### Installation

Firstly, install the necessary packages to build the project using Yarn

```
yarn install
```

> Due to the need for the Apple Developer license to run on iOS, our primary target will be on **Android** devices for development. However, you can still run the application software on iOS devices. 

#### Android

Install `Android NDK` (version mentioned below) via Android Studio for Skia to build natively using C++. It can be found in this path: **Settings > Languages and Frameworks > Android SDK > SDK Tools (Tab)**.

Next, specify the Android SDK path. You can either add the `$ANDROID_HOME` environmental variable or create a file named `local.properties` in the `android` folder and adding the following entry:

```
// Windows
sdk.dir = C://Users//<USERNAME>//AppData//Local//Android//Sdk

// MacOS
sdk.dir = /Users/<USERNAME>/Library/Android/sdk
```

The following are the recomended software versions used for a successful build:

| Software | Version |
| -------- | -------- |
| Java | 17 |
| Android SDK | 35 |
| Android SDK build tools | 35 |
| Android NDK | 25.1.8937393 |

Lastly, to build and run the project, simply run:
```
yarn start
```

> If you run into an error that states: Cannot read property 'makeMutable' of undefined, perform `yarn start --reset-cache` instead.

## Features

### Summary overview

The summary page offers an overview of all the processed data obtained from the sensor. Currently, the application is able to show single value metrics (such as heart and respiratory rate) and double value metrics (like blood pressure).

![Summary](images/summary.png)

Implementing the line graphs was achieved using [Skia](https://skia.org/), a 2D graphics engine which can render animations on a separate UI thread, distinct from the main JavaScript thread. The D3 library was used to process the data into a format conducive to Skia operations.

### View live data

The listen page offers medical personnel a comprehensive view of raw sound data measured by the sensor, presented in a cardiogram format.

 <img src="images/live.png" alt="Live data" width="200px" />

In order to display incoming data at rate greater than the display refresh rate of 60 fps/hz, the function handling incoming values follows these steps:

1. Data received from Bluetooth is stored in an array buffer.
2. With each frame drawn approximately every 17 milliseconds (1/60 Hz), we calculate the number of pixels the pointer will cover in each frame rerender (17 ms).
3. In cases where the buffer contains multiple data points during a frame rerender, we evenly distribute the incoming data into groups. The number of groups corresponds to the number of pixels displayed in each rerender.
4. Subsequently, we compute the average value of each group and display the resulting value for each corresponding pixel.

### Historical data

This page functions as a repository for long-term data storage, drawing inspiration from Apple Health's interface. Data is presented using bars that represent the range of values observed during a specific interval.

 <img src="images/history.png" alt="Live data" width="800px" />

Data is stored in the device's internal storage. To facilitate file storage operations within the internal storage of the device, the Expo File System library is used.