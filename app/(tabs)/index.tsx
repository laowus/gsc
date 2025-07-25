import PoetryDetail from "@/app/(views)/poetryDetail";
import usePoetryStore from "@/store/poetryStore";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  // 从 Zustand store 中获取当前诗歌
  const currentPoetry = usePoetryStore((state) => state.currentPoetry);

  return (
    <SafeAreaView style={{ flex: 1, gap: 5, padding: 10 }}>
      <ThemedView style={[styles.title]}>
        <ThemedText>{currentPoetry.title}</ThemedText>
      </ThemedView>
      <PoetryDetail poetry={currentPoetry} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  }, // 新增返回按钮样式
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
    marginRight: 10
  }
});
