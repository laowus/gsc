import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Poetry from "@/model/Poetry";
import ScrollViewWithBackToTop from "@/components/ScrollViewWithBackToTop";
import HtmlParser from "@/components/HtmlParser";
import { StyleSheet, ScrollView } from "react-native";
import Info from "@/model/Info";
import InfoDao from "@/dao/InfoDao";

const InfoTabs = ({ poetryid }: { poetryid: number }) => {
  const [index, setIndex] = useState(0);
  const [infoList, setInfoList] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<{ scrollTo: (options: { y: number; animated?: boolean }) => void }>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info = await InfoDao.getInfosByIds(poetryid, 1);
        setInfoList(info);
      } catch (error) {
        if (error instanceof Error) {
          console.error("获取额外信息时出错:", error.message);
        } else {
          console.error("获取额外信息时出错: 未知错误", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [poetryid]);

  useEffect(() => {
    setIndex(infoList.length - 1);
  }, [infoList]);

  // 每次 poetry 变化或组件挂载时，将 index 设置为 0
  useEffect(() => {
    setIndex(0);
  }, [poetryid]);

  // 监听 infoList[index] 变化，滚动到顶部
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [infoList[index]]);

  return (
    <ThemedView style={[styles.infoTabsContainer]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ThemedView style={styles.titleContainer}>
          {infoList.map((info, infoIndex) => (
            <ThemedText key={info.infoid} onPress={() => setIndex(infoIndex)} style={[styles.tabText, infoIndex === index && styles.activeTabText]}>
              {info.title}
            </ThemedText>
          ))}
        </ThemedView>
      </ScrollView>

      {infoList[index] && (
        <ScrollViewWithBackToTop ref={scrollViewRef} style={[styles.scrollView, { marginTop: 10 }]} showsVerticalScrollIndicator={false}>
          <HtmlParser html={infoList[index].content || ""} fontSize={16} indent={0} />
        </ScrollViewWithBackToTop>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  infoTabsContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9" // 浅灰色背景
  },

  titleContainer: {
    height: 30,
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#ffffff", // 白色背景
    elevation: 2, // Android 阴影
    shadowColor: "#000", // iOS 阴影
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexWrap: "nowrap"
  },
  tabText: {
    flexShrink: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: "center",
    borderRadius: 6,
    fontSize: 12,
    color: "#666666", // 深灰色文字
    height: 30, // 确保文本垂直居中
    lineHeight: 14 // 大致等于 fontSize
  },
  activeTabText: {
    backgroundColor: "#4a90e2", // 漂亮的蓝色
    color: "#ffffff", // 白色文字
    elevation: 1, // Android 阴影
    shadowColor: "#000", // iOS 阴影
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingVertical: 8,
    fontSize: 12
  },
  scrollView: {
    backgroundColor: "#ffffff", // 白色背景
    borderRadius: 8,
    padding: 10,
    elevation: 2, // Android 阴影
    shadowColor: "#000", // iOS 阴影
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 5 // 确保垂直 ScrollView 顶部没有间距
  },
  backToTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  backToTopText: {
    color: "#ffffff",
    fontSize: 12
  }
});

export default InfoTabs;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
