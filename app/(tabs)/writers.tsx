import { Dimensions, Platform, StyleSheet, ScrollView, FlatList, View, TouchableWithoutFeedback } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import SafeView from "@/components/SafeView";
import { ThemedView } from "@/components/ThemedView";
import { DYNASTYS } from "@/constants/Utils";
import { useEffect, useRef, useState } from "react";
import WriterDao from "@/dao/WriterDao";
import Writer from "@/model/Writer";
import { router } from "expo-router";

type WriterCount = {
  did: number;
  dynasty: string;
  sum: number;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16
  },
  leftDynasty: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      },
      android: {
        elevation: 4
      }
    }),
    padding: 5
  },
  titleText: {
    fontSize: 14,
    color: "#666666",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  activeTitleText: {
    backgroundColor: "#e0f7fa",
    color: "#0097a7",
    fontWeight: "600"
  },
  // 添加索引为 8 的特殊样式
  specialIndex8Text: {
    backgroundColor: "#ffeb3b", // 可以根据需求修改背景色
    color: "#333333",
    fontWeight: "600"
  },
  // 添加新样式，用于不同索引项的背景色
  itemCardBase: {
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
    marginVertical: 2,
    marginHorizontal: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      },
      android: {
        elevation: 4
      }
    }),
    flexDirection: "column",
    alignItems: "center",
    gap: 0 // 减少 gap 值让文本靠近
  },
  dynastyText: {
    paddingBottom: 5,
    fontSize: 14,
    lineHeight: 14,
    color: "#333333"
  },
  countText: {
    padding: 0,
    fontSize: 12,
    lineHeight: 12
  },
  writerList: {
    flex: 1
  },
  waterfallContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      },
      android: {
        elevation: 4
      }
    })
  },
  waterfallWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  waterfallItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#f0f4f8",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 2
      }
    }),
    borderWidth: 0.5,
    borderColor: "#e0e0e0"
  },
  itemText: {
    fontSize: 14,
    color: "#333333"
  }
});

// 定义一组背景颜色
const itemBackgroundColors = ["#e3f2fd", "#e8f5e9", "#fff8e1", "#fce4ec", "#f5f0ff", "#e0f7fa", "#f1f8e9", "#fff3e0", "#ffebee", "#ede7f6"];

export default function WriterScreen() {
  const { width } = Dimensions.get("window");
  const titleWidth = width / 4;
  const waterfallWidth = width - titleWidth;
  const [curIndex, setCurIndex] = useState<number>(7);
  const [curWList, setCurWList] = useState<Writer[]>([]);
  const [writerCounts, setWriterCounts] = useState<WriterCount[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const renderItem = ({ item, index }: { item: WriterCount; index: number }) => {
    const backgroundColor = itemBackgroundColors[index % itemBackgroundColors.length];
    const itemStyle = {
      ...styles.itemCardBase,
      backgroundColor: index === curIndex ? "#ffeb3b" : backgroundColor
    };
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setCurIndex(index);
        }}
      >
        <ThemedView style={itemStyle}>
          <ThemedText style={index === curIndex ? styles.specialIndex8Text : styles.dynastyText}>{item.dynasty}</ThemedText>
          <ThemedText style={styles.countText}>({item.sum})</ThemedText>
        </ThemedView>
      </TouchableWithoutFeedback>
    );
  };

  useEffect(() => {
    console.log("设置curindex");
    const getWriterCounts = async () => {
      const counts: WriterCount[] = [];
      for (let i = 0; i < DYNASTYS.length; i++) {
        const sum = await WriterDao.getWCountByDid(i);
        const dynasty = i === 0 ? "全部" : DYNASTYS[i];
        counts.push({ did: i, dynasty, sum });
      }
      setWriterCounts(counts);
    };
    const getCurWriters = async () => {
      const writers = await WriterDao.getWritersByDid(curIndex);
      setCurWList(writers);
    };
    getWriterCounts();
    getCurWriters();
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [curIndex]);
  return (
    <SafeView>
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.leftDynasty, { width: titleWidth }]}>
          <FlatList data={writerCounts} renderItem={renderItem}></FlatList>
        </ThemedView>
        <ThemedView style={[styles.waterfallContainer, { width: waterfallWidth }]}>
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={true}>
            <View style={styles.waterfallWrapper}>
              {curWList.map((item, index) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    router.push({
                      pathname: "/poetryList",
                      params: { writerid: item.writerid, writername: item.writername }
                    });
                  }}
                >
                  <ThemedView key={item.writerid} style={[styles.waterfallItem, { backgroundColor: itemBackgroundColors[index % itemBackgroundColors.length] }]}>
                    <ThemedText style={styles.itemText}>{item.writername}</ThemedText>
                  </ThemedView>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </ScrollView>
        </ThemedView>
      </ThemedView>
    </SafeView>
  );
}
