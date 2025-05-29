import { StyleSheet } from 'react-native';
import Reanimated from 'react-native-reanimated';

export interface TabBarLabelTypes {
  focused: boolean;
  title: string;
}

export const TabBarLabelBaseComponent = ({
  title,
  focused,
}: TabBarLabelTypes) => {
  return (
    <Reanimated.Text
      style={[styles.text, { color: focused ? 'red' : 'black' }]}
    >
      {title}
    </Reanimated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
