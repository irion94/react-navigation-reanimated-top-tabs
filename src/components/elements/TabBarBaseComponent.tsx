import * as React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Reanimated, {
  type AnimatedStyle,
  interpolate,
  useAnimatedReaction,
} from 'react-native-reanimated';

import { useTabContext } from '../../hooks/useTabContext';
import { type ReanimatedTabViewTypes } from '../ReanimatedTopTab/types';

export interface TabBarProps extends ReanimatedTabViewTypes.RenderTabsParams {
  children?: React.ReactNode;
  style?: AnimatedStyle;
}

export const TabBarBaseComponent = ({
  children,
  navigationState,
  position,
  style,
  onIndexChange,
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
        {navigationState.routes.map((route, index) => (
          <Pressable
            style={styles.labelWrapper}
            key={route.key}
            onPress={() => {
              onIndexChange(index);
            }}
          >
            {route.tabBarLabel ? (
              route.tabBarLabel()
            ) : (
              <Text style={styles.label}>{route.title}</Text>
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
  label: {
    color: 'red',
  },
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    height: 50,
  },
});
