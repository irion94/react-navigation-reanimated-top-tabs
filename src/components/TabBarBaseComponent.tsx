import * as React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Reanimated, {
  type AnimatedStyle,
  interpolate,
  type SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { useTabContext } from './TopTab.hooks';

export interface Route {
  key: string;
  name?: string;
  tabBarLabel?: () => React.ReactNode;
  title?: string;
}

export type NavigationState = { index: number; routes: Route[] };

export interface RenderTabsParams {
  navigationState: NavigationState;
  position: SharedValue<number>;
}

interface TabBarProps extends RenderTabsParams {
  children?: React.ReactNode;
  navigate: (route: Route) => void;
  style?: AnimatedStyle;
}

export const TabBarBaseComponent = ({
  children,
  navigate,
  navigationState,
  position,
  style,
}: TabBarProps) => {
  const layout = useWindowDimensions();

  const { topTabHeight, transformationX } = useTabContext();

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
      <Reanimated.View style={[styles.wrapper, style]}>
        {navigationState.routes.map((route) => (
          <Pressable
            style={styles.labelWrapper}
            key={route.key}
            onPress={() => {
              navigate(route);
            }}
          >
            {route.tabBarLabel ? (
              route.tabBarLabel()
            ) : (
              <Text>{route.title}</Text>
            )}
          </Pressable>
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
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    height: 50,
  },
});
