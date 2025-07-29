import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform } from "react-native";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: TabBarBackground,
        // 设置 tabBarStyle
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute"
            // 设置 iOS 标签栏顶部间距为状态栏高度
          },
          default: {
            // 设置其他平台标签栏顶部间距为状态栏高度
          }
        })
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="types"
        options={{
          title: "分类",
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="rhesis"
        options={{
          title: "名句",
          tabBarIcon: ({ color }) => <Ionicons name="star" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="writers"
        options={{
          title: "诗人",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="poems"
        options={{
          title: "作品",
          tabBarIcon: ({ color }) => <Ionicons name="bag" size={28} color={color} />
        }}
      />
    </Tabs>
  );
}
