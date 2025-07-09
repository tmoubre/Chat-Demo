// Screen1.js

import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

// Predefined color choices for chat screen background
const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

const Screen1 = ({ navigation }) => {
  const [name, setName] = useState(""); // User's name input
  const [bgColor, setBgColor] = useState(colors[0]); // Default background color

  return (
    <ImageBackground
      source={require("../assets/BackgroundImage.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text>Hello Screen1!</Text>

        {/* Text input for user name */}
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Type your username here"
        />

        {/* Color selection UI */}
        <Text>Choose a background color:</Text>
        <View style={styles.colorContainer}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                {
                  backgroundColor: color,
                  borderWidth: bgColor === color ? 2 : 0,
                  borderColor: "#fff",
                },
              ]}
              onPress={() => setBgColor(color)}
            />
          ))}
        </View>

        {/* Navigation button to Chat screen */}
        <Button
          title="Go to Screen 2"
          onPress={() =>
            navigation.navigate("Screen2", { name: name, bgColor: bgColor })
          }
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginBottom: 20,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
  },
});

export default Screen1;
