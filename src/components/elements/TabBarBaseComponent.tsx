import * as React from 'react';
import { StyleSheet } from 'react-native';
import Reanimated, {
  interpolate,
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
  style,
  navigate,
  screenOptions,
}: TabBarProps) => {
  const { topTabHeight, positionX } = useTabContext();
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
          translateX: interpolate(positionX.value, inputRange, outputRange),
        },
      ],
      width: width.value / navigationState.routes.length,
    };
  });

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
