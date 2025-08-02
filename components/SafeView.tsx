import React from "react";
import { View, type ViewProps } from "react-native";
import useAppStore from "@/store/appStore";

export function SafeView({ style, ...otherProps }: ViewProps) {
  const barHeight = useAppStore((state) => state.barHeight);

  return <View style={[{ flex: 1, gap: 5, paddingTop: barHeight, padding: 10 }, style]} {...otherProps} />;
}

export default SafeView;
