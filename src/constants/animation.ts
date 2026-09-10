import { Easing } from 'react-native-reanimated';

// Module-scope constant so worklets capture a plain object with a worklet
// easing function instead of a per-render object holding a class instance.
export const HEADER_TIMING = {
  duration: 300,
  easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
} as const;
