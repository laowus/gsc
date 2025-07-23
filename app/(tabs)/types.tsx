import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, View, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import TypesDao from "@/dao/TypeDao";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const titleWidth = width / 5;
const waterfallWidth = width - titleWidth;
// 获取屏幕高度

interface ParentType {
  typeid: number;
  typename: string;
}

export default function Types() {
  const [parentTypes, setParentTypes] = useState<ParentType[]>([]);
  const [childTypes, setChildTypes] = useState<ParentType[]>([]);
  const [index, setIndex] = useState<number>(1);

  useEffect(() => {
    TypesDao.getChildTypes(0).then((res) => {
      setParentTypes(res as ParentType[]);
    });
    TypesDao.getChildTypes(index).then((res) => {
      setChildTypes(res as ParentType[]);
    });
  }, [index]);

  if (parentTypes.length === 0) {
    return (
      <SafeAreaView>
        <ThemedText>暂无数据</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={[styles.titleContainer, { width: titleWidth }]}>
        <View style={styles.titleWrapper}>
          {parentTypes.map((item) => (
            <ThemedText key={item.typeid} onPress={() => setIndex(item.typeid)} style={[styles.titleText, index === item.typeid && styles.activeTitleText]}>
              {item.typename}
            </ThemedText>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={[styles.waterfallContainer, { width: waterfallWidth }]}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <View style={styles.waterfallWrapper}>
            {childTypes.map((item) => (
              <ThemedView key={item.typeid} style={styles.waterfallItem}>
                <ThemedText
                  style={styles.itemText}
                  onPress={() => {
                    router.push({
                      pathname: "/poetryList",
                      params: { poetryid: item.typeid }
                    });
                  }}
                >
                  {item.typename}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    gap: 16
  },
  titleContainer: {
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
    })
  },
  titleWrapper: {
    padding: 12,
    flex: 1
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
