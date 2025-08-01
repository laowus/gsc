import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, FlatList, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import PoetryDao from "@/dao/PoetryDao";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Rhesis from "@/model/Rhesis";
import { DYNASTYS } from "@/constants/Utils";
import useAppStore from "@/store/appStore";
import SafeView from "@/components/SafeView";

const RhesisList = () => {
  const router = useRouter();
  const [dbData, setDbData] = useState<Rhesis[]>([]);
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  const flatListRef = useRef<FlatList<Rhesis>>(null);
  const { pos, setPos } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // 隐藏原生导航栏
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    loadData();
  }, []);

  const handleContentSizeChange = useCallback(() => {
    // 仅在未初始化且有滚动位置时执行滚动，并标记为已初始化
    if (!isInitialized && flatListRef.current && pos !== undefined) {
      scrollToPos(pos);
      setIsInitialized(true);
    }
  }, [isInitialized, pos]);

  const scrollToPos = (pos: number) => {
    if (flatListRef.current) {
      console.log("自动滚动到", pos);
      flatListRef.current.scrollToOffset({ offset: pos, animated: false });
    }
  };

  const loadData = async () => {
    try {
      const data = await PoetryDao.getAllRhesis();
      setCount(data.length);
      setDbData(data);
    } catch (error) {
      console.log("查询数据库时出错:", error);
    }
  };

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = event.nativeEvent.contentOffset.y;
      console.log("手动滚动到", offset);
      setPos(offset);
    },
    [setPos]
  );

  const renderItem = ({ item, index }: { item: Rhesis; index: number }) => {
    return (
      <ThemedView style={styles.card}>
        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText style={styles.circleNumber}>{index + 1} </ThemedText>
          <ThemedText style={styles.titleText}>{item.rcontent}</ThemedText>
        </ThemedView>
        <ThemedView style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 8 }}>
          <ThemedText style={styles.subtitleText}>{`${item.title}`}</ThemedText>
          <ThemedText style={styles.subtitleText}>{`[${DYNASTYS[item.dynastyid]}]${item.writername}`}</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <SafeView>
      <ThemedView style={[styles.title]}>
        <ThemedText>名句({count})</ThemedText>
      </ThemedView>
      <FlatList ref={flatListRef} data={dbData} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} onMomentumScrollEnd={handleScrollEnd} scrollEventThrottle={100} onContentSizeChange={handleContentSizeChange} />
    </SafeView>
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
    padding: 16, // 增加内边距
    borderRadius: 16, // 增大圆角半径
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 16, // 添加水平间距
    elevation: 4, // Android 阴影
    shadowColor: "#000", // iOS 阴影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  titleText: {
    flex: 1,
    fontSize: 20, // 增大字体大小
    color: "red", // 调整文本颜色
    marginLeft: 12,
    fontWeight: "500", // 添加字体粗细
    paddingRight: 12
  },
  subtitleText: {
    fontSize: 14, // 增大字体大小
    color: "#666"
  },
  circleNumber: {
    width: 28, // 增大圆圈大小
    height: 28,
    borderRadius: 14,
    borderWidth: 0,
    backgroundColor: "#4285f4", // 更改背景颜色
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 14,
    color: "#fff"
  },
  // 新增返回按钮样式
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
    marginRight: 10
  }
});

export default RhesisList;
