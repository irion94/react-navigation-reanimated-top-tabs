import {
  type LayoutChangeEvent,
  type ScrollViewProps,
  StyleSheet,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { type AnimatedProps } from 'react-native-reanimated';
import { useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { useTabContext } from '../../hooks/useTabContext';
import { useScreenGesture } from '../../hooks/useScreenGesture';
import { useScreenScrollable } from '../../hooks/useScreenScrollable';
import { useScreenProperties } from '../../hooks/useScreenProperties';

export type ScreenWrapperProps = AnimatedProps<
  Omit<ScrollViewProps, 'onScroll' | 'onLayout' | 'bounces'>
> &
  Pick<ScrollViewProps, 'onLayout'> & {};

export const ScrollView = ({
  children,
  style,
  contentContainerStyle,
  onLayout,
  ...props
}: ScreenWrapperProps) => {
  const gesture = useScreenGesture();
  const {
    style: _style,
    contentContainerStyle: _contentContainerStyle,
    onScroll,
    bounces,
    animatedProps,
  } = useScreenScrollable();
  const { innerLayout } = useScreenProperties();
  const { context } = useTabContext();

  const { key } = useRoute();
  const _ref = useRef<Reanimated.ScrollView>(null);

  const _onLayout = (event: LayoutChangeEvent) => {
    onLayout?.(event);
    innerLayout.value = event.nativeEvent.layout;
    context.screen.setRef(key, _ref.current);
  };

  return (
    <GestureDetector gesture={gesture}>
      <Reanimated.ScrollView
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
        {...props}
      >
        {children}
      </Reanimated.ScrollView>
    </GestureDetector>
  );
};

const styleSheet = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});
