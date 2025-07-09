// Screen2.js

import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

const Screen2 = ({ route, navigation }) => {
  const { name, bgColor } = route.params; // Get parameters from Screen1

  // Set navigation bar title to user's name
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.text}>Hello Screen2!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
});

export default Screen2;
