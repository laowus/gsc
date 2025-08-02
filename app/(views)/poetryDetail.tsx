import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Poetry from "@/model/Poetry";
import InfoTabs from "./infoTabs";
import HtmlParser from "@/components/HtmlParser";
import ScrollViewWithBackToTop from "@/components/ScrollViewWithBackToTop";
import TypeDao from "@/dao/TypeDao";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";

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
  const [isExpanded, setIsExpanded] = useState(false); // 控制展开折叠状态

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

  const fullText = typeNames.join(" / ");
  const shortText = fullText.length > 20 ? fullText.slice(0, 20) + "..." : fullText;

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>加载中...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.title}>{`${poetry.title}  `}</ThemedText>
        <ThemedView style={styles.writerInfoContainer}>
          <ThemedText style={styles.writerInfo}>{`${poetry.writer.dynastyname} * ${poetry.writer.writername} (${poetry.kindname})`}</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ThemedText style={styles.typeIdText}>{typeNames.join("  /  ")}</ThemedText>
          </ScrollView>
        </ThemedView>
        <ScrollViewWithBackToTop>
          <HtmlParser html={poetry.content || ""} fontSize={20} indent={["诗", "文言文"].includes(poetry.kindname) ? 0 : 8} center={poetry.kindname === "诗"} />
        </ScrollViewWithBackToTop>
      </ThemedView>
      <ThemedView style={styles.infoTabsContainer}>
        <InfoTabs poetryid={poetry.poetryid} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 5
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    borderRadius: 8,
    gap: 10,
    textAlign: "center"
  },
  contentContainer: {
    maxHeight: screenHeight * 0.5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    gap: 5
  },
  writerInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  writerInfo: {
    fontSize: 12,
    marginRight: 15
  },
  typeIdText: {
    fontSize: 12,
    color: COLORS.primary
  },
  infoTabsContainer: {
    flex: 1,
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
