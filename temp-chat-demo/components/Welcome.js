// components/Welcome.js
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

export default function Welcome({ navigation, auth }) {
  // if already signed in, go straight to Start
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Start", { userID: user.uid });
      }
    });
    return unsub;
  }, [auth, navigation]);

  const startChat = () => {
    signInAnonymously(auth)
      .then(({ user }) => {
        Alert.alert("Signed in anonymously");
        navigation.replace("Start", { userID: user.uid });
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Unable to sign in", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Chat App</Text>
      <TouchableOpacity style={styles.button} onPress={startChat}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, marginBottom: 30, fontWeight: "600" },
  button: { backgroundColor: "#000", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 18 },
});
