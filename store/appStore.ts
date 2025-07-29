/// 保存一个para[] number[]
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AppStore = {
  params: number[];
  curPid: number;
  setParams: (params: number[]) => void;
  setCurPid: (pid: number) => void;
};

// 使用 persist 中间件实现持久化
const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      //did 作者所属朝代id wid作者id, kid体裁id, ptid一级类型id, ctid二级类型id
      params: [0, 0, 0, 0, 0],
      curPid: 0,
      setParams: (params: number[]) => {
        set({ params: params });
      },
      setCurPid: (pid: number) => {
        set({ curPid: pid });
      }
    }),
    {
      name: "app-store", // 存储的名称
      storage: createJSONStorage(() => AsyncStorage) // 使用 AsyncStorage 进行存储
    }
  )
);

export default useAppStore;
