import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  readonly reverseString: (input: string) => string;

  readonly notchFilter: (signal: number[], fs: number, 
    notch_freq: number, bandwidth: number) => number[];

  readonly lowPassFilter: (signal: number[], fs: number, 
    lp_freq: number) => number[];

  readonly highPassFilter: (signal: number[], fs: number, 
    hp_freq: number) => number[];

  readonly testArray: (data: number[]) => number[];
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeFilterModule',
);