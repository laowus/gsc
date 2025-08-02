import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, NativeSyntheticEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 定义 ScrollViewWithBackToTop 组件的 props 类型
interface ScrollViewWithBackToTopProps extends React.ComponentProps<typeof ScrollView> {
  showThreshold?: number; // 显示返回顶部按钮的滚动阈值
  backToTopButtonStyle?: object; // 返回顶部按钮的自定义样式
  backToTopIconColor?: string; // 返回顶部按钮图标的自定义颜色
  backToTopIconSize?: number; // 返回顶部按钮图标的自定义大小
}

const ScrollViewWithBackToTop = forwardRef<{ scrollTo: (options: { y: number; animated?: boolean }) => void }, ScrollViewWithBackToTopProps>(({ onScroll, showThreshold = 100, backToTopButtonStyle, backToTopIconColor = "#4a90e2", backToTopIconSize = 30, ...scrollViewProps }, ref) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // 合并内部和外部的 onScroll 逻辑
  const handleInternalScroll = (event: NativeSyntheticEvent<{ contentOffset: { y: number } }>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    setShowBackToTop(yOffset > showThreshold);

    if (onScroll) {
      onScroll(event as any);
    }
  };

  // 暴露 scrollTo 方法
  useImperativeHandle(ref, () => ({
    scrollTo: (options: { y: number; animated?: boolean }) => {
      scrollViewRef.current?.scrollTo(options);
    }
  }));

  // 点击按钮时滚动到顶部
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <>
      <ScrollView ref={scrollViewRef} onScroll={handleInternalScroll} scrollEventThrottle={16} {...scrollViewProps} />
      {showBackToTop && (
        <TouchableOpacity onPress={scrollToTop} style={[styles.backToTopButton, backToTopButtonStyle, { zIndex: 999 }]}>
          <Ionicons name="arrow-up-circle" size={backToTopIconSize} color={backToTopIconColor} />
        </TouchableOpacity>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  backToTopButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  }
});

export default ScrollViewWithBackToTop;
