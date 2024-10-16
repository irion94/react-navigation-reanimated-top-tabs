import { TabBarBaseComponent } from './TabBarBaseComponent';
import * as React from 'react';
import { type ReactNode } from 'react';
import { type LayoutRectangle } from 'react-native';
import { type NativeGesture } from 'react-native-gesture-handler';
import { type SharedValue } from 'react-native-reanimated';
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
    screenProperties: Record<
      string,
      {
        innerLayout: SharedValue<LayoutRectangle>;
        nativeGesture: NativeGesture;
        outerLayout: SharedValue<LayoutRectangle>;
        scrollY: SharedValue<number>;
      }
    >;
    topTabHeight: SharedValue<number>;
    topTapNativeRef: NativeGesture;
    transformationX: SharedValue<number>;
    transformationY: SharedValue<number>;
  }

  export interface TabViewNavigatorProps {
    HeaderComponent?: (
      props: Pick<ContextType, 'transformationY' | 'headerHeight'>
    ) => React.ReactNode;
    TabBarComponent?: typeof TabBarBaseComponent;
    children: ReactNode;
    config?: string[];
    initialRouteName?: string;
    screenOptions?: StackNavigationOptions;
  }

  export type TopTabContextProps = Pick<
    ContextType,
    'screenProperties' | 'config'
  > & {
    children: (props: ContextType) => React.ReactNode;
  };

  export interface NavigationOptions {
    tabBarLabel?: (props: {
      focused: boolean;
      index: number;
    }) => React.ReactNode;
    title?: string;
  }
}
