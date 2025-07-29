import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, ActivityIndicator, View, Text, ImageBackground } from "react-native";
import { checkDatabaseFile } from "@/utils/tools";
import { useState, useEffect } from "react";
import "react-native-reanimated";
import splashIcon from "@/assets/images/splash-icon.png"; // 引入背景图
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAppStore from "@/store/appStore";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "white"
  },
  error: {
    fontSize: 18,
    color: "red"
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center"
  }
});

// 封装加载状态展示组件
const LoadingScreen = ({ loaded, isDatabaseLoaded, loadingError }: { loaded: boolean; isDatabaseLoaded: boolean; loadingError: string | null }) => {
  return (
    <ImageBackground source={splashIcon} style={styles.backgroundImage}>
      {!loaded && <Text style={{ color: "white" }}>加载中...</Text>}
      {!isDatabaseLoaded && (
        <>
          <Text style={styles.title}>首次加载会比较慢，请稍后...</Text>
          {!loadingError && <ActivityIndicator size="large" color="#ffffff" />}
          {loadingError && <Text style={styles.error}>{loadingError}</Text>}
        </>
      )}
    </ImageBackground>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });
  const [isDatabaseLoaded, setIsDatabaseLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setBarHeight = useAppStore((state) => state.setBarheight);

  // 封装数据库加载逻辑
  const loadDatabase = async () => {
    try {
      const exist = (await checkDatabaseFile()) ?? false; // 确保 exist 为 boolean 类型
      setIsDatabaseLoaded(exist);
    } catch (error) {
      console.error("数据库加载出错:", error);
      setLoadingError("数据库加载失败");
    }
  };

  // 在组件挂载时检查数据库
  useEffect(() => {
    loadDatabase();
  }, []);

  // 在组件挂载时获取状态栏高度并写入 appStore
  useEffect(() => {
    setBarHeight(insets.top);
  }, [insets.top, setBarHeight]);

  // 当字体和数据库都加载完成时跳转
  useEffect(() => {
    if (loaded && isDatabaseLoaded) {
      router.push({
        pathname: "/(tabs)"
      });
    }
  }, [loaded, isDatabaseLoaded, router]);

  // 若字体或数据库未加载完成，显示加载提示或错误信息
  if (!loaded || !isDatabaseLoaded || loadingError) {
    return <LoadingScreen loaded={loaded} isDatabaseLoaded={isDatabaseLoaded} loadingError={loadingError} />;
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
