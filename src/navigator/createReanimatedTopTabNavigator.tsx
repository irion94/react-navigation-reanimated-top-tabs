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
import {
  type RenderTabsParams,
  TabBarBaseComponent,
} from '../components/elements/TabBarBaseComponent';
import { Provider } from '../context/TopTabContext';
import { type ReanimatedTopTabNavigation } from '../types';
import { omit } from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import Reanimated, {
  makeMutable,
  type SharedValue,
} from 'react-native-reanimated';
import type { ReanimatedTabViewTypes } from '../components/ReanimatedTopTab/types';
import { ReanimatedTabView } from '../components/ReanimatedTopTab/ReanimatedTabView';

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
  const screenProperties = useRef(
    state.routes.reduce(
      (prev, route) => ({
        ...prev,
        [route.key]: {
          innerLayout: makeMutable({
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          }),
          nativeGesture: Gesture.Native(),
          outerLayout: makeMutable({
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          }),
          scrollY: makeMutable(0),
        },
      }),
      {} as ReanimatedTopTabNavigation.ContextType['screenProperties']
    )
  ).current;

  const onIndexChange =
    (
      currentScreenIndex: SharedValue<number>,
      gestureEnabled: SharedValue<boolean>
    ) =>
    (index: number) => {
      navigation.navigate(state.routes[index]?.name ?? '');
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

  const navigate = (route: any) => {
    navigation.dispatch({
      ...TabActions.jumpTo(route.name, route.params),
      target: state.key,
    });
  };

  const renderTabBar = useCallback(
    (props: RenderTabsParams) => (
      <TabBarComponent {...props} navigate={navigate} />
    ),
    []
  );

  const renderScene = ({ route }: ReanimatedTabViewTypes.SceneProps) =>
    descriptors[route.key]?.render();

  return (
    <Provider config={_config} screenProperties={screenProperties}>
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
                renderTabBar={renderTabBar}
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
