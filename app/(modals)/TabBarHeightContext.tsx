import React, { createContext, useContext, useState } from "react";
import { View } from "react-native";

// 创建 TabBar 高度上下文
const TabBarHeightContext = createContext<number | null>(null);

// 提供上下文的组件
export const TabBarHeightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabBarHeight, setTabBarHeight] = useState<number | null>(null);

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setTabBarHeight(height);
  };

  return (
    <TabBarHeightContext.Provider value={tabBarHeight}>
      {children}
      <View onLayout={handleLayout} />
    </TabBarHeightContext.Provider>
  );
};

// 自定义 Hook 用于获取 TabBar 高度
export const useTabBarHeight = () => {
  return useContext(TabBarHeightContext);
};
