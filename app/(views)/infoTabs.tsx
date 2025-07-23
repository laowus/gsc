import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Poetry from "@/model/Poetry";
import ScrollViewWithBackToTop from "@/components/ScrollViewWithBackToTop";
import HtmlParser from "@/components/HtmlParser";
import { StyleSheet, ScrollView } from "react-native";

// 定义 InfoTabs 组件的 props 类型
interface InfoTabsProps {
  poetry: Poetry;
}

const InfoTabs = forwardRef<{ resetIndex: () => void }, InfoTabsProps>(({ poetry }, ref) => {
  const [index, setIndex] = useState(0);
  const infoList = poetry.infos || [];
  const scrollViewRef = useRef<{ scrollTo: (options: { y: number; animated?: boolean }) => void }>(null);

  useEffect(() => {
    setIndex(infoList.length - 1);
  }, [infoList]);

  // 每次 poetry 变化或组件挂载时，将 index 设置为 0
  useEffect(() => {
    setIndex(0);
  }, [poetry]);

  // 监听 infoList[index] 变化，滚动到顶部
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [infoList[index]]);

  // 暴露重置 index 的方法
  useImperativeHandle(ref, () => ({
    resetIndex: () => {
      setIndex(0);
    }
  }));

  return (
    <ThemedView style={[styles.infoTabsContainer]}>
      <ThemedView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.titleScrollView}>
          <ThemedView style={styles.titleContainer}>
            {infoList.map((info, infoIndex) => (
              <ThemedText key={info.infoid} onPress={() => setIndex(infoIndex)} style={[styles.tabText, infoIndex === index && styles.activeTabText]}>
                {info.title}
              </ThemedText>
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>

      {infoList[index] && (
        <ScrollViewWithBackToTop ref={scrollViewRef} style={[styles.scrollView, { marginTop: 10 }]} showsVerticalScrollIndicator={false}>
          <HtmlParser html={infoList[index].content || ""} fontSize={16} indent={0} />
        </ScrollViewWithBackToTop>
      )}
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  infoTabsContainer: {
    flex: 1,
    padding: 0, // 移除所有内边距，让内容更紧凑
    backgroundColor: "#f9f9f9" // 浅灰色背景
  },
  titleScrollView: {
    marginBottom: 5, // 移除底部外边距
    marginHorizontal: 0 // 移除左右外边距
  },
  titleContainer: {
    height: 35,
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#ffffff", // 白色背景
    elevation: 2, // Android 阴影
    shadowColor: "#000", // iOS 阴影
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // 防止换行
    flexWrap: "nowrap"
  },
  tabText: {
    flexShrink: 0, // 防止标签被压缩
    // 减小垂直内边距
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: "center",
    borderRadius: 6,
    fontSize: 16,
    color: "#666666" // 深灰色文字
    //transition: "background-color 0.3s ease" // 过渡动画
  },
  activeTabText: {
    backgroundColor: "#4a90e2", // 漂亮的蓝色
    color: "#ffffff", // 白色文字
    elevation: 1, // Android 阴影
    shadowColor: "#000", // iOS 阴影
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // 保持与 tabText 一致的垂直内边距
    paddingVertical: 8
  },
  scrollView: {
    backgroundColor: "#ffffff", // 白色背景
    borderRadius: 8,
    padding: 10,
    elevation: 2, // Android 阴影
    shadowColor: "#000", // iOS 阴影
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: "auto",
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
    fontSize: 14
  }
});

export default InfoTabs;
