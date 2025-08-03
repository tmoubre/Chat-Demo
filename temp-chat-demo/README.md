# Chat App

A cross-platform, offline-first chat application built with Expo, React Native, GiftedChat, and Firebase.
Supports real-time text, image, location, map, and audio messaging with offline persistence.

---

## 🚀 Features

* **Real-time Text Chat** backed by Firebase Firestore
* **Offline-First**: messages (text, images, location, audio) cache to AsyncStorage when offline; auto-sync when reconnected
* **Image Upload**: pick from library or take photo with camera
* **Location Sharing**: send your current geolocation
* **Map View**: native `react-native-maps` on iOS/Android, placeholder on Web
* **Audio Messages**: record & play back voice notes
* **Connectivity Awareness**: online/offline detection via NetInfo

---

## 🛠 Tech Stack

* **Expo (Managed Workflow)**
* **React Native** & **GiftedChat** for UI
* **Firebase** (Firestore & Storage)
* **AsyncStorage** for local caching
* **Expo-Image-Picker**, **Expo-Location**, **Expo-AV**
* **@react-native-community/netinfo** for network status
* **react-native-maps** for native map rendering

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/chat-app.git
   cd chat-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Expo libraries**

   ```bash
   expo install \
     expo-image-picker \
     expo-location \
     expo-av \
     @react-native-community/netinfo \
     @react-native-async-storage/async-storage \
     react-native-gifted-chat \
     react-native-maps
   ```

4. **Install Firebase SDK**

   ```bash
   npm install firebase
   ```

---

## 🔧 Firebase Configuration

1. In the [Firebase Console](https://console.firebase.google.com), create a project.

2. Enable **Firestore** and **Storage**.

3. Copy your web config (Project Settings → SDK Setup) and create `firebase.js` in the project root:

   ```js
   // firebase.js
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import { getStorage } from "firebase/storage";

   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   ```

4. **Secure your keys**: add `firebase.js` to `.gitignore` or use environment variables.

---

## 🌐 CORS Setup for Web

Browsers enforce CORS on Firebase Storage. To allow uploads from `http://localhost:8081`:

1. Create `cors.json` at project root:

   ```json
   [
     {
       "origin": ["http://localhost:8081"],
       "method": ["GET","POST","PUT","DELETE","HEAD","OPTIONS"],
       "responseHeader": ["Content-Type","Authorization","X-Requested-With"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

2. Install the Google Cloud SDK (`gsutil`) and run:

   ```bash
   gsutil cors set cors.json gs://<YOUR_STORAGE_BUCKET>
   ```

---

## 🚀 Running the App

### Web

```bash
expo start --web
```

* Opens in your browser
* Maps on Web display a placeholder
* Test offline via DevTools → Application → Service Workers

### Mobile (iOS & Android)

```bash
expo start
```

* Press **a** to open on Android (requires USB debugging and `adb reverse tcp:8081 tcp:8081`)
* Or scan the QR code in Expo DevTools with Expo Go on iOS/Android

> **Note**: All required native modules ship with **Expo Go**—no custom dev-client needed.

---

## 💡 Permissions & Edge Cases

* **Media Library/Camera**: prompts on first use; alerts on denial
* **Location**: prompts for foreground access; alerts on denial
* **Microphone**: prompts for recording access; alerts on denial
* **Offline Mode**: sending while offline caches locally and syncs later

---

## 📁 Project Structure

```
.
├── App.js
├── firebase.js
├── components/
│   ├── Welcome.js
│   ├── Start.js
│   ├── Chat.js
│   ├── CustomActions.js
│   ├── ChatMapView.native.js
│   ├── ChatMapView.web.js
│   └── AudioPlayer.js
├── package.json
├── cors.json
└── README.md
```

---

## 🐞 Troubleshooting

* **NativeModule errors**: ensure you’re running in Expo Go (managed), not a dev-client.
* **CORS failures**: verify your bucket’s CORS policy includes `OPTIONS` and your origin.
* **Keyboard issues**: remove any external keyboard-controller package; use `KeyboardAvoidingView`.
* **Cache problems**: clear Metro’s cache with `expo start --clear`.

---

## 📄 License

MIT © Troy Oubre

---

Enjoy building and happy chatting! 🎉

