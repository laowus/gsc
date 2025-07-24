import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PoetryDao from "@/dao/PoetryDao";
import Poetry from "@/model/Poetry";

interface PoetryStore {
  currentPoetry: Poetry | null;
  setCurrentPoetry: (poetry: Poetry | null) => void;
  fetchFirstPoetry: () => Promise<void>;
}

const usePoetryStore = create<PoetryStore>()(
  persist(
    (set) => ({
      currentPoetry: null,
      setCurrentPoetry: (poetry) => set({ currentPoetry: poetry }),
      fetchFirstPoetry: async () => {
        try {
          const firstPoetry = await PoetryDao.getFirstPoetry();
          set({ currentPoetry: firstPoetry });
        } catch (error) {
          console.error("获取第一首诗歌时出错:", error);
        }
      }
    }),
    {
      name: "poetry-store", // 存储的名称
      storage: createJSONStorage(() => AsyncStorage) // 使用 AsyncStorage 进行存储
    }
  )
);

export default usePoetryStore;
