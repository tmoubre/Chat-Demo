// CustomActions.js
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";

class CustomActions extends React.Component {
  onActionPress = () => {
    const options = [
      "Select from Library",
      "Take Photo",
      "Share Location",
      "Record Audio",
      "Cancel",
    ];
    const cancelButtonIndex = 4;

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
        }
      }
    );
  };

  pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access library was denied."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.cancelled) {
      this.uploadFile(result.uri);
    }
  };

  takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access camera was denied."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.cancelled) {
      this.uploadFile(result.uri);
    }
  };

  shareLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access location was denied."
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      this.props.onSend([
        {
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
      ]);
    }
  };

  uploadFile = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const name = `${this.props.user._id}-${Date.now()}.jpg`;
      const storageRef = ref(storage, name);

      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      this.props.onSend([{ image: downloadUrl }]);
    } catch (error) {
      Alert.alert("Upload failed", error.message);
    }
  };

  recordAudio = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert(
          "Permission required",
          "Permission to access microphone was denied."
        );
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
            this.uploadAudio(uri);
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Recording error", err.message);
    }
  };

  uploadAudio = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const name = `${this.props.user._id}-${Date.now()}.m4a`;
      const storageRef = ref(storage, name);

      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      this.props.onSend([{ audio: url }]);
    } catch (error) {
      Alert.alert("Upload failed", error.message);
    }
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.onActionPress}
        accessible
        accessibilityLabel="More options"
        accessibilityHint="Let’s you send an image, audio or share your location"
      >
        <View style={{ marginLeft: 5, marginBottom: 5 }}>
          <Ionicons name="add-circle" size={28} />
        </View>
      </TouchableOpacity>
    );
  }
}

export default connectActionSheet(CustomActions);
