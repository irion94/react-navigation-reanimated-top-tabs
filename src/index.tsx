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
  useTabOffset,
} from './hooks/Tab.hooks';
import { useEffect } from 'react';
import { WarningService } from './services/Warning.service';

export { type ReanimatedTopTabNavigation } from './types';
export { createReanimatedTopTabNavigator } from './navigator/createReanimatedTopTabNavigator';

const _useTabContext = () => {
  useEffect(() => {
    WarningService.warn();
  }, []);

  return useTabContext();
};

export const TabHooks = {
  useHeader,
  useScreenProperties,
  useScreenScrollable,
  useScreenGesture,
  useTabContext: _useTabContext,
  useTabOffset,
};

export const Tab = {
  ScrollView,
  ScreenWrapper,
  TabBarBaseComponent,
  TabBarLabelBaseComponent,
};
