import Reanimated, {
  interpolate,
  makeMutable,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { type ReanimatedTopTabNavigation } from '../types';
import { useRef } from 'react';
import type {
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import { Gesture } from 'react-native-gesture-handler';
import { assign } from 'lodash';
import { ContextHelpers } from './Context.helpers';

/**
 * Hook to reset the scroll offset for the approaching screen in a tab navigation context.
 *
 * @param {Object} params - The parameters for configuring the scroll offset reset.
 * @param {ReanimatedTopTabNavigation.ContextType["context"]} params.context - The context containing navigation and screen information.
 * @param {ReanimatedTopTabNavigation.ContextType["transformationX"]} params.transformationX - The horizontal transformation value used in animations.
 * @param {ReanimatedTopTabNavigation.ContextType["currentYPosition"]} params.currentYPosition - The current vertical scroll position.
 *
 * The hook is responsible for resetting the vertical scroll offset of the "approaching" screen within a tabbed navigation interface,
 * ensuring a smooth user experience by resetting the scroll position to the top under certain conditions.
 * When the user swipes across tabs, it checks if the approaching screen has a non-zero scroll offset and resets it
 * if the current screen is at the top position.
 */
const useResetApproachingScreenScrollOffset = ({
  context,
  transformationX,
  currentYPosition,
}: Pick<
  ReanimatedTopTabNavigation.ContextType,
  'context' | 'currentYPosition' | 'transformationX'
>) => {
  const screenOffsets = useDerivedValue(() =>
    Object.values(context.screen.properties).map(({ scrollY }) => scrollY.value)
  );

  const resetApproachingScreenOffset = (
    index: number,
    shouldReset: boolean
  ) => {
    if (shouldReset) {
      const { scrollTo } = context.screen.getRef(
        context.route.getKeyForIndex(index)
      ).current ?? { scrollTo: () => {} };
      //NOTE: use reanimated scrollTo does not work
      scrollTo({ y: 0, animated: false });
    }
  };

  useAnimatedReaction(
    () => transformationX.value,
    (current, previous) => {
      const approachingIndex = ContextHelpers.getTargetIndex(current, previous);

      const approachingScreenOffset =
        screenOffsets.value[approachingIndex] ?? -1;

      runOnJS(resetApproachingScreenOffset)(
        approachingIndex,
        approachingScreenOffset > 0 && currentYPosition.value === 0
      );
    }
  );
};

/**
 * Custom hook to prepare a key map for Tab Navigation.
 *
 * @param {Object} params - The parameters for the hook.
 * @param {TabNavigationState<any>} params.state - The navigation state object containing route information.
 * @returns {ReanimatedTopTabNavigation.TopTabContextProps['context']['route']} An object containing:
 *    - map: A mapping of tab indices to route keys.
 *    - getKeyForIndex: A function that takes an index and returns the corresponding route key.
 * @throws Will throw an error if the key for the provided index does not exist.
 */
const usePrepareKeyMap = ({
  state,
}: {
  state: TabNavigationState<any>;
}): ReanimatedTopTabNavigation.TopTabContextProps['context']['route'] => {
  const indexToKeyMap = useRef(
    state.routes.reduce(
      (previousValue, currentValue, currentIndex) => ({
        ...previousValue,
        [currentIndex]: currentValue.key,
      }),
      {} as Record<number, string>
    )
  );

  const getKeyForIndex = (index: number) => {
    const key = indexToKeyMap.current[index];
    if (!key) throw '[getKeyForIndex]: Key does not exist';
    return key;
  };

  return { map: indexToKeyMap.current, getKeyForIndex };
};

/**
 * Prepares screen properties and manages scroll references for each route in the navigation state.
 *
 * @param {Object} params - The parameters for preparing the screen.
 * @param {TabNavigationState<any>} params.state - The navigation state containing route information.
 * @returns {Object} An object containing screen properties, and methods to set and get scroll references.
 * @property {Object} properties - The current screen properties.
 * @property {Function} setRef - Function to set the scroll reference for a specific route.
 * @property {Function} getRef - Function to get the scroll reference of a specific route.
 */
const usePrepareScreen = ({
  state,
}: {
  state: TabNavigationState<ParamListBase>;
}) => {
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
          scrollRef: { current: null },
        },
      }),
      {} as ReanimatedTopTabNavigation.ContextType['context']['screen']['properties']
    )
  );

  const setRef = (key: string, ref: Reanimated.ScrollView) => {
    const newProperties = assign({}, screenProperties.current[key], {
      scrollRef: { current: ref },
    });

    screenProperties.current = assign({}, screenProperties.current, {
      [key]: newProperties,
    });
  };

  const getRef = (key: string) => {
    const _ref = screenProperties.current[key]?.scrollRef;
    if (!_ref) throw '[getRef]: Ref does not exist';
    return _ref;
  };

  return { properties: screenProperties.current, setRef, getRef };
};

/**
 * Prepares the context required for top tab navigation.
 *
 * This function takes the current state of the navigation
 * and prepares the necessary context properties such as `screen`
 * and `route`, which are then used for navigation purposes.
 *
 * @param {Object} params - The parameters for preparing the context.
 * @param {TabNavigationState<any>} params.state - The current state of the navigation.
 *
 * @returns {ReanimatedTopTabNavigation.TopTabContextProps['context']} The prepared context containing screen and route properties.
 */
const usePrepareContext = ({
  state,
}: {
  state: TabNavigationState<ParamListBase>;
}): ReanimatedTopTabNavigation.TopTabContextProps['context'] => {
  const screen = usePrepareScreen({ state });
  const route = usePrepareKeyMap({ state });

  return { screen, route };
};

/**
 * Custom hook that handles the transformation of a header component based on tab changes, particularly
 * for animations and configurations involving header behavior. Utilizes shared and derived values to
 * manage the translation of the header on the Y-axis and maintain its position based on the specified
 * configurations.
 *
 * @param {Object} params - The parameters object.
 * @param {Array} params.config - An array of configuration settings to determine the header's transformation.
 * @returns {Object} An object containing shared values for header transformations and positioning:
 * - transformationY: The derived Y-axis transformation value for the header.
 * - transformationX: The shared X-axis transformation value to be observed.
 * - currentYPosition: The shared Y-axis position of the header.
 * - headerHeight: The shared height value of the header.
 */
const useTransformHeaderOnTabChange = ({
  config,
}: Pick<ReanimatedTopTabNavigation.ContextType, 'config'>) => {
  const headerHeight = useSharedValue(0);
  const transformationY = useSharedValue(0);
  const transformationX = useSharedValue(0);
  const currentYPosition = useSharedValue(0);

  //Hide header base on config
  const inputRange = useDerivedValue(
    () => config.map((_, idx) => idx),
    [config]
  );

  const outputRange = useDerivedValue(
    () =>
      config.map((type) => {
        switch (type) {
          case 'normal':
            return 0;
          case 'minimalized':
            return -headerHeight.value;
          default:
            return 0;
        }
      }),
    [config]
  );

  useAnimatedReaction(
    () => transformationX.value,
    (value) => {
      if (currentYPosition.value === -headerHeight.value) return;
      transformationY.value = interpolate(
        value,
        inputRange.value,
        outputRange.value,
        'clamp'
      );
    }
  );

  return { transformationY, transformationX, currentYPosition, headerHeight };
};

export const ContextHooks = {
  useResetApproachingScreenScrollOffset,
  usePrepareContext,
  useTransformHeaderOnTabChange,
};
