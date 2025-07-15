import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const DATABASE_NAME = "poem.db";

export default function HomeScreen() {
  const [dbData, setDbData] = useState<any[]>([]);
  useEffect(() => {
    const initializeDatabase = async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      try {
        const allRows = await db.getAllAsync(
          "SELECT writerid,writername FROM writer limit 4"
        );
        const typedRows = allRows.map(
          (row) =>
            row as {
              writerid: number;
              writername: string;
            }
        );
        typedRows.forEach((row) => {
          console.log(row.writerid, row.writername);
        });
        setDbData(typedRows);
      } catch (error) {
        console.log("查询数据库时出错:", error);
      }
    };
    initializeDatabase();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">数据显示</ThemedText>
        {dbData.map((item, index) => (
          // 创建卡片视图
          <ThemedView key={index} style={styles.card}>
            <ThemedText>
              {`ID: ${item.writerid} - 姓名: ${item.writername}`}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  }, // 定义卡片样式
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    flexDirection: "column",
    gap: 4,
  },
});
