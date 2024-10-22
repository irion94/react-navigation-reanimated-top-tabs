import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { type ReanimatedTopTabNavigation } from '../types';

const useResetApproachingScreenScrollOffset = ({
  screenRefs,
  transformationX,
  screenProperties,
  currentYPosition,
}: Pick<
  ReanimatedTopTabNavigation.ContextType,
  'screenRefs' | 'screenProperties' | 'currentYPosition' | 'transformationX'
>) => {
  const resetApproachingScreenOffset = (
    index: number,
    shouldReset: boolean
  ) => {
    if (shouldReset) {
      //NOTE: use reanimated scrollTo does not work
      const { scrollTo } = Object.values(screenRefs.refs.current)[index]
        ?.current ?? { scrollTo: () => null };

      scrollTo({ y: 0, animated: false });
    }
  };

  useAnimatedReaction(
    () => transformationX.value,
    (current, previous) => {
      const approachingIndex = getTargetIndex(current, previous);

      const approachingScreenOffset =
        Object.values(screenProperties).map(({ scrollY }) => scrollY.value)[
          approachingIndex
        ] ?? -1;

      runOnJS(resetApproachingScreenOffset)(
        approachingIndex,
        approachingScreenOffset > 0 && currentYPosition.value === 0
      );
    }
  );
};

const getTargetIndex = (currentValue: number, previousValue: number | null) => {
  'worklet';
  if (currentValue > (previousValue ?? 0)) {
    return Math.ceil(currentValue);
  } else {
    return Math.floor(currentValue);
  }
};

export const TabContextHooks = {
  useResetApproachingScreenScrollOffset,
};
