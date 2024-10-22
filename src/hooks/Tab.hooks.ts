import { useRoute } from '@react-navigation/native';
import { Context } from '../context/TabContext';
import { useContext } from 'react';
import {
  interpolate,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import * as React from 'react';
import { HeaderHeightContext } from '@react-navigation/elements';

export const useTabContext = () => {
  if (__DEV__) {
    const stack = new Error().stack;
    const isOutsideLibrary =
      stack && !stack.includes('react-navigation-reanimated-top-tabs');

    if (isOutsideLibrary) {
      console.warn(
        '[react-navigation-reanimated-top-tabs]: You are directly using the tab context, which may lead to unexpected behavior. Please use the provided hooks or API for better stability.'
      );
    }
  }
  return useContext(Context);
};

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
  const { bottom, top } = useSafeAreaInsets();
  const {
    currentYPosition,
    gestureEnabled,
    headerHeight,
    screenProperties,
    topTabHeight,
    transformationY,
  } = useTabContext();

  const navigationHeader = React.useContext(HeaderHeightContext) ?? 0;

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
      top -
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
  const { headerHeight, transformationX, transformationY } = useTabContext();

  const hideHeader = () => {
    transformationX.value = withTiming(-headerHeight.value);
  };

  const defaultStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          transformationY.value,
          [0, -headerHeight.value],
          [0, -headerHeight.value],
          'clamp'
        ),
      },
    ],
    zIndex: -1,
  }));

  return { hideHeader, defaultStyle };
};

//TODO: make it private
export const useScreenRefs = (keys: string[]) => {
  const refs = {
    current: keys.reduce(
      (prev, key) => ({
        ...prev,
        [key]: { current: null },
      }),
      {} as Record<string, { current: any }>
    ),
  };

  const setRef = (key: string, ref: any) => {
    refs.current = { ...refs.current, [key]: ref };
  };

  return { setRef, refs };
};
