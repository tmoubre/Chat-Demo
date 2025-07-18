//Start.js

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Start() {
  const [name, setName] = useState("");
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Chat", { userName: name.trim() });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.box}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <Button
          title="Start Chatting"
          onPress={handlePress}
          disabled={!name.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  box: { width: "80%" },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
