import React from 'react';

import {StyleSheet, View} from 'react-native';
import {Card, Text, IconButton, ActivityIndicator} from 'react-native-paper';
import LineChartSlider, {
  CANVAS_HEIGHT,
} from '../line-chart-slider/LineChartSlider';
import {readFileFromUri} from '../../utils/FileUtils';
import NativeFilterModule from '../../../specs/NativeFilterModule';

const DATA_FREQ = 2000;
const LOW_PASS_FREQ = 120;
const HIGH_PASS_FREQ = 30;
const NOTCH_FREQ = 50;
const BANDWIDTH = 2;

type LoadFileCardProps = {
  uri: string;
  name: string;
  onClose: () => void;
};

export default function LoadFileCard(props: LoadFileCardProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<number[]>([]);

  const processData = async () => {
    const data = await readFileFromUri(props.uri);
    const voltageData = data.map(v => (v / 16384) * 3300); // 2^14 = 16384

    const highPass = NativeFilterModule.highPassFilter(
      voltageData,
      DATA_FREQ,
      HIGH_PASS_FREQ,
    );
    const bandPass = NativeFilterModule.lowPassFilter(
      highPass,
      DATA_FREQ,
      LOW_PASS_FREQ,
    );

    let notchFiltered = bandPass;
    for (let i = 1; i <= 15; i++) {
      notchFiltered = NativeFilterModule.notchFilter(
        notchFiltered,
        DATA_FREQ,
        NOTCH_FREQ * i,
        BANDWIDTH,
      );
    }

    setIsLoading(false);
    setData(notchFiltered);
  };

  React.useEffect(() => {
    processData();
  }, []);

  return (
    <Card style={styles.container}>
      <Card.Title
        style={styles.titleContainer}
        title={
          <Text variant="bodyLarge" style={{fontWeight: 'bold'}}>
            {props.name}
          </Text>
        }
        right={p => (
          <IconButton {...p} icon="close" size={20} onPress={props.onClose} />
        )}
      />
      <View style={styles.contentContainer}>
        {isLoading ? <ActivityIndicator /> : <LineChartSlider data={data} />}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16, // Spacing between each card and load button
  },
  titleContainer: {
    paddingHorizontal: 4,
  },
  contentContainer: {
    width: '100%',
    height: CANVAS_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
