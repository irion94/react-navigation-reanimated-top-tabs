import {
  type SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';

export const useDerivedDirection = <T extends SharedValue<any>>(value: T) => {
  const result = useSharedValue(value.value);

  useAnimatedReaction(
    () => value.value,
    (current, previous) => {
      result.value = previous;

      if (current > (previous ?? 0)) {
        result.value = 1;
      } else if (current < (previous ?? 0)) {
        result.value = -1;
      } else {
        result.value = 0;
      }
    }
  );

  return result;
};
