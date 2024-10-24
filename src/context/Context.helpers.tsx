const getTargetIndex = (currentValue: number, previousValue: number | null) => {
  'worklet';
  if (currentValue > (previousValue ?? 0)) {
    return Math.ceil(currentValue);
  } else {
    return Math.floor(currentValue);
  }
};

export const ContextHelpers = { getTargetIndex };
