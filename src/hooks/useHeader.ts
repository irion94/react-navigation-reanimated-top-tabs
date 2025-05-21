import { useTabContext } from './useTabContext';
import { withTiming } from 'react-native-reanimated';

export const useHeader = () => {
  const { headerHeight, transformationX } = useTabContext();

  const hideHeader = () => {
    transformationX.value = withTiming(-headerHeight.value);
  };

  return { hideHeader };
};
