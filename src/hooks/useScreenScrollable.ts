import { useRoute } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabContext } from './useTabContext';
import * as React from 'react';
import { HeaderHeightContext } from '@react-navigation/elements';
import {
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

import { useScreenProperties } from './useScreenProperties';

export const useScreenScrollable = () => {
  const { key } = useRoute();
  const { height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const {
    currentYPosition,
    gestureEnabled,
    headerHeight,
    context,
    topTabHeight,
    transformationY,
  } = useTabContext();

  const screen = useScreenProperties();

  const navigationHeader = React.useContext(HeaderHeightContext) ?? top;

  const animatedProps = useAnimatedProps(() => ({
    scrollEnabled:
      !gestureEnabled.value || currentYPosition.value === -headerHeight.value,
  }));

  const onScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    const scrollPosition = context.screen.properties[key]?.scrollY;
    if (!scrollPosition)
      throw 'ScrollPosition property does not exist for this route';
    scrollPosition.value = contentOffset.y;
  });

  const oppositeHeaderState = useDerivedValue(() =>
    transformationY.value >= 0 ? headerHeight.value : 0
  );

  const difference = useDerivedValue(() =>
    Math.abs(screen.outerLayout.value.height - screen.innerLayout.value.height)
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
    style,
  };
};
