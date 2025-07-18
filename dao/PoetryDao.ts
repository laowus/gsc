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
}; // 分页查询诗歌的方法
const getPoetryByPage: (page: number, pageSize: number) => Promise<Poetry[]> = async (page, pageSize) => {
  // 计算偏移量
  const offset = (page - 1) * pageSize;
  const sql = `
    select p.poetryid, p.kindid, p.typeid,w.dynastyid,w.writerid,w.writername,p.title, p.content 
    from Poetry p 
    join Writer w on p.writerid = w.writerid 
    order by p.poetryid desc 
    limit ? offset ?
  `;
  const allRows = await db.getAllAsync(sql, [pageSize, offset]);
  const poetryList = [] as Poetry[];
  for (const p of allRows as PoetryRow[]) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    const _poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
    poetryList.push(_poetry);
  }
  return poetryList;
};
// 定义查询结果的类型
interface CountResult {
  total: number;
}
// 获取所有 Poetry 的数量
const getTotalPoetryCount: () => Promise<number> = async () => {
  console.log("getTotalPoetryCount 方法开始执行");
  try {
    // 使用 await 等待异步操作完成
    const result: CountResult = await db.getFirstAsync("SELECT COUNT(*) as total FROM Poetry");
    console.log("数据库查询结果:", result);
    // 假设查询结果包含 total 字段
    return result.total;
  } catch (error) {
    console.error("获取诗歌总数时出错:", error);
    // 出错时返回 0
    return 0;
  } finally {
    console.log("getTotalPoetryCount 方法执行结束");
  }
};

const getPoetryById: (poetryid: number) => Promise<Poetry> = async (poetryid) => {
  const sql = `select p.poetryid,p.kindid,p.typeid,w.dynastyid,w.writerid,w.writername,p.title, p.content from Poetry p join Writer w on p.writerid = w.writerid where p.poetryid = ?`;
  const p = (await db.getFirstAsync(sql, [poetryid])) as PoetryRow;
  if (p) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    const poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
    return poetry;
  }
  return null;
};

export default {
  getAllPoetry,
  getPoetryByPage,
  getTotalPoetryCount,
  getPoetryById
};
