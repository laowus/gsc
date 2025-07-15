import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import PoetryDao from "@/dao/PoetryDao";
import Poetry from "@/model/Poetry";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 引入 SafeAreaView

export default function HomeScreen() {
  const [dbData, setDbData] = useState<any[]>([]);
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const allPoetry = await PoetryDao.getAllPoetry();
        setDbData(allPoetry);
      } catch (error) {
        console.log("查询数据库时出错:", error);
      }
    };
    initializeDatabase();
  }, []);

  // 定义渲染单个列表项的函数
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <ThemedView key={index} style={styles.card}>
      <ThemedText>{` ${item.title} - (${item.writer.dynasty}) ${item.writer.writername}`}</ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.title}>
        <Ionicons name="cellular-outline" size={24} color="#87CEEB" />
        <ThemedText>全部({dbData.length})</ThemedText>
      </ThemedView>
      <FlatList data={dbData} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
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
