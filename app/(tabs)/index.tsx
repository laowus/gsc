import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import PoetryDao from "@/dao/PoetryDao";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, NativeSyntheticEvent, Platform, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// 引入 ScrollViewWithBackToTop 组件
import ScrollViewWithBackToTop from "@/components/ScrollViewWithBackToTop";

export default function HomeScreen() {
  const router = useRouter();
  const [dbData, setDbData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 标记是否还有更多数据
  const PAGE_SIZE = 20;
  const [totalPoetryCount, setTotalPoetryCount] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    // 调用获取诗歌总数的方法
    fetchTotalPoetryCount();
  }, []);

  const loadData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newData = await PoetryDao.getPoetryByPage(page, PAGE_SIZE);
      setDbData((prevData) => [...prevData, ...newData]);
      // 如果新数据数量小于 PAGE_SIZE，说明没有更多数据了
      setHasMore(newData.length === PAGE_SIZE);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log("查询数据库时出错:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalPoetryCount = async () => {
    try {
      const count = await PoetryDao.getTotalPoetryCount();
      setTotalPoetryCount(count);
    } catch (error) {
      console.error("获取诗歌总数时出错:", error);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // 移除 HTML 标签
    const cleanContent = item.content ? item.content.replace(/<[^>]*>/g, "") : "";
    // 截取前 50 个字符
    const previewContent = cleanContent.slice(0, 50) || "暂无内容";
    return (
      <ThemedView
        key={`${item.poetryid}-${index}`}
        style={[
          styles.card,
          {
            flexDirection: "row",
            gap: 15,
            // 添加阴影效果
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84
          }
        ]}
      >
        {/* 左边区域，占三分之一宽度 */}
        <ThemedView style={{ flex: 1, justifyContent: "center" }}>
          <ThemedText style={[styles.titleText, { marginBottom: 4 }]}>{`${index + 1}、 ${item.title}`}</ThemedText>
          <ThemedText style={styles.subtitleText}>{`${item.writer.dynasty} · ${item.writer.writername}`}</ThemedText>
        </ThemedView>
        {/* 右边区域，占三分之二宽度 */}
        <ThemedText style={[styles.contentText, { flex: 2 }]}>
          {`${previewContent} ... `}
          <ThemedText
            style={styles.readMoreText}
            onPress={() => {
              // 导航到新的路由页面并传递 poetryid
              console.log("传递的 poetryid:", item.poetryid);
              router.push({
                pathname: "/poetryDetail",
                params: { poetryid: item.poetryid }
              });
            }}
          >
            {` >>> `}
          </ThemedText>
        </ThemedText>
      </ThemedView>
    );
  };

  // const renderFooter = () => {
  //   if (loading && hasMore) {
  //     return (
  //       <ThemedView style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
  //         <ThemedText>加载中...</ThemedText>
  //       </ThemedView>
  //     );
  //   }
  //   return null;
  // };

  // 处理滚动事件，判断是否滚动到底部
  const handleScroll = (event: NativeSyntheticEvent<{ contentOffset: { y: number }; contentSize: { height: number }; layoutMeasurement: { height: number } }>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const yOffset = contentOffset.y;
    const contentHeight = contentSize.height;
    const visibleHeight = layoutMeasurement.height;

    if (yOffset + visibleHeight >= contentHeight - 20 && hasMore && !loading) {
      loadData();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.title}>
        <Ionicons name="cellular-outline" size={24} color="#87CEEB" />
        {/* 显示诗歌总数 */}
        <ThemedText>全部({totalPoetryCount !== null ? totalPoetryCount : "加载中..."})</ThemedText>
      </ThemedView>
      <ScrollViewWithBackToTop onScroll={handleScroll} scrollEventThrottle={16} showThreshold={100}>
        {dbData.map((item, index) => renderItem({ item, index }))}
        {/* {renderFooter()} */}
      </ScrollViewWithBackToTop>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    flex: 1,
    flexDirection: "column",
    gap: 5,
    marginBottom: 0
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    color: "#87CEEB",
    gap: 10
  },
  card: {
    padding: 16,
    borderRadius: 12, // 增加圆角
    borderWidth: 0, // 移除边框
    backgroundColor: "#fff",
    marginVertical: 8 // 增加垂直间距
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333"
  },
  subtitleText: {
    fontSize: 12,
    color: "#666"
  },
  contentText: {
    fontSize: 14,
    color: "#444"
  },
  readMoreText: {
    color: "#007AFF",
    fontSize: 14
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20
  }
});
