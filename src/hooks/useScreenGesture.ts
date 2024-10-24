import { useRoute } from '@react-navigation/native';
import { useTabContext } from './useTabContext';

export const useScreenGesture = () => {
  const { key } = useRoute();
  const { context } = useTabContext();

  const nativeRef = context.screen.properties[key]?.nativeGesture;

  if (!nativeRef) throw 'GestureRef does not exist for this route';

  return nativeRef;
};
