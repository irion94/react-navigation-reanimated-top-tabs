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
} from '../../hooks/Tab.hooks';
import { useRef } from 'react';
import { useRoute } from '@react-navigation/native';

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
  const { screenRefs } = useTabContext();

  const { key } = useRoute();

  const _ref = useRef<Reanimated.ScrollView>(null);

  const _onLayout = (event: LayoutChangeEvent) => {
    onLayout?.(event);
    innerLayout.value = event.nativeEvent.layout;
    screenRefs.setRef(key, _ref);
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
