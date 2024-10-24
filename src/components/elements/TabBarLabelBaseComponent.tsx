import { StyleSheet } from 'react-native';
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useTabOffset } from '../../hooks/useTabOffset';

export interface TabBarLabelTypes {
  focused: boolean;
  index: number;
  title: string;
}

export const TabBarLabelBaseComponent = ({
  index,
  ...props
}: TabBarLabelTypes) => {
  const transformationX = useTabOffset();

  const style = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        transformationX.value,
        [index - 1, index, index + 1],
        ['transparent', 'blue', 'transparent']
      ),
    }),
    []
  );

  const textStyle = useAnimatedStyle(
    () => ({
      color: interpolateColor(
        transformationX.value,
        [index - 1, index, index + 1],
        ['black', 'white', 'black']
      ),
    }),
    []
  );

  return (
    <Reanimated.View style={[style, styles.wrapper]}>
      <Reanimated.Text style={[textStyle, styles.text]}>
        {props.title}
      </Reanimated.Text>
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  wrapper: {
    borderRadius: 10,
    height: 35,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
