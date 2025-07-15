import db from "@/constants/Db";
import Poetry from "@/model/Poetry";
import Writer from "@/model/Writer";

// 定义接口描述从数据库查询出的诗歌行数据结构
interface PoetryRow {
  poetryid: number; // 诗歌 ID
  kindid: number; // 诗歌体裁
  typeid: string; // 类型
  dynastyid: number; // 朝代 ID
  writerid: number; // 作者 ID
  writername: string; // 作者姓名
  title: string; // 诗歌标题
  content: string; // 诗歌内容
}

const getAllPoetry: () => Promise<Poetry[]> = async () => {
  const sql = `select p.poetryid,p.kindid,p.typeid,w.dynastyid,w.writerid,w.writername,p.title from Poetry p join Writer w on p.writerid = w.writerid order by p.poetryid desc`;
  const allRows = await db.getAllAsync(sql);
  const poetryList = [] as Poetry[];
  // 明确 allRows 元素类型为 PoetryRow
  for (const p of allRows as PoetryRow[]) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    // 假设 Poetry 构造函数参数顺序与 PoetryRow 接口属性顺序一致
    const _poetry = new Poetry(p.kindid, p.typeid, p.poetryid, writer, p.title);
    poetryList.push(_poetry);
  }
  return poetryList;
};
export default {
  getAllPoetry
};
