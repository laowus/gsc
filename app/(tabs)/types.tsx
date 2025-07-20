import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, ScrollView, TouchableOpacity, NativeSyntheticEvent } from "react-native";
export default function TabTwoScreen() {
  return (
    <SafeAreaView>
      <ThemedView style={styles.title}>
        <Ionicons name="cellular-outline" size={24} color="#87CEEB" />
        <ThemedText>全部</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
    flexDirection: "column",
    gap: 10
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    color: "#87CEEB",
    gap: 10
  }
});
