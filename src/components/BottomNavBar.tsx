import * as React from 'react';
import {BottomNavigation, Text} from 'react-native-paper';
import SummaryScreen from '../screens/SummaryScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ListenScreen from '../screens/ListenScreen';
import LoadDataScreen from '../screens/LoadDataScreen';

const HomeRoute = () => <SummaryScreen />;

const ListenRoute = () => <ListenScreen />;

const LoadDataRoute = () => <LoadDataScreen />;

const HistoryRoute = () => <HistoryScreen />;


const BottomAppBar = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Summary',
      focusedIcon: 'heart',
      unfocusedIcon: 'heart-outline',
    },
    {
      key: 'listen',
      title: 'Listen',
      focusedIcon: 'clipboard-pulse',
      unfocusedIcon: 'clipboard-pulse-outline',
    },
    {
      key: 'loadData',
      title: 'Load',
      focusedIcon: 'file-upload',
      unfocusedIcon: 'file-upload-outline',
    },
    {key: 'history', title: 'History', focusedIcon: 'history'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    listen: ListenRoute,
    history: HistoryRoute,
    loadData: LoadDataRoute,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default BottomAppBar;
