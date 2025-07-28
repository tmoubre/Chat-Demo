// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbt26jbJFdkk3bQDy4iM1JDQI5-KGqzdc",
  authDomain: "chat-app-5c220.firebaseapp.com",
  projectId: "chat-app-5c220",
  storageBucket: "chat-app-5c220.firebasestorage.app",
  messagingSenderId: "99485514394",
  appId: "1:99485514394:web:c4cd0d13527fb0a106bd23",
};

const app = initializeApp(firebaseConfig);

// Persist Auth state across restarts
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
