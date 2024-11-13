import {
  createNavigatorFactory,
  type ParamListBase,
  type TabNavigationState,
  TabRouter,
  useNavigationBuilder,
} from '@react-navigation/native';
import type { DefaultRouterOptions } from '@react-navigation/routers';
import { GestureWrapper } from '../components/wrappers/GestureWrapper';
import { TabBarBaseComponent } from '../components/elements/TabBarBaseComponent';
import { Provider } from '../context/Context';
import { type ReanimatedTopTabNavigation } from '../types';
import { omit } from 'lodash';
import { useMemo } from 'react';
import Reanimated, { type SharedValue } from 'react-native-reanimated';
import type { ReanimatedTabViewTypes } from '../components/ReanimatedTopTab/types';
import { ReanimatedTabView } from '../components/ReanimatedTopTab/ReanimatedTabView';
import { ContextHooks } from '../context/Context.hooks';

const TabViewNavigator = ({
  HeaderComponent,
  TabBarComponent = TabBarBaseComponent,
  children,
  config,
  initialRouteName,
  screenOptions = {},
}: ReanimatedTopTabNavigation.TabViewNavigatorProps) => {
  const { NavigationContent, descriptors, navigation, state } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      DefaultRouterOptions,
      {},
      ReanimatedTopTabNavigation.NavigationOptions,
      {}
    >(TabRouter, {
      children,
      defaultScreenOptions: screenOptions,
      initialRouteName,
      screenOptions,
    });

  let _config: string[] = config!;

  if (!config) {
    _config = state.routes.map(() => 'normal');
  }

  const context = ContextHooks.usePrepareContext({ state });

  //NOTE: all belows reefers to Tabs component directly. Consider to move it somewhere
  const onIndexChange =
    (
      currentScreenIndex: SharedValue<number>,
      gestureEnabled: SharedValue<boolean>
    ) =>
    (index: number) => {
      currentScreenIndex.value = index;
      switch (_config[index]) {
        case 'normal': {
          gestureEnabled.value = true;
          break;
        }
        case 'minimalized': {
          gestureEnabled.value = false;
          break;
        }
      }
      navigation.navigate(state.routes[index]?.name ?? '');
    };

  const navigationState = useMemo(
    () => ({
      index: state.index,
      routes: state.routes.map((route, index) => {
        const restOptions = omit(
          descriptors[route.key]?.options,
          'tabBarLabel'
        );
        const tabBarLabel = descriptors[route.key]?.options.tabBarLabel
          ? () =>
              descriptors[route.key]?.options.tabBarLabel?.({
                focused: state.index === index,
                title: descriptors[route.key]?.options.title || route.name,
                index,
              })
          : undefined;

        return {
          ...route,
          ...restOptions,
          tabBarLabel,
          title: descriptors[route.key]?.options.title || route.name,
        };
      }),
    }),
    [state]
  );

  const renderScene = ({ route }: ReanimatedTabViewTypes.SceneProps) =>
    descriptors[route.key]?.render();

  return (
    <Provider config={_config} context={context}>
      {({
        currentScreenIndex,
        gestureEnabled,
        headerHeight,
        transformationY,
      }) => (
        <>
          <Reanimated.View
            onLayout={({ nativeEvent }) => {
              headerHeight.value = nativeEvent.layout.height;
            }}
          >
            {HeaderComponent ? (
              <HeaderComponent
                headerHeight={headerHeight}
                transformationY={transformationY}
              />
            ) : null}
          </Reanimated.View>
          <NavigationContent>
            <GestureWrapper>
              <ReanimatedTabView
                navigationState={navigationState}
                onIndexChange={onIndexChange(
                  currentScreenIndex,
                  gestureEnabled
                )}
                renderScene={renderScene}
                renderTabBar={TabBarComponent}
              />
            </GestureWrapper>
          </NavigationContent>
        </>
      )}
    </Provider>
  );
};

export const createReanimatedTopTabNavigator = <
  Params extends ParamListBase,
>() =>
  createNavigatorFactory<
    TabNavigationState<Params>,
    ReanimatedTopTabNavigation.NavigationOptions,
    {},
    typeof TabViewNavigator
  >(TabViewNavigator)();
