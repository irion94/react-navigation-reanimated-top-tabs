import { useTabContext } from './useTabContext';
import { withTiming } from 'react-native-reanimated';

export const useHeader = () => {
  const { headerHeight, transformationY } = useTabContext();

  const hideHeader = () => {
    transformationY.value = withTiming(-headerHeight.value);
  };

  return { hideHeader };
};
