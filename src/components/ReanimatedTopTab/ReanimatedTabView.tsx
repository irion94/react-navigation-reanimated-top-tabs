import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  interpolate,
  runOnJS,
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
    const routesCount = navigationState.routes.length;
    // Worklets may only capture serializable values: keep a primitive-only
    // snapshot of the navigation state instead of the route objects.
    const pagerState = useSharedValue<ReanimatedTabViewTypes.PagerState>({
      index: navigationState.index,
      routesCount,
    });
    const scrollPosition = useSharedValue(navigationState.index);
    const { positionX } = useTabContext();

    useEffect(() => {
      pagerState.value = { index: navigationState.index, routesCount };
    }, [navigationState.index, routesCount]);

    const { inputRange, outputRange } = useMemo(() => {
      const indices = Array.from({ length: routesCount }, (_, i) => i);
      return {
        inputRange: indices.map((i) => i * -width).reverse(),
        outputRange: indices.slice().reverse(),
      };
    }, [routesCount, width]);

    useAnimatedReaction(
      () => scrollPosition.value,
      (value) => {
        positionX.value = interpolate(value, inputRange, outputRange, 'clamp');
      }
    );

    const _navigate = (index: number) => {
      scrollPosition.value = AnimationHelper.animation(-index * width, () =>
        navigate(index)
      );
    };

    const minimumValueToChangeView = useMemo(
      () => width * percentageTrigger,
      [percentageTrigger, width]
    );

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
              pagerState.value
            );
          })
          .onEnd((event) => {
            'worklet';
            const state = AnimationHelper.onEnd(
              event,
              minimumValueToChangeView,
              width,
              pagerState.value
            );
            runOnJS(_navigate)(state.index);
          }),
      [minimumValueToChangeView, width]
    );

    const maxOffset = -width * (routesCount - 1);
    const scrollPositionStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(
            scrollPosition.value,
            [maxOffset, 0],
            [maxOffset, 0],
            'clamp'
          ),
        },
      ],
    }));

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
            return chooseRender({ route });
          }
          const screen = loadedScreens.current.find(
            (loadedScreen) => loadedScreen?.key === route.key
          );
          if (screen !== undefined) {
            return chooseRender({ route });
          }
          if (navigationState.index === index) {
            loadedScreens.current.push(route);
            return chooseRender({ route });
          }
          return chooseRender({ route }, false);
        }),
      [navigationState.routes, navigationState.index, lazy, chooseRender]
    );

    return (
      <View style={defaultStyles.flex}>
        <Reanimated.View style={defaultStyles.flex}>
          {renderTabBar
            ? renderTabBar({
                navigationState,
                navigate: _navigate,
                screenOptions,
              })
            : null}
          <GestureDetector gesture={panGesture}>
            <Reanimated.View
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
      </View>
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
