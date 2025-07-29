// App.js
import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { disableNetwork, enableNetwork } from "firebase/firestore";
import { useEffect, useState } from "react";
import { LogBox } from "react-native";

import Chat from "./components/Chat";
import Start from "./components/Start";
import Welcome from "./components/Welcome";
import { auth, db } from "./firebase";

// silence the AsyncStorage warning
LogBox.ignoreLogs(["AsyncStorage has been extracted"]);

const Stack = createNativeStackNavigator();

export default function App() {
  const netInfo = useNetInfo();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    setIsConnected(netInfo.isConnected);

    if (netInfo.isConnected) {
      enableNetwork(db).catch((error) =>
        console.warn("Firestore enableNetwork error:", error)
      );
    } else {
      disableNetwork(db).catch((error) =>
        console.warn("Firestore disableNetwork error:", error)
      );
    }
  }, [netInfo.isConnected]);

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
          {(props) => (
            <Chat auth={auth} db={db} isConnected={isConnected} {...props} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
