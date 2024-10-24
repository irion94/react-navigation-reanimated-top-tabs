import { TabBarBaseComponent } from './components/elements/TabBarBaseComponent';
import * as React from 'react';
import { type ReactNode } from 'react';
import { type LayoutRectangle } from 'react-native';
import { type NativeGesture } from 'react-native-gesture-handler';
import Reanimated, { type SharedValue } from 'react-native-reanimated';
import { type StackNavigationOptions } from '@react-navigation/stack';

export namespace ReanimatedTopTabNavigation {
  export interface ContextType {
    closeOffset: SharedValue<number>;
    config: string[];
    currentScreenIndex: SharedValue<number>;
    currentYPosition: SharedValue<number>;
    gestureEnabled: SharedValue<boolean>;
    headerHeight: SharedValue<number>;
    navHeight: SharedValue<number>;
    topTabHeight: SharedValue<number>;
    topTabNativeGesture: NativeGesture;
    transformationX: SharedValue<number>;
    transformationY: SharedValue<number>;
    context: {
      screen: {
        properties: Record<
          string,
          {
            innerLayout: SharedValue<LayoutRectangle>;
            nativeGesture: NativeGesture;
            outerLayout: SharedValue<LayoutRectangle>;
            scrollY: SharedValue<number>;
            scrollRef: { current: Reanimated.ScrollView | null };
          }
        >;
        setRef(key: string, ref: Reanimated.ScrollView | null): void;
        getRef(key: string): { current: Reanimated.ScrollView | null };
      };
      route: {
        map: Record<number, string>;
        getKeyForIndex(index: number): string;
      };
    };
  }

  export interface TabViewNavigatorProps {
    HeaderComponent?: React.ComponentType<
      Pick<ContextType, 'transformationY' | 'headerHeight'>
    >;
    TabBarComponent?: typeof TabBarBaseComponent;
    children: ReactNode;
    config?: string[];
    initialRouteName?: string;
    screenOptions?: StackNavigationOptions;
  }

  export type TopTabContextProps = Pick<ContextType, 'config' | 'context'> & {
    children: (props: ContextType) => React.ReactNode;
  };

  export interface NavigationOptions {
    tabBarLabel?: (props: {
      focused: boolean;
      index: number;
      title: string;
    }) => React.ReactNode;
    title?: string;
  }
}
