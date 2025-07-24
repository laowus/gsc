import PoetryDetail from "../(views)/poetryDetail";
import usePoetryStore from "../../store/poetryStore";

export default function HomeScreen() {
  const poetryid = usePoetryStore((state) => state.poetryid);
  return <PoetryDetail poetryid={poetryid} />;
}
