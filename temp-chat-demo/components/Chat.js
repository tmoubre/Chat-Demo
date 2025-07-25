//Chat.js
import React, { useState, useEffect, useCallback } from "react";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Chat({ db, route }) {
  const { userID, name } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Subscribe in real time to the "messages" collection, newest first
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt?.toDate() || new Date(),
            user: data.user,
          };
        });
        setMessages(msgs);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
      }
    );

    // Clean up listener on unmount
    return unsubscribe;
  }, [db]);

  // Send a new message by adding it to Firestore
  const onSend = useCallback(
    (newMessages = []) => {
      const { text } = newMessages[0];
      addDoc(collection(db, "messages"), {
        text,
        createdAt: serverTimestamp(),
        user: {
          _id: userID,
          name,
        },
      }).catch((err) => console.error("Error sending message:", err));
    },
    [db, userID, name]
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: userID, name }}
        placeholder="Type a message..."
        alwaysShowSend
        scrollToBottom
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : (
        <KeyboardAvoidingView behavior="padding" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
