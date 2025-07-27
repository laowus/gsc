import PoetryDetail from "@/app/(views)/poetryDetail";
import useAppStore from "@/store/appStore";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import PoetryDao from "@/dao/PoetryDao";
import { useEffect, useState } from "react";
import Poetry from "@/model/Poetry";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [poetryList, setPoetryList] = useState<Poetry[]>([]);
  const [currentPoetry, setCurrentPoetry] = useState<Poetry | null>(null);
  const params = useAppStore((state) => state.params);
  const curPid = useAppStore((state) => state.curPid);

  const nextPid = () => {
    if (curPid < poetryList.length - 1) {
      useAppStore.setState({ curPid: curPid + 1 });
      setCurrentPoetry(poetryList[curPid + 1]);
    }
  };

  const prevPid = () => {
    if (curPid > 0) {
      useAppStore.setState({ curPid: curPid - 1 });
      setCurrentPoetry(poetryList[curPid - 1]);
    }
  };

  // 仅在 params 变化时重新获取诗歌列表
  useEffect(() => {
    PoetryDao.getAllPoetry(params).then((pList) => {
      setPoetryList(pList);
      if (pList.length > 0 && curPid < pList.length) {
        const currentPoetry = pList[curPid];
        setCurrentPoetry(currentPoetry);
      }
    });
  }, [params]);

  // 当 curPid 变化时，从已有列表中获取对应诗歌
  useEffect(() => {
    if (poetryList.length > 0 && curPid < poetryList.length) {
      setCurrentPoetry(poetryList[curPid]);
    }
  }, [curPid, poetryList]);

  return (
    currentPoetry && (
      <SafeAreaView style={{ flex: 1, gap: 5, padding: 10 }}>
        <ThemedView style={[styles.title]}>
          <TouchableOpacity onPress={prevPid}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
          <ThemedText
            style={{
              flex: 1, // 占据剩余空间
              fontSize: 12, // 减小字体大小
              textAlign: "center" // 文本居中
            }}
          >
            {curPid + 1} / {poetryList.length}
          </ThemedText>
          <TouchableOpacity onPress={nextPid}>
            <ThemedText style={styles.backButtonText}> →</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push({ pathname: "/(views)/showPage" })}>
            <Ionicons name="ellipsis-vertical" size={20} />
          </TouchableOpacity>
        </ThemedView>
        <PoetryDetail poetry={currentPoetry!} />
      </SafeAreaView>
    )
  );
}
const styles = StyleSheet.create({
  title: {
    padding: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "space-between"
  }, // 新增返回按钮样式
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
    marginRight: 10
  }
});
