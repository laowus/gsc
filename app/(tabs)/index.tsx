import { SafeAreaView } from "react-native-safe-area-context";
import PoetryList from "@/app/(views)/poetryList";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, gap: 5, padding: 10 }}>
      <PoetryList />
    </SafeAreaView>
  );
}
