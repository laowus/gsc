import React, { useEffect, useState } from "react";
import { StyleSheet, NativeSyntheticEvent, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import PoetryDao from "@/dao/PoetryDao";
import ScrollViewWithBackToTop from "@/components/ScrollViewWithBackToTop";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Rhesis from "@/model/Rhesis";
import { DYNASTYS } from "@/constants/Utils";
import useAppStore from "@/store/appStore";

// 只保留需要从外部传入的属性
type RhesisListProps = {
  pageSize?: number;
};

const RhesisList: React.FC<RhesisListProps> = ({ pageSize = 20 }) => {
  const router = useRouter();
  const [dbData, setDbData] = useState<Rhesis[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  const appStore = useAppStore();
  const { page, setPage } = appStore;

  // 隐藏原生导航栏
  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
    loadData();
  }, [navigation]);

  const loadData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await PoetryDao.getRhesis(page, pageSize);
      setCount(data.total);
      if (page === 1) {
        setDbData(data.data);
      } else {
        setDbData((prevData) => [...prevData, ...data.data]);
      }
      setHasMore(data.data.length === pageSize);
      setPage(page + 1);
    } catch (error) {
      console.log("查询数据库时出错:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: Rhesis; index: number }) => {
    const previewContent = item.rcontent.slice(0, 50) || "暂无内容";
    return (
      <ThemedView style={styles.card}>
        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText style={styles.circleNumber}>{index + 1} </ThemedText>
          <ThemedText style={styles.titleText}>{item.rcontent}</ThemedText>
        </ThemedView>
        <ThemedView style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
          <ThemedText style={styles.subtitleText}>{`${item.title}`}</ThemedText>
          <ThemedText style={styles.subtitleText}>{`[${DYNASTYS[item.dynastyid]}]${item.writername}`}</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<{ contentOffset: { y: number }; contentSize: { height: number }; layoutMeasurement: { height: number } }>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const yOffset = contentOffset.y;
    const contentHeight = contentSize.height;
    const visibleHeight = layoutMeasurement.height;
    if (yOffset + visibleHeight >= contentHeight - 20 && hasMore && !loading) {
      loadData();
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

  return (
    <SafeAreaView style={{ flex: 1, gap: 5, padding: 10 }}>
      <ThemedView style={[styles.title]}>
        <ThemedText>名句({count})</ThemedText>
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
    flexDirection: "column",
    gap: 10,
    padding: 8,
    borderRadius: 12,
    borderWidth: 0,
    backgroundColor: "#fff",
    marginVertical: 8
  },
  titleText: {
    fontSize: 18,
    color: "red",
    marginLeft: 10
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
  circleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#666",
    backgroundColor: "#666", // 添加背景色实现实心效果
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    color: "#fff" // 修改文字颜色为白色，与背景形成对比
  },
  // 新增返回按钮样式
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
    marginRight: 10
  }
});

export default RhesisList;
