import { TabBarBaseComponent } from './components/elements/TabBarBaseComponent';
import * as React from 'react';
import { type ReactNode } from 'react';
import {
  SectionList,
  type LayoutRectangle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
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
    isHeaderHeightSet: SharedValue<boolean>;
    navHeight: SharedValue<number>;
    topTabHeight: SharedValue<number>;
    topTabNativeGesture: NativeGesture;
    positionX: SharedValue<number>;
    transformationY: SharedValue<number>;
    scrollY: SharedValue<number>;
    context: {
      screen: {
        properties: Record<
          string,
          {
            innerLayout: SharedValue<LayoutRectangle>;
            nativeGesture: NativeGesture;
            outerLayout: SharedValue<LayoutRectangle>;
            scrollY: SharedValue<number>;
            scrollRef: { current: Reanimated.ScrollView | SectionList | null };
          }
        >;
        setRef(
          key: string,
          ref: Reanimated.ScrollView | SectionList | null
        ): void;
        getRef(key: string): {
          current: Reanimated.ScrollView | SectionList | null;
        };
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
    TopComponent?: React.ComponentType<Pick<ContextType, 'transformationY'>>;
    TabBarComponent?: typeof TabBarBaseComponent;
    children: ReactNode;
    config?: string[];
    initialRouteName?: string;
    screenOptions?: StackNavigationOptions;
    bounces?: boolean;
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
    tabBarIndicatorStyle?: StyleProp<ViewStyle>;
    tabBarItemStyle?: StyleProp<ViewStyle>;
    tabBarStyle?: StyleProp<ViewStyle>;
  }
}
