export const WarningService = {
  hasWarned: false,
  warn() {
    if (__DEV__ && !this.hasWarned) {
      console.warn(
        '[react-navigation-reanimated-top-tabs]: You are directly using the tab context, which may lead to unexpected behavior. Please use the provided hooks or API for better stability.'
      );
      this.hasWarned = true;
    }
  },
};
