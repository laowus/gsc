import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShowPage() {
  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText type="title">Show Page</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
