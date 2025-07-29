import PoetryDetail from "@/app/(views)/poetryDetail";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import PoetryDao from "@/dao/PoetryDao";
import { useNavigation } from "@react-navigation/native";
import Poetry from "@/model/Poetry";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 定义静态样式
const styles = StyleSheet.create({
  titleBase: {
    position: "absolute",
    padding: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    left: 10,
    zIndex: 999, // 设置较高的 zIndex 值，确保显示在最顶层
    backgroundColor: "transparent" // 添加背景透明样式
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold" // 添加字体加粗样式
  }
});

export default function PoetryScreen() {
  const params = useLocalSearchParams();
  const poetryid = typeof params.poetryid === "string" ? parseInt(params.poetryid, 10) : NaN;
  const [poetry, setPoetry] = useState<Poetry | null>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={[styles.titleBase, { top: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <PoetryDetail poetry={poetry} />
      </SafeAreaView>
    )
  );
}
