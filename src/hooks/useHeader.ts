import { useTabContext } from './useTabContext';
import { withTiming } from 'react-native-reanimated';
import { HEADER_TIMING } from '../constants/animation';

export const useHeader = () => {
  const { currentYPosition, headerHeight, transformationY } = useTabContext();

  const hideHeader = () => {
    transformationY.value = withTiming(-headerHeight.value, HEADER_TIMING);
    currentYPosition.value = -headerHeight.value;
  };

  return { hideHeader };
};
