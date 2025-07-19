import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import PoetryDao from "@/dao/PoetryDao";
import InfoDao from "@/dao/InfoDao";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Poetry from "@/model/Poetry";
import InfoTabs from "./infoTabs";
import HtmlParser from "@/components/HtmlParser";

// 获取屏幕高度
const { height: screenHeight } = Dimensions.get("window");

export default function PoetryDetail() {
  const params = useLocalSearchParams();
  const poetryid = typeof params.poetryid === "string" ? parseInt(params.poetryid, 10) : NaN;
  const [poetry, setPoetry] = useState<Poetry | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const infoTabsRef = useRef<{ resetIndex: () => void }>(null);

  useEffect(() => {
    const fetchPoetryContent = async () => {
      try {
        const _poetry = await PoetryDao.getPoetryById(poetryid);
        if (_poetry) {
          const updatedPoetry = { ..._poetry };
          const infoList = await InfoDao.getInfosByIds(updatedPoetry.poetryid, 1);
          updatedPoetry.infos = infoList;
          setPoetry(updatedPoetry);
          navigation.setOptions({ title: `${updatedPoetry.title} ` });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("获取诗歌内容时出错:", error.message);
        } else {
          console.error("获取诗歌内容时出错: 未知错误", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPoetryContent();
    // 当 poetryid 变化时，重置 infoTabs 的 index
    if (infoTabsRef.current) {
      infoTabsRef.current.resetIndex();
    }
  }, [poetryid]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>加载中...</ThemedText>
      </ThemedView>
    );
  }

  if (!poetry) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>未找到诗歌内容</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { flex: 1 }]}>
      <ThemedView style={{ alignItems: "center", justifyContent: "flex-start" }}>
        <ThemedText style={styles.title}>{`(${poetry.writer.dynasty} ) ${poetry.writer.writername}`}</ThemedText>
        <ThemedView style={{ maxHeight: screenHeight * 0.4, overflow: "scroll" }}>
          <HtmlParser html={poetry.content || ""} fontSize={24} indent={8} />
        </ThemedView>
      </ThemedView>
      {poetry.infos && (
        <ThemedView style={{ flex: 1 }}>
          <InfoTabs ref={infoTabsRef} poetry={poetry} />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  title: {
    fontSize: 12,
    alignSelf: "flex-start"
  },
  paragraph: {
    width: "100%",
    marginBottom: 8,
    textAlign: "center"
  },
  paragraphText: {
    fontSize: 20
  }
});
