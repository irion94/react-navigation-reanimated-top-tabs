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
} from './TopTab.hooks';

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

  const onLayout = (event: LayoutChangeEvent) => {
    innerLayout.value = event.nativeEvent.layout;
  };

  return (
    <GestureDetector gesture={gesture}>
      <Reanimated.ScrollView
        {...scrollProps}
        {...props}
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
