import { ScrollView } from './components/wrappers/ScrollView';
import { ScreenWrapper } from './components/wrappers/ScreenWrapper';
import { TabBarBaseComponent } from './components/elements/TabBarBaseComponent';
import { TabBarLabelBaseComponent } from './components/elements/TabBarLabelBaseComponent';
import {
  useHeader,
  useScreenGesture,
  useScreenProperties,
  useScreenScrollable,
  useTabContext,
} from './hooks/Tab.hooks';

export { type ReanimatedTopTabNavigation } from './types';
export { createReanimatedTopTabNavigator } from './navigator/createReanimatedTopTabNavigator';

export const TabHooks = {
  useHeader,
  useScreenProperties,
  useScreenScrollable,
  useScreenGesture,
  useTabContext,
};

export const Tab = {
  ScrollView,
  ScreenWrapper,
  TabBarBaseComponent,
  TabBarLabelBaseComponent,
};
