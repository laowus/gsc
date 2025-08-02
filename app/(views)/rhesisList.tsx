import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, FlatList, View, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import PoetryDao from "@/dao/PoetryDao";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Rhesis from "@/model/Rhesis";
import { DYNASTYS } from "@/constants/Utils";
import SafeView from "@/components/SafeView";

const RhesisList = () => {
  const router = useRouter();
  const [dbData, setDbData] = useState<Rhesis[]>([]);
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  const flatListRef = useRef<FlatList<Rhesis>>(null);
  const [inputIndex, setInputIndex] = useState(""); // 用于存储用户输入的索引

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await PoetryDao.getAllRhesis();
      setCount(data.length);
      setDbData(data);
    } catch (error) {
      console.log("查询数据库时出错:", error);
    }
  };

  const renderItem = ({ item, index }: { item: Rhesis; index: number }) => {
    return (
      <ThemedView style={styles.card}>
        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText style={styles.circleNumber}>{index + 1} </ThemedText>
          <ThemedText
            style={styles.titleText}
            onPress={() => {
              console.log("点击事件触发，准备跳转");
              router.push({
                pathname: "/showPoetry",
                params: { poetryid: item.poetryid }
              });
            }}
          >
            {item.rcontent}
          </ThemedText>
        </ThemedView>
        <ThemedView style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 8 }}>
          <ThemedText style={styles.subtitleText}>{`${item.title}`}</ThemedText>
          <ThemedText style={styles.subtitleText}>{`[${DYNASTYS[item.dynastyid]}]${item.writername}`}</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  };

  const scrollToIndex = () => {
    const index = parseInt(inputIndex, 10) + 2;
    if (!isNaN(index) && flatListRef.current && index >= 0 && index < dbData.length) {
      flatListRef.current.scrollToIndex({
        index: index,
        animated: true
      });
    }
  };

  return (
    <SafeView>
      <ThemedView style={[styles.title]}>
        <ThemedText>名句({count})</ThemedText>
        <View style={styles.scrollButton}>
          <ThemedText onPress={scrollToIndex} style={{ textAlign: "center", color: "#007AFF" }}>
            跳转
          </ThemedText>
          <TextInput style={styles.input} placeholder="序号" value={inputIndex} onChangeText={setInputIndex} keyboardType="numeric" />
        </View>
      </ThemedView>
      <FlatList
        ref={flatListRef}
        data={dbData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.poetryid}-${index}`}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index
        })}
        decelerationRate="fast" // 加快滚动减速
      />
    </SafeView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20, // 减小字体大小
    fontWeight: "bold",
    padding: 8, // 减小内边距
    borderRadius: 6, // 减小圆角半径
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8, // 减小间距
    elevation: 3, // 减小阴影强度
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginHorizontal: 12 // 减小水平间距
  },
  card: {
    flexDirection: "column",
    gap: 8, // 减小间距
    padding: 12, // 减小内边距
    borderRadius: 10, // 减小圆角半径
    backgroundColor: "#fff",
    marginVertical: 6, // 减小垂直间距
    marginHorizontal: 12, // 减小水平间距
    elevation: 3, // 减小阴影强度
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 100 // 在 renderItem 对应样式里固定高度
  },
  titleText: {
    flex: 1,
    fontSize: 18, // 减小字体大小
    color: "red",
    marginLeft: 10,
    fontWeight: "500",
    paddingRight: 10
  },
  subtitleText: {
    fontSize: 12, // 减小字体大小
    color: "#666"
  },
  circleNumber: {
    minWidth: 40, // 设置最小宽度以显示千位数字
    height: 24,
    borderRadius: 4, // 减小圆角半径使其更接近矩形
    borderWidth: 0,
    backgroundColor: "#4285f4",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    color: "#fff",
    paddingHorizontal: 8 // 添加水平内边距
  },
  input: {
    height: 28, // 减小高度
    borderColor: "#ccc",
    borderWidth: 0.5,
    // 减小 flex 值以减小宽度
    padding: 3, // 减小内边距
    borderRadius: 3, // 减小圆角半径
    fontSize: 10, // 减小字体大小
    backgroundColor: "#f9f9f9",
    width: 60
  },
  scrollButton: {
    width: "40%",
    marginVertical: 3, // 减小垂直间距
    marginHorizontal: 6, // 减小水平间距
    flexDirection: "row",
    gap: 10
  }
});

export default RhesisList;
