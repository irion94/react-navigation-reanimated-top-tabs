import {
  createReanimatedTopTabNavigator,
  ScrollView,
  TabBarLabelBaseComponent,
} from 'react-navigation-reanimated-top-tabs';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Reanimated from 'react-native-reanimated';
import { Text } from 'react-native';

const Stack = createReanimatedTopTabNavigator();

const DumpScreen = () => {
  const { name } = useRoute();

  return (
    <ScrollView>
      <Reanimated.View style={{ flex: 1, backgroundColor: name }}>
        {new Array(25).fill(0).map((_, index) => (
          <Reanimated.View
            key={index}
            style={{ height: 50, alignItems: 'center' }}
          >
            <Text>{index}</Text>
          </Reanimated.View>
        ))}
      </Reanimated.View>
    </ScrollView>
  );
};

const Test = () => {
  return (
    <Stack.Navigator
      config={['normal', 'normal', 'minimalized']}
      screenOptions={{
        tabBarLabel: TabBarLabelBaseComponent,
      }}
      HeaderComponent={() => (
        <Reanimated.View style={{ height: 200, backgroundColor: 'purple' }} />
      )}
    >
      <Stack.Screen name={'blue'} component={DumpScreen} />
      <Stack.Screen name={'red'} component={DumpScreen} />
      <Stack.Screen name={'green'} component={DumpScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <Test />
          </SafeAreaView>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
