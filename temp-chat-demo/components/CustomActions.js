// CustomActions.js
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React from "react";
import { Alert, Platform, TouchableOpacity, View } from "react-native";

class CustomActions extends React.Component {
  onActionPress = () => {
    const options = [
      "Select Image",
      "Take Photo",
      "Share Location",
      "Record Audio",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    this.props.showActionSheetWithOptions(
      { options, cancelButtonIndex },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.pickImage();
            break;
          case 1:
            this.takePhoto();
            break;
          case 2:
            this.shareLocation();
            break;
          case 3:
            this.recordAudio();
            break;
          default:
            break;
        }
      }
    );
  };

  pickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files[0];
        try {
          const storage = getStorage();
          const name = `${this.props.user._id}-${Date.now()}-${file.name}`;
          const storageRef = ref(storage, name);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          this.props.onSend([{ image: url }]);
        } catch (err) {
          Alert.alert("Upload failed", err.message);
        }
      };
      input.click();
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission required", "Library access denied.");
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.cancelled) {
      this.uploadFile(result.uri, ".jpg", "image");
    }
  };

  takePhoto = async () => {
    if (Platform.OS === "web") {
      return this.pickImage();
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission required", "Camera access denied.");
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.cancelled) {
      this.uploadFile(result.uri, ".jpg", "image");
    }
  };

  shareLocation = async () => {
    if (Platform.OS === "web") {
      if (!navigator.geolocation) {
        return Alert.alert("Location error", "Not supported in browser.");
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.props.onSend([
            {
              location: {
                latitude: coords.latitude,
                longitude: coords.longitude,
              },
            },
          ]);
        },
        (err) => Alert.alert("Location error", err.message)
      );
      return;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission required", "Location access denied.");
    }
    const loc = await Location.getCurrentPositionAsync({});
    this.props.onSend([
      {
        location: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
      },
    ]);
  };

  uploadFile = async (uri, ext, type) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const name = `${this.props.user._id}-${Date.now()}${ext}`;
      const storageRef = ref(storage, name);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      if (type === "image") {
        this.props.onSend([{ image: url }]);
      } else if (type === "audio") {
        this.props.onSend([{ audio: url }]);
      }
    } catch (err) {
      Alert.alert("Upload failed", err.message);
    }
  };

  recordAudio = async () => {
    if (Platform.OS === "web") {
      if (!navigator.mediaDevices?.getUserMedia) {
        return Alert.alert("Audio error", "Recording not supported.");
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const file = new File([blob], "recording.webm");
          const storage = getStorage();
          const name = `${this.props.user._id}-${Date.now()}.webm`;
          const storageRef = ref(storage, name);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          this.props.onSend([{ audio: url }]);
        };
        mediaRecorder.start();
        Alert.alert("Recording…", "Tap OK to stop.", [
          { text: "OK", onPress: () => mediaRecorder.stop() },
        ]);
      } catch (err) {
        Alert.alert("Recording error", err.message);
      }
      return;
    }

    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("Permission required", "Microphone access denied.");
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      Alert.alert("Recording…", "Tap OK to stop.", [
        {
          text: "OK",
          onPress: async () => {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            this.uploadFile(uri, ".m4a", "audio");
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Recording error", err.message);
    }
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.onActionPress}
        accessible
        accessibilityLabel="More options"
        accessibilityHint="Send image, audio, or location"
      >
        <View style={{ marginLeft: 5, marginBottom: 5 }}>
          <Ionicons name="add-circle" size={28} />
        </View>
      </TouchableOpacity>
    );
  }
}

export default connectActionSheet(CustomActions);
