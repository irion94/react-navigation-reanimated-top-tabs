import React, { useMemo, useRef, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTabContext } from '../../hooks/useTabContext';
import { Platform, StyleSheet, View } from 'react-native';

interface GestureWrapperProps {
  children: React.ReactNode;
  bounces?: boolean;
}

export const GestureWrapper = ({ children, bounces }: GestureWrapperProps) => {
  const _bounces = Platform.select({
    ios: bounces,
    default: false,
  });

  const {
    context,
    currentScreenIndex,
    currentYPosition,
    gestureEnabled,
    headerHeight,
    transformationY,
    scrollY,
  } = useTabContext();

  const movedY = useSharedValue(0);

  const gestureRef = useRef(Gesture.Pan());

  const currentScreenScrollOffset = useDerivedValue(
    () =>
      Object.values(context.screen.properties).map(({ scrollY }) => scrollY)[
        currentScreenIndex.value
      ]?.value ?? 0
  );

  const withTimingConfig = {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  } as const;

  const [_gestureEnabled, setGestureEnabled] = useState(true);

  useAnimatedReaction(
    () => gestureEnabled.value,
    (next, prev) => {
      if (next === prev) return;
      runOnJS(setGestureEnabled)(next);
    },
    []
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-10, 10])
        .onTouchesMove((_, stateManager) => {
          'worklet';
          if (currentScreenScrollOffset.value > 0 || !gestureEnabled.value) {
            stateManager.fail();
          }
        })
        .onUpdate(({ translationY }) => {
          'worklet';
          transformationY.value =
            currentYPosition.value + translationY - movedY.value;
        })
        .onEnd(({ translationY, velocityY }) => {
          'worklet';
          const gestureValue = translationY + velocityY * 0.2;
          const changeOffset = 0.2 * headerHeight.value;

          if (gestureValue < -changeOffset && transformationY.value < 0) {
            transformationY.value = withTiming(
              -headerHeight.value,
              withTimingConfig
            );
            currentYPosition.value = -headerHeight.value;
          } else if (gestureValue > changeOffset) {
            const destination = 0;
            transformationY.value = withTiming(destination, withTimingConfig);
            currentYPosition.value = destination;
          } else {
            transformationY.value = withTiming(
              currentYPosition.value,
              withTimingConfig
            );
          }
        })
        .onFinalize(() => {
          'worklet';
          movedY.value = 0;
        })
        .simultaneousWithExternalGesture(
          ...Object.values(context.screen.properties).map(
            ({ nativeGesture }) => nativeGesture
          )
        )
        .withRef(gestureRef)
        .enabled(_gestureEnabled),
    [_gestureEnabled]
  );

  useAnimatedReaction(
    () => {
      if (transformationY.value > 0) {
        if (_bounces) return transformationY.value * -0.3;
        else return 0;
      }
      if (transformationY.value < -headerHeight.value) {
        return headerHeight.value;
      }

      return -transformationY.value;
    },
    (value) => {
      scrollY.value = value;
    }
  );

  const style = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [
        {
          translateY: scrollY.value * -1,
        },
      ],
    };
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Reanimated.View style={style}>{children}</Reanimated.View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },
});
