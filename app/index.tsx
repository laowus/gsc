import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { unzip } from "react-native-zip-archive"; // 导入正确的方法
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function StartScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDatabaseLoaded, setIsDatabaseLoaded] = useState(false);
  const router = useRouter();
  const DATABASE_NAME = "poem.db";
  const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;
  const dbDir = `${FileSystem.documentDirectory}SQLite/`; // 解压目标目录

  const fileExist = async (filePath: string) => {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      console.log(`文件 ${filePath} 存在，大小为: ${fileInfo.size} 字节`);
    } else {
      console.log(`文件 ${filePath} 不存在`);
    }
    return fileInfo.exists;
  };

  useEffect(() => {
    const checkDatabaseFile = async () => {
      const exist = await fileExist(dbPath);
      if (exist) {
        console.log("数据库存在");
        setIsDatabaseLoaded(true);
        setIsLoading(false);
      } else {
        console.log("数据库不存在");
        try {
          const asset = Asset.fromModule(require("@/assets/database/poem.zip"));
          await asset.downloadAsync();
          const fileInfo = await FileSystem.getInfoAsync(asset.localUri!);
          if (fileInfo.exists && fileInfo.size) {
            console.log("zip 存在 文件大小:", fileInfo.size);
            try {
              // 使用 unzip 方法进行解压，目标路径改为目录
              await unzip(asset.localUri!, dbDir);
              console.log("解压完成", dbDir);
              const dbExist = await fileExist(dbPath);
              if (dbExist) {
                setIsDatabaseLoaded(true);
                setIsLoading(false);
              }
            } catch (error) {
              console.error("解压失败:", error);
            }
          } else {
            console.log("zip 文件不存在或无法获取大小");
          }
        } catch (error) {
          console.error("下载资源时出错:", error);
        }
      }

      // }
    };
    checkDatabaseFile();
  }, []);

  useEffect(() => {
    if (!isLoading && isDatabaseLoaded) {
      console.log("数据库加载成功");
      router.push("/(tabs)");
    }
  }, [isLoading, isDatabaseLoaded, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>正在加载...</Text>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {!isLoading && !isDatabaseLoaded && (
        <Text style={styles.error}>数据库加载失败</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  error: {
    fontSize: 18,
    color: "red",
  },
});
