import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabContext } from './useTabContext';
import * as React from 'react';
import { HeaderHeightContext } from '@react-navigation/elements';
import {
  clamp,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

import { useScreenProperties } from './useScreenProperties';
import { useScreenDimensions } from './useScreenDimensions';

export const useScreenScrollable = () => {
  const { key } = useRoute();
  const { height } = useScreenDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const {
    currentYPosition,
    gestureEnabled,
    headerHeight,
    context,
    topTabHeight,
    transformationY,
    isHeaderHeightSet,
  } = useTabContext();

  const screen = useScreenProperties();

  const navigationHeader = React.useContext(HeaderHeightContext) ?? top;

  const animatedProps = useAnimatedProps(() => ({
    scrollEnabled:
      isHeaderHeightSet.value &&
      (!gestureEnabled.value || currentYPosition.value === -headerHeight.value),
  }));

  const routeScrollY = context.screen.properties[key]?.scrollY;
  const onScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    const scrollPosition = routeScrollY;
    if (!scrollPosition)
      throw 'ScrollPosition property does not exist for this route';
    scrollPosition.value = contentOffset.y;
  });

  const oppositeHeaderState = useDerivedValue(() =>
    transformationY.value >= 0 ? headerHeight.value : 0
  );

  const { innerLayout, outerLayout } = screen;
  const difference = useDerivedValue(() =>
    clamp(outerLayout.value.height - innerLayout.value.height, 0, Infinity)
  );

  const style = useAnimatedStyle(() => ({
    minHeight:
      height -
      topTabHeight.value -
      oppositeHeaderState.value -
      navigationHeader -
      difference.value,
  }));

  return {
    animatedProps,
    bounces: false,
    contentContainerStyle: { paddingBottom: bottom },
    onScroll,
    overScrollMode: 'never' as const,
    style,
  };
};
