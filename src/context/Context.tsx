import { type ReanimatedTopTabNavigation } from '../types';
import { createContext, memo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { ContextHooks } from './Context.hooks';

export const Context = createContext<ReanimatedTopTabNavigation.ContextType>(
  {} as ReanimatedTopTabNavigation.ContextType
);

export const Provider = memo(
  ({
    children,
    config,
    context,
  }: ReanimatedTopTabNavigation.TopTabContextProps) => {
    const gestureEnabled = useSharedValue(true);
    const currentScreenIndex = useSharedValue(0);

    const navHeight = useSharedValue(0);
    const closeOffset = useSharedValue(0);
    const topTabHeight = useSharedValue(0);

    const topTabNativeGesture = useRef(Gesture.Native()).current;

    const {
      transformationX,
      transformationY,
      currentYPosition,
      headerHeight,
      isHeaderHeightSet,
    } = ContextHooks.useTransformHeaderOnTabChange({ config });

    ContextHooks.useResetApproachingScreenScrollOffset({
      currentYPosition,
      transformationX,
      context,
    });

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
          topTabHeight,
          topTabNativeGesture,
          transformationX,
          transformationY,
          context,
          isHeaderHeightSet,
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
          topTabHeight,
          topTabNativeGesture,
          transformationX,
          transformationY,
          context,
          isHeaderHeightSet,
        })}
      </Context.Provider>
    );
  }
);
