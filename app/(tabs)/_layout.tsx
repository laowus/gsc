import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          marginTop: 0 // 设置 Tabs 与 Tabs.Screen 内容之间的距离为 5 个单位
        },
        popToTopOnBlur: true
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
