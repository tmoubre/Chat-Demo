// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox } from "react-native";

import { auth, db } from "./firebase";
import Welcome from "./components/Welcome";
import Start from "./components/Start";
import Chat from "./components/Chat";

// silence the AsyncStorage warning
LogBox.ignoreLogs(["AsyncStorage has been extracted"]);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome">
          {(props) => <Welcome auth={auth} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Start">
          {(props) => <Start db={db} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => <Chat auth={auth} db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
