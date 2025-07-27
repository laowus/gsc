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
    // 每次 poetry 变化或组件挂载时，将 index 设置为 0
    console.log("poetryid", poetryid);
    console.log("index", index);
    setIndex(0);
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
        <ScrollViewWithBackToTop ref={scrollViewRef} style={[styles.scrollView]} showsVerticalScrollIndicator={false}>
          <HtmlParser html={infoList[index].content || ""} fontSize={12} indent={0} />
        </ScrollViewWithBackToTop>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  infoTabsContainer: {
    flex: 1
  },

  titleContainer: {
    height: 40,
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#ffffff" // 白色背景
  },
  tabText: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    textAlign: "center",
    borderRadius: 6,
    fontSize: 12,
    color: "#666666", // 深灰色文字
    height: 30,
    lineHeight: 12
  },
  activeTabText: {
    backgroundColor: "#4a90e2", // 漂亮的蓝色
    color: "#ffffff", // 白色文字
    paddingVertical: 8,
    fontSize: 12
  },
  scrollView: {
    backgroundColor: "#ffffff", // 白色背景
    borderRadius: 8,
    padding: 8,
    height: "100%",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
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
