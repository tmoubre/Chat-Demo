// AudioPlayer.js
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

export default function AudioPlayer({ uri }) {
  if (Platform.OS === "web") {
    return (
      <View style={{ padding: 8 }}>
        <audio controls src={uri} style={{ width: 150 }} />
      </View>
    );
  }

  const [sound, setSound] = useState();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const togglePlay = async () => {
    if (!sound) {
      const { sound: s } = await Audio.Sound.createAsync({ uri });
      setSound(s);
      await s.playAsync();
      setPlaying(true);
      s.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlaying(false);
          s.unloadAsync();
          setSound(null);
        }
      });
    } else if (playing) {
      await sound.pauseAsync();
      setPlaying(false);
    } else {
      await sound.playAsync();
      setPlaying(true);
    }
  };

  return (
    <TouchableOpacity onPress={togglePlay} style={{ padding: 8 }}>
      <Text>{playing ? "⏸️ Pause" : "▶️ Play"} Audio</Text>
    </TouchableOpacity>
  );
}
