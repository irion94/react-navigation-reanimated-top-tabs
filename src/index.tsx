import { useEffect } from 'react';
import { TabBarBaseComponent } from './components/elements/TabBarBaseComponent';
import { ScreenWrapper } from './components/wrappers/ScreenWrapper';
import { ScrollView } from './components/wrappers/ScrollView';
import { SectionList } from './components/wrappers/SectionList';
import { useHeader } from './hooks/useHeader';
import { useScreenGesture } from './hooks/useScreenGesture';
import { useScreenProperties } from './hooks/useScreenProperties';
import { useScreenScrollable } from './hooks/useScreenScrollable';
import { useTabContext } from './hooks/useTabContext';
import { useTabOffset } from './hooks/useTabOffset';
import { WarningService } from './services/Warning.service';

export { createReanimatedTopTabNavigator } from './navigator/createReanimatedTopTabNavigator';
export { type ReanimatedTopTabNavigation } from './types';

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
};
