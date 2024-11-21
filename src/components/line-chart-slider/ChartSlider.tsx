import {StyleSheet} from 'react-native';
import React from 'react';
import {RoundedRect} from '@shopify/react-native-skia';
import {CANVAS_HEIGHT, SLIDER_HEIGHT} from './LineChartSlider';
import {useTheme} from 'react-native-paper';

const BAR_HEIGHT = 4;

type ChartSliderProps = {
  xPos: number;
  width: number;
};

export default function ChartSlider(props: ChartSliderProps) {
  const theme = useTheme();
  return (
    <RoundedRect
      x={props.xPos}
      y={CANVAS_HEIGHT - SLIDER_HEIGHT / 2 - BAR_HEIGHT / 2}
      height={BAR_HEIGHT}
      width={props.width}
      r={BAR_HEIGHT / 2}
      color={'lightgrey'}
    />
  );
}

const styles = StyleSheet.create({});
