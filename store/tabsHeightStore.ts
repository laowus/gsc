import { create } from "zustand";

interface TabsHeightState {
  tabBarHeight: number | null;
  setTabBarHeight: (height: number) => void;
}

const useTabsHeightStore = create<TabsHeightState>((set) => ({
  tabBarHeight: null,
  setTabBarHeight: (height) => set({ tabBarHeight: height })
}));

export default useTabsHeightStore;
