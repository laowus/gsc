import PoetryDetail from "@/app/(views)/poetryDetail";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import PoetryDao from "@/dao/PoetryDao"; // 假设 PoetryDao 是数据库操作类
import { useNavigation } from "@react-navigation/native";
import Poetry from "@/model/Poetry";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PoetryScreen() {
  const params = useLocalSearchParams();
  const poetryid = typeof params.poetryid === "string" ? parseInt(params.poetryid, 10) : NaN;
  const [poetry, setPoetry] = useState<Poetry | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
    const fetchPoetryContent = async () => {
      try {
        const _poetry = await PoetryDao.getPoetryById(poetryid);
        if (_poetry) {
          const updatedPoetry = { ..._poetry };
          setPoetry(updatedPoetry);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("获取诗歌内容时出错:", error.message);
        } else {
          console.error("获取诗歌内容时出错: 未知错误", error);
        }
      }
    };

    fetchPoetryContent();
  }, [poetryid, navigation]);

  return (
    poetry && (
      <SafeAreaView style={{ flex: 1, gap: 5, padding: 10 }}>
        <ThemedView style={[styles.title]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
          <ThemedText>{poetry.title}</ThemedText>
        </ThemedView>
        <PoetryDetail poetry={poetry} />
      </SafeAreaView>
    )
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
