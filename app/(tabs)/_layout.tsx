import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
const TAB_BAR_HEIGHT = 60; // 定义 tabBar 高度

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          default: {
            height: TAB_BAR_HEIGHT // 设置 tabBar 高度
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
