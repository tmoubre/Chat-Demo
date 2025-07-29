// Chat.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";

export default function Chat({ db, route, isConnected }) {
  const { userID, name } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let unsubscribe;
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    if (isConnected) {
      unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesFirestore = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
          };
        });
        setMessages(messagesFirestore);
        AsyncStorage.setItem("messages", JSON.stringify(messagesFirestore));
      });
    } else {
      AsyncStorage.getItem("messages").then((storedMessages) => {
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, isConnected]);

  const onSend = useCallback(
    (newMessages = []) => {
      const [message] = newMessages;

      if (isConnected) {
        addDoc(collection(db, "messages"), {
          text: message.text,
          createdAt: serverTimestamp(),
          user: message.user,
        });
      }

      setMessages((previousMessages) => {
        const updatedMessages = GiftedChat.append(
          previousMessages,
          newMessages
        );
        AsyncStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    },
    [db, isConnected]
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userID, name }}
        placeholder="Type a message..."
        scrollToBottom
        alwaysShowSend={isConnected}
        renderInputToolbar={(props) =>
          isConnected ? <InputToolbar {...props} /> : null
        }
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
