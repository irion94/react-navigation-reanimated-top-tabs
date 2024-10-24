import { useRoute } from '@react-navigation/native';
import { type LayoutChangeEvent, type ViewProps } from 'react-native';
import Reanimated, { type AnimatedProps } from 'react-native-reanimated';

import { useTabContext } from '../../hooks/useTabContext';

export interface ScreenWrapperProps
  extends AnimatedProps<Omit<ViewProps, 'onLayout'>> {}

export const ScreenWrapper = ({
  children,
  ...viewProps
}: ScreenWrapperProps) => {
  const { key } = useRoute();
  const { context } = useTabContext();

  const onLayout = (event: LayoutChangeEvent) => {
    const screen = context.screen.properties[key];
    if (!screen) throw 'No screen property registered for this route';
    screen.outerLayout.value = event.nativeEvent.layout;
  };

  return (
    <Reanimated.View {...viewProps} onLayout={onLayout}>
      {children}
    </Reanimated.View>
  );
};
