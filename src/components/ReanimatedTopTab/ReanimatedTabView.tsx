import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { AnimationHelper } from './AnimationHelper';
import type { ReanimatedTabViewTypes } from './types';

export interface ReanimatedTabViewProps {
  LazyPlaceholder?: () => React.ReactNode;
  lazy?: boolean;
  navigationState: ReanimatedTabViewTypes.NavigationState;
  onIndexChange: (index: number) => void;
  percentageTrigger?: number;
  positionInterpolation?: ReanimatedTabViewTypes.PositionInterpolation;
  renderScene: (params: ReanimatedTabViewTypes.SceneProps) => React.ReactNode;
  renderTabBar?: (
    params: ReanimatedTabViewTypes.RenderTabsParams
  ) => React.ReactNode;
}

export const ReanimatedTabView = React.memo<ReanimatedTabViewProps>(
  ({
    LazyPlaceholder = () => null,
    lazy = false,
    navigationState,
    onIndexChange,
    percentageTrigger = 0.4,
    positionInterpolation,
    renderScene,
    renderTabBar,
  }) => {
    const { width } = useWindowDimensions();
    const loadedScreens = useRef([
      navigationState.routes[navigationState.index],
    ]);
    // const width = 160;
    const scrollPosition = useSharedValue(navigationState.index);

    const position = useDerivedValue(() => {
      if (!positionInterpolation) {
        return -scrollPosition.value;
      }
      return interpolate(
        -scrollPosition.value,
        positionInterpolation.input,
        positionInterpolation.output,
        Extrapolation.CLAMP
      );
    }, [positionInterpolation]);

    useEffect(() => {
      scrollPosition.value = AnimationHelper.animation(
        -navigationState.index * width
      );
    }, [navigationState.index, scrollPosition, width]);

    const minimumValueToChangeView = useMemo(
      () => width * percentageTrigger,
      [percentageTrigger, width]
    );

    const panGesture = React.useMemo(
      () =>
        Gesture.Pan()
          .failOffsetY(-10)
          .failOffsetY(10)
          .activeOffsetX([-20, 20])
          .onChange((event) => {
            scrollPosition.value = AnimationHelper.onChange(
              event,
              scrollPosition.value,
              width,
              navigationState
            );
          })
          .onEnd((event) => {
            const state = AnimationHelper.onEnd(
              event,
              minimumValueToChangeView,
              width,
              navigationState
            );
            scrollPosition.value = AnimationHelper.animation(state.value);
            runOnJS(onIndexChange)(state.index);
          }),
      [
        minimumValueToChangeView,
        navigationState,
        onIndexChange,
        scrollPosition,
        width,
      ]
    );

    const scrollPositionStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(
            scrollPosition.value,
            [-width * (navigationState.routes.length - 1), 0],
            [-width * (navigationState.routes.length - 1), 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    }));

    const jumpTo = React.useCallback(
      (key: string) => {
        const newIndex = navigationState.routes.findIndex((r) => r.key === key);
        if (newIndex === -1) {
          // throw
          return;
        }
        scrollPosition.value = AnimationHelper.animation(-newIndex * width);
        onIndexChange(newIndex);
      },
      [navigationState.routes, onIndexChange, scrollPosition, width]
    );

    const chooseRender = useCallback(
      (params: ReanimatedTabViewTypes.SceneProps, useRenderScene = true) => (
        <View key={`RNNTabView_${params.route.key}`} style={{ width }}>
          {useRenderScene ? renderScene(params) : LazyPlaceholder()}
        </View>
      ),
      [LazyPlaceholder, renderScene, width]
    );

    const Routes = useMemo(
      () =>
        navigationState.routes.map((route, index) => {
          if (!lazy) {
            return chooseRender({ jumpTo, route });
          }
          const screen = loadedScreens.current.find(
            (loadedScreen) => loadedScreen?.key === route.key
          );
          if (screen !== undefined) {
            return chooseRender({ jumpTo, route });
          }
          if (navigationState.index === index) {
            loadedScreens.current.push(route);
            return chooseRender({ jumpTo, route });
          }
          return chooseRender({ jumpTo, route }, false);
        }),
      [
        navigationState.routes,
        navigationState.index,
        lazy,
        chooseRender,
        jumpTo,
      ]
    );

    return (
      <GestureHandlerRootView style={defaultStyles.flex}>
        <Animated.View layout={LinearTransition} style={defaultStyles.flex}>
          {renderTabBar ? renderTabBar({ navigationState, position }) : null}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              layout={LinearTransition}
              style={[
                scrollPositionStyle,
                defaultStyles.flex,
                { width: width * navigationState.routes.length - 1 },
                defaultStyles.viewsContainer,
              ]}
            >
              {Routes}
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </GestureHandlerRootView>
    );
  }
);

//NOTE: purposely use of StyleSheet - simplify migration to library
const defaultStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  viewsContainer: {
    flexDirection: 'row',
  },
});