import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Poetry from "@/model/Poetry";
import InfoTabs from "./infoTabs";
import HtmlParser from "@/components/HtmlParser";
import ScrollViewWithBackToTop from "@/components/ScrollViewWithBackToTop";
import TypeDao from "@/dao/TypeDao";

// 获取屏幕高度
const { height: screenHeight } = Dimensions.get("window");

// 定义颜色常量
const COLORS = {
  primary: "#2c3e50",
  secondary: "#7f8c8d",
  background: "#ecf0f1",
  text: "#2d3436"
};

type TypeName = {
  typeid: number;
  typename: string;
};

// 传递一个poetry: Poetry 实体对象
export default function PoetryDetail({ poetry }: { poetry: Poetry }) {
  const [typeNames, setTypeNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypeNames = async () => {
      try {
        const typeNames: TypeName[] = (await TypeDao.getTypeNamByIds(poetry.typeid)) as TypeName[];
        const names = typeNames.map((item) => item.typename);
        setTypeNames(names);
      } catch (error) {
        if (error instanceof Error) {
          console.error("获取类型名称时出错:", error.message);
        } else {
          console.error("获取类型名称时出错: 未知错误", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTypeNames();
  }, [poetry.poetryid]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>加载中...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ThemedView style={styles.writerInfoContainer}>
        <ThemedText style={styles.writerInfo}>{`${poetry.writer.dynasty} * ${poetry.writer.writername} `}</ThemedText>
        <ThemedText style={styles.typeIdText}>{typeNames.join(" / ")}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        <ScrollViewWithBackToTop>
          <HtmlParser html={poetry.content || ""} fontSize={20} indent={poetry.kindname === "诗" ? 0 : 8} />
        </ScrollViewWithBackToTop>
      </ThemedView>
      <ThemedView style={styles.infoTabsContainer}>
        <InfoTabs poetryid={poetry.poetryid} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // 样式保持不变
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  noTitle: {
    // 确保 flex 布局
    flexDirection: "row",
    // 让元素均匀分布
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 24,
    fontWeight: "bold",
    padding: 14,
    borderRadius: 8,
    gap: 10
  },
  container: {
    flex: 1,
    padding: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 10
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
    marginRight: 10
  },
  writerInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    marginBottom: 10
  },
  writerInfo: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold"
  },
  typeIdText: {
    fontSize: 14,
    color: COLORS.primary,
    backgroundColor: "#fff",
    borderRadius: 12
  },
  contentContainer: {
    maxHeight: screenHeight * 0.4,
    height: "auto",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  poetryContent: {
    color: COLORS.text,
    lineHeight: 20
  },
  like: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: "hidden",
    marginTop: 10
  },
  likeText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    textOverflow: "ellipsis"
  },
  infoTabsContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    fontSize: 12
  }
});
