import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import useTabBarHeightStore from "@/store/tabsHeightStore";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const setTabBarHeight = useTabBarHeightStore((state) => state.setTabBarHeight);

  const handleTabBarLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    console.log(height);
    setTabBarHeight(height);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#121212" : "#FFFFFF",
          borderTopWidth: 0,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "首页",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="types"
        options={{
          title: "分类",
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="rhesis"
        options={{
          title: "名句",
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="star" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="writers"
        options={{
          title: "诗人",
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="poems"
        options={{
          title: "作品",
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="bag" size={28} color={color} />
        }}
      />
    </Tabs>
  );
}
