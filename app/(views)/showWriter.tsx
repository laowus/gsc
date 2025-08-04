import SafeView from "@/components/SafeView";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import { Button, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import WriterDao from "@/dao/WriterDao";
import Writer from "@/model/Writer";
import { ThemedView } from "@/components/ThemedView";
import InfoTabs from "./infoTabs";
import ScrollViewWithBackToTop from "@/components/ScrollViewWithBackToTop";
import HtmlParser from "@/components/HtmlParser";
import { SafeAreaView } from "react-native-safe-area-context";
// 定义颜色常量
const COLORS = {
  primary: "#2c3e50",
  secondary: "#7f8c8d",
  background: "#ecf0f1",
  text: "#2d3436"
};
// 获取屏幕高度
const { height: screenHeight } = Dimensions.get("window");

export default function showWriterScreen() {
  const params = useLocalSearchParams();
  const [writer, setWriter] = useState<Writer>();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
    const fetchWriter = async () => {
      try {
        const writer = await WriterDao.getWriterByWid(Number(params.writerid));
        setWriter(writer);
      } catch (error) {
        console.error("获取作者详情失败:", error);
      }
    };
    fetchWriter();
  }, [params.writerid]);
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.title}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ThemedText style={styles.backButtonText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText>{writer?.writername}</ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: "/poetryList", params: { writerid: writer?.writerid, writername: writer?.writername } })}>
          <ThemedText style={styles.buttonText}>TA的作品</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        <ScrollViewWithBackToTop>
          <HtmlParser html={writer?.summary || ""} fontSize={20} />
        </ScrollViewWithBackToTop>
      </ThemedView>
      <ThemedView style={styles.infoTabsContainer}>
        <InfoTabs paraid={writer?.writerid || 1} isPoetry={false} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 5,
    padding: 10
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10 // 设置圆角半径
  },
  buttonText: {
    lineHeight: 12,
    color: "white",
    fontSize: 12,
    textAlign: "center"
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
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
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold" // 添加字体加粗样式
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
