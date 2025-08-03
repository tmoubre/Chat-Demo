// components/Welcome.js
import { signInAnonymously } from "firebase/auth";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Welcome({ navigation, auth }) {
  const startChat = () => {
    signInAnonymously(auth)
      .then(({ user }) => {
        Alert.alert("Signed in anonymously");
        // now navigate to Start
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
