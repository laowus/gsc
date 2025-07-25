import PoetryDetail from "@/app/(views)/poetryDetail";
import usePoetryStore from "@/store/poetryStore";

export default function HomeScreen() {
  // 从 Zustand store 中获取当前诗歌
  const currentPoetry = usePoetryStore((state) => state.currentPoetry);
  return <PoetryDetail poetry={currentPoetry} />;
}
