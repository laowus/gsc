import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function TabTwoScreen() {
  return <ThemedText type="title">诗歌</ThemedText>;
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute"
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8
  }
});
