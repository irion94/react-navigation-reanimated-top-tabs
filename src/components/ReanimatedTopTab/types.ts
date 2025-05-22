import React from 'react';
import type { ReanimatedTopTabNavigation } from 'react-navigation-reanimated-top-tabs';

export namespace ReanimatedTabViewTypes {
  export interface Route {
    key: string;
    name: string;
    tabBarLabel?: (focused: boolean) => React.ReactNode;
    title?: string;
  }

  export type NavigationState = { index: number; routes: Route[] };

  export interface RenderTabsParams {
    navigationState: NavigationState;
    navigate(index: number): void;
    screenOptions?: ReanimatedTopTabNavigation.NavigationOptions;
  }

  export interface SceneProps {
    jumpTo?: (key: string) => void;
    route: Route;
  }
}
