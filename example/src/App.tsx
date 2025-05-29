import { NavigationContainer, useRoute } from '@react-navigation/native';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Reanimated from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  createReanimatedTopTabNavigator,
  Tab,
} from 'react-navigation-reanimated-top-tabs';

const Stack = createReanimatedTopTabNavigator();

const DumpScreen = () => {
  const { name } = useRoute();

  return (
    <Tab.ScreenWrapper>
      <Reanimated.View style={{ height: 100, backgroundColor: 'red' }} />
      <Tab.ScrollView>
        <Reanimated.View style={{ flex: 1, backgroundColor: name }}>
          {new Array(25).fill(0).map((_, index) => (
            <Reanimated.View
              key={index}
              style={{
                height: 50,
                alignItems: 'center',
                backgroundColor: index % 2 ? 'green' : 'yellow',
              }}
            >
              <Text>{index}</Text>
            </Reanimated.View>
          ))}
        </Reanimated.View>
      </Tab.ScrollView>
    </Tab.ScreenWrapper>
  );
};

const DumpScreen2 = () => {
  const { name } = useRoute();

  return (
    <Tab.ScreenWrapper>
      <Tab.ScrollView>
        <Reanimated.View style={{ flex: 1, backgroundColor: name }}>
          {new Array(25).fill(0).map((_, index) => (
            <Reanimated.View
              key={index}
              style={{
                height: 50,
                alignItems: 'center',
                backgroundColor: index % 2 ? 'blue' : 'red',
              }}
            >
              <Text>{index}</Text>
            </Reanimated.View>
          ))}
        </Reanimated.View>
      </Tab.ScrollView>
    </Tab.ScreenWrapper>
  );
};

const DumpScreen3 = () => {
  const { name } = useRoute();

  return (
    <Tab.ScreenWrapper>
      <Tab.ScrollView>
        <Reanimated.View style={{ flex: 1, backgroundColor: name }}>
          {new Array(25).fill(0).map((_, index) => (
            <Reanimated.View
              key={index}
              style={{
                height: 50,
                alignItems: 'center',
                backgroundColor: index % 2 ? 'pink' : 'brown',
              }}
            >
              <Text>{index}</Text>
            </Reanimated.View>
          ))}
        </Reanimated.View>
      </Tab.ScrollView>
      <Reanimated.View style={{ height: 100, backgroundColor: 'red' }} />
    </Tab.ScreenWrapper>
  );
};

const HeaderComponent = () => {
  return (
    <Reanimated.View style={[{ height: 200, backgroundColor: 'purple' }]} />
  );
};

const Test = () => {
  return (
    <Stack.Navigator
      config={['normal', 'normal', 'minimalized']}
      HeaderComponent={HeaderComponent}
    >
      <Stack.Screen name={'blue'} component={DumpScreen} />
      <Stack.Screen name={'red'} component={DumpScreen2} />
      <Stack.Screen name={'green'} component={DumpScreen3} />
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
