import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const screenDimensions = Dimensions.get('screen');

export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = useState(screenDimensions);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  });

  return dimensions;
};
