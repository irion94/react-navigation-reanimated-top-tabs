import {
  type DefaultSectionT,
  type LayoutChangeEvent,
  type SectionListProps,
  SectionList as RNSectionList,
  StyleSheet,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Reanimated from 'react-native-reanimated';
import { useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { useTabContext } from '../../hooks/useTabContext';
import { useScreenGesture } from '../../hooks/useScreenGesture';
import { useScreenScrollable } from '../../hooks/useScreenScrollable';
import { useScreenProperties } from '../../hooks/useScreenProperties';

export const SectionList = <ItemT, SectionT = DefaultSectionT>({
  children,
  style,
  contentContainerStyle,
  onLayout,
  ...props
}: SectionListProps<ItemT, SectionT>) => {
  const gesture = useScreenGesture();
  const {
    style: _style,
    contentContainerStyle: _contentContainerStyle,
    onScroll,
    bounces,
    animatedProps,
    overScrollMode,
  } = useScreenScrollable();
  const { innerLayout } = useScreenProperties();
  const { context } = useTabContext();

  const { key } = useRoute();
  const _ref = useRef<RNSectionList<any>>(null);

  const _onLayout = (event: LayoutChangeEvent) => {
    onLayout?.(event);
    innerLayout.value = event.nativeEvent.layout;
    context.screen.setRef(key, _ref.current);
  };

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedSectionList
        ref={_ref}
        contentContainerStyle={[
          _contentContainerStyle,
          styleSheet.contentContainerStyle,
          contentContainerStyle,
        ]}
        onLayout={_onLayout}
        style={[_style, style]}
        onScroll={onScroll}
        bounces={bounces}
        animatedProps={animatedProps}
        overScrollMode={overScrollMode}
        {...props}
      >
        {children}
      </AnimatedSectionList>
    </GestureDetector>
  );
};

const styleSheet = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

const AnimatedSectionList =
  Reanimated.createAnimatedComponent<SectionListProps<any, any>>(RNSectionList);
