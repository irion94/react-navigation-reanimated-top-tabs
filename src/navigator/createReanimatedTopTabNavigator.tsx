import {
  createNavigatorFactory,
  type ParamListBase,
  TabActions,
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
import Reanimated from 'react-native-reanimated';
import type { ReanimatedTabViewTypes } from '../components/ReanimatedTopTab/types';
import { ReanimatedTabView } from '../components/ReanimatedTopTab/ReanimatedTabView';
import { ContextHooks } from '../context/Context.hooks';

const TabViewNavigator = ({
  HeaderComponent,
  TopComponent,
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

  const navigate = (index: number) => {
    const route = state.routes[index];
    if (!route) return;
    navigation.dispatch(TabActions.jumpTo(route.name));
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
          ? (focused: boolean) =>
              descriptors[route.key]?.options.tabBarLabel?.({
                focused,
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
      {({ headerHeight, transformationY }) => (
        <NavigationContent>
          {TopComponent ? (
            <TopComponent transformationY={transformationY} />
          ) : null}
          <GestureWrapper>
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
            <ReanimatedTabView
              navigationState={navigationState}
              navigate={navigate}
              renderScene={renderScene}
              renderTabBar={TabBarComponent}
              screenOptions={screenOptions}
            />
          </GestureWrapper>
        </NavigationContent>
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
