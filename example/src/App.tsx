import { View } from 'react-native';
import {
  createReanimatedTopTabNavigator,
  ScrollView,
} from 'react-navigation-reanimated-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Reanimated from 'react-native-reanimated';

const Stack = createReanimatedTopTabNavigator();

const DumpScreen = () => (
  <ScrollView>
    <View style={{ flex: 1, backgroundColor: 'red' }} />
  </ScrollView>
);

const Test = () => {
  return (
    <Stack.Navigator
      config={['normal', 'normal', 'normal']}
      HeaderComponent={() => <Reanimated.View style={{ height: 150 }} />}
    >
      <Stack.Screen name={'a'} component={DumpScreen} />
      <Stack.Screen name={'b'} component={DumpScreen} />
      <Stack.Screen name={'c'} component={DumpScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Test />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
