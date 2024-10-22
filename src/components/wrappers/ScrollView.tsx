import {
  type LayoutChangeEvent,
  type ScrollViewProps,
  StyleSheet,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { type AnimatedProps } from 'react-native-reanimated';
import {
  useScreenGesture,
  useScreenProperties,
  useScreenScrollable,
  useTabContext,
} from '../../hooks/TopTab.hooks';
import { useRef } from 'react';
import { useRoute } from '@react-navigation/native';

export interface ScreenWrapperProps
  extends AnimatedProps<Omit<ScrollViewProps, 'onScroll'>> {}

export const ScrollView = ({
  children,
  style,
  ...props
}: ScreenWrapperProps) => {
  const gesture = useScreenGesture();
  const { style: animatedStyle, ...scrollProps } = useScreenScrollable();
  const { innerLayout } = useScreenProperties();
  const { screenRefs } = useTabContext();

  const { key } = useRoute();

  const _ref = useRef<Reanimated.ScrollView>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    innerLayout.value = event.nativeEvent.layout;
    screenRefs.setRef(key, _ref);
  };

  return (
    <GestureDetector gesture={gesture}>
      <Reanimated.ScrollView
        {...scrollProps}
        {...props}
        ref={_ref}
        contentContainerStyle={_style.contentContainerStyle}
        onLayout={onLayout}
        style={[style, animatedStyle]}
      >
        {children}
      </Reanimated.ScrollView>
    </GestureDetector>
  );
};

const _style = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});
