// Chat.js
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
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
import MapView from "./ChatMapView.native";
import CustomActions from "./CustomActions";

export default function Chat({ db, route }) {
  const { userID, name } = route.params;
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  // 1) Subscribe to network status
  useEffect(() => {
    // initial fetch
    NetInfo.fetch().then((state) => {
      console.log("Initial connection:", state.isConnected);
      setIsConnected(state.isConnected);
    });
    // listen for changes
    const unsubscribeNet = NetInfo.addEventListener((state) => {
      console.log("Connection changed:", state.isConnected);
      setIsConnected(state.isConnected);
    });
    return () => unsubscribeNet();
  }, []);

  // 2) Load messages from Firestore or AsyncStorage
  useEffect(() => {
    let unsubscribeMessages;
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    if (isConnected) {
      unsubscribeMessages = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text || "",
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            user: data.user,
            image: data.image || null,
            location: data.location || null,
            audio: data.audio || null,
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

    return () => unsubscribeMessages && unsubscribeMessages();
  }, [db, isConnected]);

  // 3) Send handler (writes to Firestore + updates UI)
  const onSend = useCallback(
    (newMessages = []) => {
      const [msg] = newMessages;
      if (isConnected) {
        addDoc(collection(db, "messages"), {
          text: msg.text || "",
          createdAt: serverTimestamp(),
          user: msg.user,
          image: msg.image || null,
          location: msg.location || null,
          audio: msg.audio || null,
        });
      }
      setMessages((prev) => GiftedChat.append(prev, newMessages));
      AsyncStorage.setItem(
        "messages",
        JSON.stringify(GiftedChat.append(messages, newMessages))
      );
    },
    [db, isConnected, messages]
  );

  // 4) Render maps & audio bubbles
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.audio) {
      return <AudioPlayer uri={currentMessage.audio} />;
    }
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
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
          renderActions={(props) => (
            <CustomActions
              {...props}
              onSend={onSend}
              user={{ _id: userID, name }}
            />
          )}
          renderCustomView={renderCustomView}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "height" : "padding"}
        />
      </View>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
