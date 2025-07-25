import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.safeview}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">名句</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
    gap: 5,
    padding: 10,
    backgroundColor: "red"
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  }
});
