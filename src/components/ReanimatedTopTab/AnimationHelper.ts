import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { runOnJS, withTiming } from 'react-native-reanimated';
import type { ReanimatedTabViewTypes } from './types';

const onChange = (
  event: GestureUpdateEvent<
    PanGestureHandlerEventPayload & PanGestureChangeEventPayload
  >,
  animationValue: number,
  width: number,
  navigationState: ReanimatedTabViewTypes.NavigationState
) => {
  'worklet';
  if (animationValue > 0) {
    return 0;
  }
  const routesLength = navigationState.routes.length - 1;
  if (animationValue < -width * routesLength) {
    return -width * routesLength;
  }
  return animationValue + event.changeX;
};

const getIndex = (
  navigationState: ReanimatedTabViewTypes.NavigationState,
  type: 'increment' | 'decrement'
) => {
  'worklet';
  const max = navigationState.routes.length - 1;
  const current = navigationState.index;

  if (type === 'increment' && current < max) {
    return current + 1;
  }

  if (type === 'decrement' && current > 0) {
    return current - 1;
  }

  return current;
};

const onEnd = (
  event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  minimumValueToChangeView: number,
  width: number,
  navigationState: ReanimatedTabViewTypes.NavigationState
) => {
  'worklet';
  const { velocityX, translationX } = event;

  if (velocityX < -200 || translationX < -minimumValueToChangeView) {
    const newIndex = getIndex(navigationState, 'increment');
    return {
      index: newIndex,
      value: -width * newIndex,
    };
  }
  if (velocityX > 200 || translationX > minimumValueToChangeView) {
    const newIndex = getIndex(navigationState, 'decrement');
    return {
      index: newIndex,
      value: -width * newIndex,
    };
  }
  return {
    index: navigationState.index,
    value: -width * navigationState.index,
  };
};

const animation = (newValue: number, onFinished?: () => void) => {
  'worklet';
  return withTiming(newValue, { duration: 350 }, (finished) => {
    if (finished && onFinished) runOnJS(onFinished)();
  });
};

export const AnimationHelper = {
  animation,
  onChange,
  onEnd,
};
