// Chat.js
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
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
import AudioPlayer from "./AudioPlayer";
import MapView from "./ChatMapView";
import CustomActions from "./CustomActions";

export default function Chat({ db, route, isConnected }) {
  const { userID, name } = route.params;
  const [messages, setMessages] = useState([]);

  // Subscribe to Firestore and local storage
  useEffect(() => {
    let unsubscribe;
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    if (isConnected) {
      unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text || "",
            createdAt: data.createdAt.toDate(),
            user: data.user,
            image: data.image || null,
            location: data.location || null,
            audio: data.audio || null, // audio field
          };
        });
        setMessages(msgs);
        AsyncStorage.setItem("messages", JSON.stringify(msgs));
      });
    } else {
      AsyncStorage.getItem("messages").then((stored) => {
        if (stored) setMessages(JSON.parse(stored));
      });
    }

    return () => unsubscribe && unsubscribe();
  }, [db, isConnected]);

  // Send messages to Firestore and local state
  const onSend = useCallback(
    (newMessages) => {
      const [message] = newMessages;
      if (isConnected) {
        addDoc(collection(db, "messages"), {
          text: message.text || "",
          createdAt: serverTimestamp(),
          user: message.user,
          image: message.image || null,
          location: message.location || null,
          audio: message.audio || null, // include audio
        });
      }
      setMessages((prev) => {
        const updated = GiftedChat.append(prev, newMessages);
        AsyncStorage.setItem("messages", JSON.stringify(updated));
        return updated;
      });
    },
    [db, isConnected]
  );

  // Render custom views: audio, location, then default
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.audio) {
      return <AudioPlayer uri={currentMessage.audio} />;
    }
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        />
      );
    }
    return null;
  };

  return (
    <ActionSheetProvider>
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: userID, name }}
          placeholder="Type a message..."
          scrollToBottom
          alwaysShowSend={isConnected}
          renderInputToolbar={(props) =>
            isConnected ? <InputToolbar {...props} /> : null
          }
          renderActions={(props) => <CustomActions {...props} />}
          renderCustomView={renderCustomView}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : (
          <KeyboardAvoidingView behavior="padding" />
        )}
      </View>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
