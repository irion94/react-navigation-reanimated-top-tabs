import { type ReanimatedTopTabNavigation } from './types';
import { createContext, memo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  interpolate,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

export const Context = createContext<ReanimatedTopTabNavigation.ContextType>(
  {} as ReanimatedTopTabNavigation.ContextType
);

export const Provider = memo(
  ({
    children,
    config,
    screenProperties,
  }: ReanimatedTopTabNavigation.TopTabContextProps) => {
    const transformationY = useSharedValue(0);
    const transformationX = useSharedValue(0);
    const currentYPosition = useSharedValue(0);

    const gestureEnabled = useSharedValue(true);
    const currentScreenIndex = useSharedValue(0);

    const navHeight = useSharedValue(0);
    const headerHeight = useSharedValue(0);
    const closeOffset = useSharedValue(0);
    const topTabHeight = useSharedValue(0);

    const topTapNativeRef = useRef(Gesture.Native()).current;

    //Hide header base on config
    const inputRange = useDerivedValue(
      () => config.map((_, idx) => idx),
      [config]
    );

    const outputRange = useDerivedValue(
      () =>
        config.map((type) => {
          switch (type) {
            case 'normal':
              return 0;
            case 'minimalized':
              return -headerHeight.value;
            default:
              return 0;
          }
        }),
      [config]
    );

    useAnimatedReaction(
      () => transformationX.value,
      (value) => {
        if (currentYPosition.value === -headerHeight.value) return;
        transformationY.value = interpolate(
          value,
          inputRange.value,
          outputRange.value,
          'clamp'
        );
      }
    );

    return (
      <Context.Provider
        value={{
          closeOffset,
          config,
          currentScreenIndex,
          currentYPosition,
          gestureEnabled,
          headerHeight,
          navHeight,
          screenProperties,
          topTabHeight,
          topTapNativeRef,
          transformationX,
          transformationY,
        }}
      >
        {children({
          closeOffset,
          config,
          currentScreenIndex,
          currentYPosition,
          gestureEnabled,
          headerHeight,
          navHeight,
          screenProperties,
          topTabHeight,
          topTapNativeRef,
          transformationX,
          transformationY,
        })}
      </Context.Provider>
    );
  }
);
