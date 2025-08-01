/// 保存一个para[] number[]
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AppStore = {
  barHeight: number;
  params: number[];
  curPid: number;
  pos: number;
  setPos: (pos: number) => void;
  setBarheight: (height: number) => void;
  setParams: (params: number[]) => void;
  setCurPid: (pid: number) => void;
};

// 使用 persist 中间件实现持久化
const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      //wid作者id, kid体裁id,  ctid二级类型id
      barHeight: 0,
      params: [0, 0, 0],
      curPid: 0,
      pos: 0,
      setPos: (pos: number) => {
        set({ pos: pos });
      },
      setParams: (params: number[]) => {
        set({ params: params });
      },
      setCurPid: (pid: number) => {
        set({ curPid: pid });
      },
      setBarheight: (height: number) => {
        set({ barHeight: height });
      }
    }),
    {
      name: "app-store", // 存储的名称
      storage: createJSONStorage(() => AsyncStorage) // 使用 AsyncStorage 进行存储
    }
  )
);

export default useAppStore;
