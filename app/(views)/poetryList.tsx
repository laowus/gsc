import React, { useEffect, useState } from "react";
import { StyleSheet, NativeSyntheticEvent, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import PoetryDao from "@/dao/PoetryDao";
import ScrollViewWithBackToTop from "@/components/ScrollViewWithBackToTop";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// 只保留需要从外部传入的属性
type PoetryListProps = {
  initialQueryParams?: Record<string, any>;
  pageSize?: number;
  isNested?: boolean; // 新增属性，用于判断是否被嵌套
};

const PoetryList: React.FC<PoetryListProps> = ({ initialQueryParams = {}, pageSize = 20, isNested = false }) => {
  const params = useLocalSearchParams();
  // 提取 writername 和 typename
  const { writername, typename, ...restParams } = params;

  const router = useRouter();
  const [dbData, setDbData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPoetryCount, setTotalPoetryCount] = useState<number | null>(null);
  const [queryParams, setQueryParams] = useState(restParams);
  const navigation = useNavigation();

  // 隐藏原生导航栏
  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
    loadData(queryParams);
  }, [queryParams, navigation]);

  const loadData = async (params?: Record<string, any>) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data, total } = await PoetryDao.getPoetryDataAndCount(page, pageSize, params);
      if (page === 1) {
        setDbData(data);
      } else {
        setDbData((prevData) => [...prevData, ...data]);
      }
      setTotalPoetryCount(total);
      setHasMore(data.length === pageSize);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log("查询数据库时出错:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const cleanContent = item.content ? item.content.replace(/<[^>]*>/g, "") : "";
    const previewContent = cleanContent.slice(0, 50) || "暂无内容";
    return (
      <ThemedView
        key={`${item.poetryid}-${index}`}
        style={[
          styles.card,
          {
            flexDirection: "row",
            gap: 15,
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84
          }
        ]}
      >
        <ThemedView style={{ flex: 1, justifyContent: "center" }}>
          <ThemedText style={[styles.titleText, { marginBottom: 4 }]}>{`${index + 1}、 ${item.title}`}</ThemedText>
          <ThemedText style={styles.subtitleText}>{`${item.writer.dynasty} · ${item.writer.writername}`}</ThemedText>
        </ThemedView>
        <ThemedText style={[styles.contentText, { flex: 2 }]}>
          {`${previewContent} ... `}
          <ThemedText
            style={styles.readMoreText}
            onPress={() => {
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

  const handleScroll = (event: NativeSyntheticEvent<{ contentOffset: { y: number }; contentSize: { height: number }; layoutMeasurement: { height: number } }>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const yOffset = contentOffset.y;
    const contentHeight = contentSize.height;
    const visibleHeight = layoutMeasurement.height;
    if (yOffset + visibleHeight >= contentHeight - 20 && hasMore && !loading) {
      loadData(queryParams);
    }
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

  // 确定要显示的标题文本
  let titleText = "";
  if (typename) {
    titleText = typename.toString();
  } else if (writername) {
    titleText = writername.toString();
  }

  return (
    <SafeAreaView style={{ flex: 1, gap: 5, padding: 10 }}>
      <ThemedView style={[styles.title]}>
        {!isNested && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
        )}
        <ThemedText>{isNested ? `全部(${totalPoetryCount !== null ? totalPoetryCount : "加载中..."})` : `${titleText} (${totalPoetryCount !== null ? totalPoetryCount : "加载中..."})`} </ThemedText>
      </ThemedView>
      <ScrollViewWithBackToTop onScroll={handleScroll} scrollEventThrottle={16} showThreshold={100}>
        {dbData.map((item, index) => renderItem({ item, index }))}
        {renderFooter()}
      </ScrollViewWithBackToTop>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 0,
    backgroundColor: "#fff",
    marginVertical: 8
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
  // 新增返回按钮样式
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
    marginRight: 10
  }
});

export default PoetryList;
