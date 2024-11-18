import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import AppBar from './components/AppBar';
import BottomAppBar from './components/BottomNavBar';
import {openExternalFile} from './utils/FileUtils';
import NativeFilterModule from '../specs/NativeFilterModule';

function App(): React.JSX.Element {
  const openFile = async () => {
    openExternalFile();
  };

  useEffect(() => {
    // openFile();
    const data = Array.from({ length: 100 }, () => Math.random() * 100);
    const array = NativeFilterModule.notchFilter(data, 1000.0, 50.0, 10.0);
    console.log(array);
  });

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />
      <BottomAppBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
