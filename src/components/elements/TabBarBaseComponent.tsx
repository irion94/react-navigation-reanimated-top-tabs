import * as React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Reanimated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  type AnimatedStyle,
} from 'react-native-reanimated';

import { useTabContext } from '../../hooks/useTabContext';
import { type ReanimatedTabViewTypes } from '../ReanimatedTopTab/types';
import { TabBarBaseItem } from './TabBarBaseItem';

export interface TabBarProps extends ReanimatedTabViewTypes.RenderTabsParams {
  children?: React.ReactNode;
  style?: AnimatedStyle;
}

export const TabBarBaseComponent = ({
  children,
  navigationState,
  position,
  style,
  navigate,
  screenOptions,
}: TabBarProps) => {
  const layout = useWindowDimensions();
  const { topTabHeight, transformationX } = useTabContext();
  const width = useSharedValue(0);

  const { tabBarIndicatorStyle, tabBarItemStyle, tabBarStyle } =
    screenOptions ?? {};

  const inputRange = navigationState.routes.map((_, index) => index);

  const indicatorStyle = useAnimatedStyle(() => {
    const outputRange = navigationState.routes.map(
      (_, index) => index * (width.value / navigationState.routes.length)
    );

    return {
      transform: [
        {
          translateX: interpolate(
            transformationX.value,
            inputRange,
            outputRange
          ),
        },
      ],
      width: width.value / navigationState.routes.length,
    };
  });

  //Assign interpolated offsetX to transformationX
  useAnimatedReaction(
    () =>
      interpolate(
        position.value,
        navigationState.routes.map((_, i) => i * layout.width),
        navigationState.routes.map((_, i) => i),
        'clamp'
      ),
    (value) => {
      transformationX.value = value;
    },
    [navigationState.routes]
  );

  return (
    <Reanimated.View
      onLayout={({ nativeEvent }) => {
        topTabHeight.value = nativeEvent.layout.height;
      }}
    >
      <Reanimated.View
        onLayout={({ nativeEvent }) => {
          width.value = nativeEvent.layout.width;
        }}
        style={[styles.wrapper, tabBarStyle, style]}
      >
        <Reanimated.View
          style={[styles.indicator, indicatorStyle, tabBarIndicatorStyle]}
        />
        {navigationState.routes.map((route, index) => (
          <TabBarBaseItem
            index={index}
            inputRange={inputRange}
            position={transformationX}
            key={route.key}
            onPress={() => {
              navigate(index);
            }}
            route={route}
            style={tabBarItemStyle}
          />
        ))}
      </Reanimated.View>
      {children}
    </Reanimated.View>
  );
};

// Static styles
const styles = StyleSheet.create({
  labelWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: 'black',
    bottom: 0,
    height: 2,
    position: 'absolute',
  },
});
