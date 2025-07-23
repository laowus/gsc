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
import ScrollViewWithBackToTop from "@/components/ScrollViewWithBackToTop";

// 获取屏幕高度
const { height: screenHeight } = Dimensions.get("window");

// 定义颜色常量
const COLORS = {
  primary: "#2c3e50",
  secondary: "#7f8c8d",
  background: "#ecf0f1",
  text: "#2d3436"
};

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
          navigation.setOptions({ title: `${updatedPoetry.title} (${updatedPoetry.kindname}) ` });
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
    <ThemedView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ThemedText style={styles.writerInfo}>{`${poetry.writer.dynasty} * ${poetry.writer.writername} `}</ThemedText>
      <ThemedView style={styles.contentContainer}>
        <ScrollViewWithBackToTop>
          <HtmlParser html={poetry.content || ""} fontSize={20} indent={poetry.kindname === "诗" ? 0 : 8} />
        </ScrollViewWithBackToTop>
      </ThemedView>
      {poetry.infos && (
        <ThemedView style={styles.infoTabsContainer}>
          <InfoTabs ref={infoTabsRef} poetry={poetry} />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 10
  },
  writerInfo: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold"
  },
  contentContainer: {
    maxHeight: screenHeight * 0.4,
    height: "auto",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 4, // Android 阴影
    shadowColor: COLORS.secondary, // iOS 阴影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },

  poetryContent: {
    color: COLORS.text,
    lineHeight: 20
  },
  infoTabsContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 4, // Android 阴影
    shadowColor: COLORS.secondary, // iOS 阴影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  }
});
