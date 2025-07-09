// App.js

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screen1 from "./components/Screen1";
import Screen2 from "./components/Screen2";

// Create stack navigator for screen transitions
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        {/* Start screen */}
        <Stack.Screen name="Screen1" component={Screen1} />
        {/* Chat screen */}
        <Stack.Screen name="Screen2" component={Screen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
