// firebase.js
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbt26jbJFdkk3bQDy4iM1JDQI5-KGqzdc",
  authDomain: "chat-app-5c220.firebaseapp.com",
  projectId: "chat-app-5c220",
  storageBucket: "chat-app-5c220.appspot.com",
  messagingSenderId: "99485514394",
  appId: "1:99485514394:web:c4cd0d13527fb0a106bd23",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
// Persist auth state in browser localStorage
auth
  .setPersistence(browserLocalPersistence)
  .catch((err) => console.warn("Failed to set persistence:", err));
