import React from 'react';
import type { SharedValue } from 'react-native-reanimated';

export namespace ReanimatedTabViewTypes {
  export interface Route {
    key: string;
    name: string;
    tabBarLabel?: () => React.ReactNode;
    title?: string;
  }

  export type NavigationState = { index: number; routes: Route[] };

  export interface RenderTabsParams {
    navigationState: NavigationState;
    position: SharedValue<number>;
    onIndexChange: (index: number) => void;
  }

  export interface SceneProps {
    jumpTo?: (key: string) => void;
    route: Route;
  }

  export type PositionInterpolation = { input: number[]; output: number[] };
}
