// returns read-only property
import { useTabContext } from './useTabContext';
import { useDerivedValue } from 'react-native-reanimated';

export const useTabOffset = () => {
  const { transformationX } = useTabContext();
  return useDerivedValue(() => transformationX.value);
};
