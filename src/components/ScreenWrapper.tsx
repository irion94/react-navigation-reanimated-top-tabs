import { useRoute } from '@react-navigation/native';
import { type LayoutChangeEvent, type ViewProps } from 'react-native';
import Reanimated, { type AnimatedProps } from 'react-native-reanimated';
import { useTabContext } from './TopTab.hooks';

export interface ScreenWrapperProps
  extends AnimatedProps<Omit<ViewProps, 'onLayout'>> {}

export const ScreenWrapper = ({
  children,
  ...viewProps
}: ScreenWrapperProps) => {
  const { key } = useRoute();
  const { screenProperties } = useTabContext();

  const onLayout = (event: LayoutChangeEvent) => {
    const screen = screenProperties[key];
    if (!screen) throw 'No screen property registered for this route';
    screen.outerLayout.value = event.nativeEvent.layout;
  };

  return (
    <Reanimated.View {...viewProps} onLayout={onLayout}>
      {children}
    </Reanimated.View>
  );
};
