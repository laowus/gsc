import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import PoetryDao from "@/dao/PoetryDao";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 引入 SafeAreaView

export default function HomeScreen() {
  const [dbData, setDbData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 标记是否还有更多数据
  const PAGE_SIZE = 20;
  // 新增状态用于存储诗歌总数
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

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    // 结合 index 生成唯一 key
    <ThemedView key={`${item.poetryid}-${index}`} style={styles.card}>
      <ThemedText>
        {/* 使用 \n 换行 */}
        {`${index + 1}、 ${item.title}\n${item.writer.dynasty} *  ${item.writer.writername}`}
      </ThemedText>
    </ThemedView>
  );

  const renderFooter = () => {
    if (loading && hasMore) {
      return (
        <ThemedView style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
          <ThemedText>加载中...</ThemedText>
        </ThemedView>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.title}>
        <Ionicons name="cellular-outline" size={24} color="#87CEEB" />
        {/* 显示诗歌总数 */}
        <ThemedText>全部({totalPoetryCount !== null ? totalPoetryCount : "加载中..."})</ThemedText>
      </ThemedView>
      <FlatList
        data={dbData}
        renderItem={renderItem}
        // 结合 index 生成唯一 key
        keyExtractor={(item, index) => `${item.poetryid}-${index}`}
        onEndReached={loadData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    flexDirection: "column",
    gap: 4
  }
});
