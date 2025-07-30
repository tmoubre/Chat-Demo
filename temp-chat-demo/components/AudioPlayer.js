// AudioPlayer.js
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function AudioPlayer({ uri }) {
  const [sound, setSound] = useState();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const togglePlay = async () => {
    if (!sound) {
      const { sound: s } = await Audio.Sound.createAsync({ uri });
      setSound(s);
      await s.playAsync();
      setPlaying(true);
      s.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setPlaying(false);
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
