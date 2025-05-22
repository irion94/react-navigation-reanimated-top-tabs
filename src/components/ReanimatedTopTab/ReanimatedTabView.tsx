import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Reanimated, {
  interpolate,
  LinearTransition,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { ReanimatedTopTabNavigation } from 'react-navigation-reanimated-top-tabs';
import { useTabContext } from '../../hooks/useTabContext';
import { AnimationHelper } from './AnimationHelper';
import type { ReanimatedTabViewTypes } from './types';

export interface ReanimatedTabViewProps {
  LazyPlaceholder?: () => React.ReactNode;
  lazy?: boolean;
  navigationState: ReanimatedTabViewTypes.NavigationState;
  percentageTrigger?: number;
  renderScene: (params: ReanimatedTabViewTypes.SceneProps) => React.ReactNode;
  renderTabBar?: (
    params: ReanimatedTabViewTypes.RenderTabsParams
  ) => React.ReactNode;
  navigate(index: number): void;
  screenOptions?: ReanimatedTopTabNavigation.NavigationOptions;
}

export const ReanimatedTabView = React.memo<ReanimatedTabViewProps>(
  ({
    LazyPlaceholder = () => null,
    lazy = false,
    navigationState,
    percentageTrigger = 0.4,
    renderScene,
    renderTabBar,
    navigate,
    screenOptions,
  }) => {
    const { width } = useWindowDimensions();
    const loadedScreens = useRef([
      navigationState.routes[navigationState.index],
    ]);
    const scrollPosition = useSharedValue(navigationState.index);
    const { positionX } = useTabContext();

    useAnimatedReaction(
      () => scrollPosition.value,
      (value) => {
        positionX.value = interpolate(
          value,
          navigationState.routes.map((_, i) => i * -width),
          navigationState.routes.map((_, i) => i),
          'clamp'
        );
      }
    );

    const _navigate = (index: number) => {
      scrollPosition.value = AnimationHelper.animation(-index * width);
      navigate(index);
    };

    const minimumValueToChangeView = useMemo(
      () => width * percentageTrigger,
      [percentageTrigger, width]
    );

    const _navigationState = useSharedValue({ size: 0, index: 0 });

    useEffect(() => {
      runOnUI(() => {
        _navigationState.value.size = navigationState.routes.length;
        _navigationState.value.index = navigationState.index;
      })();
    }, [navigationState]);

    const panGesture = React.useMemo(
      () =>
        Gesture.Pan()
          .failOffsetY([-10, 10])
          .activeOffsetX([-20, 20])
          .onChange((event) => {
            'worklet';
            scrollPosition.value = AnimationHelper.onChange(
              event,
              scrollPosition.value,
              width,
              _navigationState.value
            );
          })
          .onEnd((event) => {
            'worklet';
            const state = AnimationHelper.onEnd(
              event,
              minimumValueToChangeView,
              width,
              _navigationState.value
            );
            scrollPosition.value = AnimationHelper.animation(state.value);
            _navigationState.value.index = state.index;
            runOnJS(navigate)(state.index);
          }),
      [minimumValueToChangeView, width]
    );

    const scrollPositionStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(
            scrollPosition.value,
            [-width * (navigationState.routes.length - 1), 0],
            [-width * (navigationState.routes.length - 1), 0],
            'clamp'
          ),
        },
      ],
    }));

    const jumpTo = React.useCallback(
      (key: string) => {
        const newIndex = navigationState.routes.findIndex(
          (route) => route.key === key
        );
        if (newIndex === -1) {
          return;
        }
        scrollPosition.value = AnimationHelper.animation(-newIndex * width);
      },
      [navigationState.routes, width]
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
        <Reanimated.View layout={LinearTransition} style={defaultStyles.flex}>
          {renderTabBar
            ? renderTabBar({
                navigationState,
                navigate: _navigate,
                screenOptions,
              })
            : null}
          <GestureDetector gesture={panGesture}>
            <Reanimated.View
              layout={LinearTransition}
              style={[
                scrollPositionStyle,
                defaultStyles.flex,
                { width: width * navigationState.routes.length - 1 },
                defaultStyles.viewsContainer,
              ]}
            >
              {Routes}
            </Reanimated.View>
          </GestureDetector>
        </Reanimated.View>
      </GestureHandlerRootView>
    );
  }
);

const defaultStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  viewsContainer: {
    flexDirection: 'row',
  },
});
