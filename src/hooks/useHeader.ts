import { useTabContext } from './useTabContext';
import {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export const useHeader = () => {
  const { headerHeight, transformationX, transformationY } = useTabContext();

  const hideHeader = () => {
    transformationX.value = withTiming(-headerHeight.value);
  };

  const defaultStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          transformationY.value,
          [0, -headerHeight.value],
          [0, -headerHeight.value],
          'clamp'
        ),
      },
    ],
    zIndex: -1,
  }));

  return { hideHeader, defaultStyle };
};
