import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import PoetryDao from "@/dao/PoetryDao";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, Modal, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [dbData, setDbData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 标记是否还有更多数据
  const PAGE_SIZE = 20;
  // 新增状态用于存储诗歌总数
  const [totalPoetryCount, setTotalPoetryCount] = useState<number | null>(null);
  // 新增状态用于控制 Modal 显示与隐藏
  const [modalVisible, setModalVisible] = useState(false);
  // 新增状态用于存储当前要显示的诗歌内容
  const [selectedContent, setSelectedContent] = useState("");

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
      <ThemedView key={`${item.poetryid}-${index}`} style={[styles.card, { flexDirection: "row", gap: 15 }]}>
        {/* 左边区域，占三分之一宽度 */}
        <ThemedText style={{ flex: 1 }}>
          <ThemedText style={{ fontWeight: "bold" }}>{`${index + 1}、 ${item.title} \n`}</ThemedText>
          <ThemedText style={{ fontSize: 12 }}>{`${item.writer.dynasty} *  ${item.writer.writername}`}</ThemedText>
        </ThemedText>
        {/* 右边区域，占三分之二宽度 */}
        <ThemedText style={{ flex: 2, fontSize: 12 }}>
          {`${previewContent} ... `}{" "}
          <ThemedText
            style={{
              color: "blue",
              fontSize: 12
            }}
            onPress={() => {
              // 导航到新的路由页面并传递 poetryid
              console.log("传递的 poetryid:", item.poetryid);
              router.push({
                pathname: "/(modals)/poetryDetail",
                params: { poetryid: item.poetryid }
              });
            }}
          >
            {`>>>`}
          </ThemedText>
        </ThemedText>
      </ThemedView>
    );
  };

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
      {/* Modal 组件 */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedText style={styles.modalTitle}>诗歌全文</ThemedText>
          <ThemedText style={styles.modalContent}>{selectedContent}</ThemedText>
          <Button title="关闭" onPress={() => setModalVisible(false)} />
        </ThemedView>
      </Modal>
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
