import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, ActivityIndicator, View, Text } from "react-native";

import { checkDatabaseFile } from "@/utils/tools";
import { useState, useEffect } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  error: {
    fontSize: 18,
    color: "red"
  }
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });
  const [isDatabaseLoaded, setIsDatabaseLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // 在组件挂载时检查数据库
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const exist = await checkDatabaseFile();
        setIsDatabaseLoaded(exist);
      } catch (error) {
        console.error("数据库加载出错:", error);
        setLoadingError("数据库加载失败");
      }
    };
    loadDatabase();
  }, []);

  // 若字体或数据库未加载完成，显示加载提示或错误信息
  if (!loaded || !isDatabaseLoaded) {
    return (
      <View style={styles.container}>
        {!loaded && <Text>字体加载中...</Text>}
        {!isDatabaseLoaded && (
          <>
            <Text style={styles.title}>正在加载...</Text>
            {!loadingError && <ActivityIndicator size="large" color="#0000ff" />}
            {loadingError && <Text style={styles.error}>{loadingError}</Text>}
          </>
        )}
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
