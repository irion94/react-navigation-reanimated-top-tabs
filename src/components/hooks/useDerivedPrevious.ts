import {
  type SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';

export const useDerivedPrevious = <T extends SharedValue<unknown>>(
  value: T
) => {
  const result = useSharedValue(value.value);

  useAnimatedReaction(
    () => value.value,
    (current, previous) => {
      result.value = previous;
    }
  );

  return result;
};
