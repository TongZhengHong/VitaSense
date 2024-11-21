import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import AppBar from './components/AppBar';
import BottomAppBar from './components/BottomNavBar';

function App(): React.JSX.Element {
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
