import { useMemo, useRef, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTabContext } from '../../hooks/Tab.hooks';

//TODO: types
export const GestureWrapper = ({ children }: any) => {
  const {
    currentScreenIndex,
    currentYPosition,
    gestureEnabled,
    headerHeight,
    screenProperties,
    transformationY,
    screenRefs,
  } = useTabContext();

  const movedY = useSharedValue(0);

  const gestureRef = useRef(Gesture.Pan());

  const withTimingConfig = {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  } as const;

  const [_gestureEnabled, setGestureEnabled] = useState(gestureEnabled.value);

  useAnimatedReaction(
    () => gestureEnabled.value,
    (nextValue) => {
      runOnJS(setGestureEnabled)(nextValue);
    },
    []
  );

  const _scrollTo = (index: number, value: number = 0) => {
    const { scrollTo } = Object.values(screenRefs.refs.current)[index]
      ?.current ?? { scrollTo: () => null };

    scrollTo({
      y: value,
      animated: false,
    });
  };

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-10, 10])
        .onTouchesMove(({ state }, stateManager) => {
          'worklet';
          const current = Object.values(screenProperties).map(
            ({ scrollY }) => scrollY
          )[currentScreenIndex.value];

          if ((current?.value ?? 0) > 0 && state !== 4 && state !== 3) {
            stateManager.fail();
          }
        })
        .onUpdate(({ translationY }) => {
          'worklet';
          if (translationY <= -headerHeight.value) {
            runOnJS(_scrollTo)(
              currentScreenIndex.value,
              Math.abs(translationY + headerHeight.value)
            );
          }

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
          ...Object.values(screenProperties).map(
            ({ nativeGesture }) => nativeGesture
          )
        )
        .withRef(gestureRef)
        .enabled(_gestureEnabled),
    [_gestureEnabled]
  );

  const style = useAnimatedStyle(
    () => ({
      flex: 1,
      transform: [
        {
          translateY: interpolate(
            transformationY.value,
            [0, -headerHeight.value],
            [0, -headerHeight.value],
            'clamp'
          ),
        },
      ],
    }),
    []
  );

  return (
    <GestureDetector gesture={gesture}>
      <Reanimated.View style={style}>{children}</Reanimated.View>
    </GestureDetector>
  );
};
