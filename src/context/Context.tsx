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
      positionX,
      transformationY,
      currentYPosition,
      headerHeight,
      isHeaderHeightSet,
      scrollY,
    } = ContextHooks.useTransformHeaderOnTabChange({ config });

    ContextHooks.useResetApproachingScreenScrollOffset({
      currentYPosition,
      positionX,
      context,
    });

    ContextHooks.useApproachingTabChange({
      config,
      gestureEnabled,
      positionX,
      currentScreenIndex,
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
          positionX,
          transformationY,
          context,
          isHeaderHeightSet,
          scrollY,
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
          positionX,
          transformationY,
          context,
          isHeaderHeightSet,
          scrollY,
        })}
      </Context.Provider>
    );
  }
);
