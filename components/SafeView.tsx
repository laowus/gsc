import React from "react";
import { ThemedView } from "@/components/ThemedView";
import useAppStore from "@/store/appStore";

interface CustomThemedViewProps {
  children: React.ReactNode;
}

const SafeView: React.FC<CustomThemedViewProps> = ({ children }) => {
  const barHeight = useAppStore((state) => state.barHeight);

  return <ThemedView style={{ flex: 1, gap: 5, paddingTop: barHeight }}>{children}</ThemedView>;
};

export default SafeView;
