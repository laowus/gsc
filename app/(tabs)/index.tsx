import PoetryDetail from "@/app/(views)/poetryDetail";
import useAppStore from "@/store/appStore";
import { StyleSheet, TouchableOpacity } from "react-native";
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
  const barHeight = useAppStore((state) => state.barHeight);

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
    // const params = [0, 0, 0, 0, 0];
    PoetryDao.getAllPoetry(params).then((pList) => {
      setPoetryList(pList);
      if (pList.length > 0 && curPid < pList.length) {
        const currentPoetry = pList[curPid];
        setCurrentPoetry(currentPoetry);
      }
    });
  }, [params]);

  useEffect(() => {
    if (poetryList.length > 0 && curPid < poetryList.length) {
      setCurrentPoetry(poetryList[curPid]);
    }
  }, [curPid, poetryList]);

  return (
    currentPoetry && (
      <ThemedView style={{ flex: 1, gap: 5, paddingTop: barHeight }}>
        <ThemedView style={[styles.title]}>
          <TouchableOpacity onPress={prevPid}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
          <ThemedText>
            {curPid + 1} / {poetryList.length}
          </ThemedText>
          <ThemedText>
            <TouchableOpacity onPress={nextPid}>
              <ThemedText style={styles.backButtonText}> →</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push({ pathname: "/(views)/setLike" })}>
              <Ionicons name="ellipsis-vertical" size={20} />
            </TouchableOpacity>
          </ThemedText>
        </ThemedView>
        <PoetryDetail poetry={currentPoetry!} />
      </ThemedView>
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
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
    marginRight: 10
  }
});
