import { ScrollView } from './components/wrappers/ScrollView';
import { SectionList } from './components/wrappers/SectionList';
import { ScreenWrapper } from './components/wrappers/ScreenWrapper';
import { TabBarBaseComponent } from './components/elements/TabBarBaseComponent';
import { TabBarLabelBaseComponent } from './components/elements/TabBarLabelBaseComponent';
import { useEffect } from 'react';
import { WarningService } from './services/Warning.service';
import { useTabContext } from './hooks/useTabContext';
import { useTabOffset } from './hooks/useTabOffset';
import { useScreenGesture } from './hooks/useScreenGesture';
import { useScreenScrollable } from './hooks/useScreenScrollable';
import { useScreenProperties } from './hooks/useScreenProperties';
import { useHeader } from './hooks/useHeader';

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
  SectionList,
  ScreenWrapper,
  TabBarBaseComponent,
  TabBarLabelBaseComponent,
};
