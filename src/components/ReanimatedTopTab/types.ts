import React from 'react';
import type { ReanimatedTopTabNavigation } from 'react-navigation-reanimated-top-tabs';

export namespace ReanimatedTabViewTypes {
  export interface Route {
    key: string;
    name: string;
    tabBarLabel?: (focused: boolean) => React.ReactNode;
    tabBarAccessibilityLabel?: string;
    title?: string;
  }

  export type NavigationState = { index: number; routes: Route[] };

  /** Primitive-only snapshot of NavigationState, safe to capture in worklets. */
  export type PagerState = { index: number; routesCount: number };

  export interface RenderTabsParams {
    navigationState: NavigationState;
    navigate(index: number): void;
    screenOptions?: ReanimatedTopTabNavigation.NavigationOptions;
  }

  export interface SceneProps {
    route: Route;
  }
}
