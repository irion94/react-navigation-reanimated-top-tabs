import { useRoute } from '@react-navigation/native';
import { useTabContext } from './useTabContext';

export const useScreenProperties = () => {
  const { key } = useRoute();
  const { context } = useTabContext();
  const screen = context.screen.properties[key];
  if (!screen) throw 'No screen properties registered for this route';

  return screen;
};
