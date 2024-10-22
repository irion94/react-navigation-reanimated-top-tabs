import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { withTiming as reanimatedWithTiming } from 'react-native-reanimated';
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
  if (type === 'increment') {
    return navigationState.index === navigationState.routes.length - 1
      ? navigationState.index
      : navigationState.index + 1;
  }
  return navigationState.index === 0
    ? navigationState.index
    : navigationState.index - 1;
};

const onEnd = (
  event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  minimumValueToChangeView: number,
  width: number,
  navigationState: ReanimatedTabViewTypes.NavigationState
) => {
  'worklet';
  if (event.velocityX < -200) {
    return {
      index: getIndex(navigationState, 'increment'),
      value: -width * (navigationState.index + 1),
    };
  }
  if (event.velocityX > 200) {
    return {
      index: getIndex(navigationState, 'decrement'),
      value: -width * (navigationState.index - 1),
    };
  }
  if (event.translationX < 0) {
    if (event.translationX < -minimumValueToChangeView) {
      return {
        index: getIndex(navigationState, 'increment'),
        value: -width * (navigationState.index + 1),
      };
    }
  }
  if (event.translationX > 0) {
    if (event.translationX > minimumValueToChangeView) {
      return {
        index: getIndex(navigationState, 'decrement'),
        value: -width * (navigationState.index - 1),
      };
    }
  }
  return {
    index: navigationState.index,
    value: -width * navigationState.index,
  };
};

const animation = (newValue: number, duration = 200) => {
  'worklet';
  return reanimatedWithTiming(newValue, { duration });
};

export const AnimationHelper = {
  animation,
  onChange,
  onEnd,
};
