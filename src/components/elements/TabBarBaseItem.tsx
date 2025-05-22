import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTabContext } from '../../hooks/useTabContext';
import { type ReanimatedTabViewTypes } from '../ReanimatedTopTab/types';

interface TabBarBaseItemProps {
  index: number;
  inputRange: Array<number>;
  onPress: (index: number) => void;
  route: ReanimatedTabViewTypes.Route;
  style?: StyleProp<ViewStyle>;
}

export const TabBarBaseItem = ({
  index,
  inputRange,
  onPress,
  route,
  style,
}: TabBarBaseItemProps) => {
  const { positionX } = useTabContext();

  const activeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      positionX.value,
      inputRange,
      inputRange.map((i) => (i === index ? 1 : 0))
    ),
    position: 'absolute',
  }));

  const inactiveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      positionX.value,
      inputRange,
      inputRange.map((i) => (i === index ? 0 : 1))
    ),
  }));

  return (
    <Pressable onPress={() => onPress(index)} style={[styles.container, style]}>
      <Animated.View style={activeStyle}>
        {route.tabBarLabel ? (
          route.tabBarLabel(true)
        ) : (
          <Text>{route.title}</Text>
        )}
      </Animated.View>
      <Animated.View style={inactiveStyle}>
        {route.tabBarLabel ? (
          route.tabBarLabel(false)
        ) : (
          <Text>{route.title}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
});
