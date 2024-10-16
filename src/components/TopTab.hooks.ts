import { useRoute } from '@react-navigation/native';
import { Context } from './TopTabContext';
import { useContext } from 'react';
import {
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';

export const useTabContext = () => useContext(Context);

export const useScreenGesture = () => {
  const { key } = useRoute();
  const { screenProperties } = useTabContext();

  const nativeRef = screenProperties[key]?.nativeGesture;

  if (!nativeRef) throw 'GestureRef does not exist for this route';

  return nativeRef;
};

export const useScreenScrollable = () => {
  const { key } = useRoute();
  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const {
    currentYPosition,
    gestureEnabled,
    headerHeight,
    screenProperties,
    topTabHeight,
    transformationY,
  } = useTabContext();

  //useHeaderHeight();
  const navigationHeader = 50;

  const animatedProps = useAnimatedProps(() => ({
    scrollEnabled:
      !gestureEnabled.value || currentYPosition.value === -headerHeight.value,
  }));

  const onScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    const scrollPosition = screenProperties[key]?.scrollY;
    if (!scrollPosition)
      throw 'ScrollPosition property does not exist for this route';
    scrollPosition.value = contentOffset.y;
  });

  const oppositeHeaderState = useDerivedValue(() =>
    transformationY.value >= 0 ? headerHeight.value : 0
  );

  const style = useAnimatedStyle(() => ({
    minHeight:
      height -
      topTabHeight.value -
      oppositeHeaderState.value -
      navigationHeader,
  }));

  return {
    animatedProps,
    bounces: false,
    contentContainerStyle: { paddingBottom: bottom },
    onScroll,
    style,
  };
};

export const useScreenProperties = () => {
  const { key } = useRoute();
  const { screenProperties } = useTabContext();
  const screen = screenProperties[key];
  if (!screen) throw 'No screen properties registered for this route';

  return screen;
};

export const useHeader = () => {
  const { headerHeight, transformationX } = useTabContext();

  const hideHeader = () => {
    transformationX.value = withTiming(-headerHeight.value);
  };

  return { hideHeader };
};
