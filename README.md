# react-navigation-reanimated-top-tabs

⚠️ **Library Under Development** ⚠️
This library is currently in **early-alpha stage**. It is not recommended for production use, and APIs may change as development progresses.

## Installation

```sh
npm install react-navigation-reanimated-top-tabs
```

```sh
yarn add react-navigation-reanimated-top-tabs
```

## Setup

Wrap your app in a single `GestureHandlerRootView` from
`react-native-gesture-handler` (see `example/src/App.tsx`). The library does
not render its own root view: gesture handler only relates gestures under the
top-most root, and the header pan gesture must share that root with the pager.

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* navigation container */}
    </GestureHandlerRootView>
  );
}
```
