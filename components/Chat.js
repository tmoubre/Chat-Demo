//chat.js

import React, { useState, useEffect } from "react";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default function Chat({ route }) {
  const { name } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `${name} has entered the chat`,
        createdAt: new Date(),
        system: true,
      },
      {
        _id: 2,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = (newMsgs = []) =>
    setMessages((previous) => GiftedChat.append(previous, newMsgs));

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(msgs) => onSend(msgs)}
        user={{ _id: 1, name }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : (
        <KeyboardAvoidingView behavior="padding" />
      )}
    </View>
  );
}
