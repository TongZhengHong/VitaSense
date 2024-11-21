import {StyleSheet} from 'react-native';
import React from 'react';
import {Canvas, Path, Skia} from '@shopify/react-native-skia';
import {curveBasis, line, scaleLinear} from 'd3';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import ChartSlider from './ChartSlider';

export const CANVAS_HEIGHT = 300;
export const SLIDER_HEIGHT = 75;
const SLIDER_PADDING = 20;

type LineChartSliderProps = {
  data: number[];
};

export default function LineChartSlider(props: LineChartSliderProps) {
  const theme = useTheme();
  const [width, setWidth] = React.useState(0);

  const minValue = Math.min(...props.data);
  const maxValue = Math.max(...props.data);

  const GRAPH_HEIGHT = CANVAS_HEIGHT - SLIDER_HEIGHT;
  const xFrom = [0, props.data.length - 1];
  const xTo = [0, width];
  const yFrom = [minValue, maxValue];
  const yTo = [GRAPH_HEIGHT, 0];

  const x = scaleLinear().domain(xFrom).range(xTo);
  const y = scaleLinear().domain(yFrom).range(yTo);

  const curvedLine =
    line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(curveBasis)(props.data) ?? '';

  const skiaGraph = Skia.Path.MakeFromSVGString(curvedLine) ?? Skia.Path.Make();

  return (
    <GestureHandlerRootView
      style={styles.container}
      onLayout={({nativeEvent}) => setWidth(nativeEvent.layout.width)}>
      <Canvas style={styles.canvas}>
        <Path
          style={'stroke'}
          path={skiaGraph}
          color={theme.colors.primary}
          strokeWidth={1}
        />
        <ChartSlider xPos={SLIDER_PADDING} width={width - 2 * SLIDER_PADDING} />
      </Canvas>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CANVAS_HEIGHT,
    width: '100%',
  },
  canvas: {
    height: '100%',
    width: '100%',
  },
});
