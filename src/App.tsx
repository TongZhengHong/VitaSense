import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import AppBar from './components/AppBar';
import BottomAppBar from './components/BottomNavBar';
import {openExternalFile} from './utils/FileUtils';

function App(): React.JSX.Element {
  const openFile = async () => {
    openExternalFile();
  };

  useEffect(() => {
    openFile();
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
