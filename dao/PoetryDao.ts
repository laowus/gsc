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
const getPoetryByPage: (page: number, pageSize: number, params?: Record<string, any>) => Promise<Poetry[]> = async (page, pageSize, params = {}) => {
  const { data } = await getPoetryDataAndCount(page, pageSize, params);
  return data;
};

// 同时获取分页数据和符合条件的总数
const getPoetryDataAndCount: (page: number, pageSize: number, params?: Record<string, any>) => Promise<{ data: Poetry[]; total: number }> = async (page, pageSize, params = {}) => {
  const offset = (page - 1) * pageSize;
  let whereClause = "where 1=1";
  const values: any[] = [pageSize, offset];
  console.log("getPoetryDataAndCount params:", params);
  // 根据查询条件构建 where 子句
  if (Object.keys(params).length > 0) {
    const conditions = Object.entries(params).map(([key, value]) => {
      if (key === "typeid") {
        // 针对 typeid 使用 LIKE 查询
        values.push(`%${value}%`);
        return `${key} LIKE '${value},%' OR ${key} LIKE '%,${value},%' OR ${key} LIKE '%,${value}' OR ${key} = '${value}'`;
      } else {
        values.push(value);
        return `${key} = ${value}`;
      }
    });
    whereClause = `where ${conditions.join(" AND ")}`;

    console.log("whereClause:", whereClause);
  }

  // 分页查询 SQL
  const dataSql = `
    select p.poetryid, p.kindid, p.typeid,w.dynastyid,w.writerid,w.writername,p.title, p.content 
    from Poetry p
    join Writer w on p.writerid = w.writerid 
    ${whereClause}
    limit ? offset ?
  `;

  console.log("dataSql:", dataSql);

  // 总数查询 SQL
  const countSql = `SELECT COUNT(*) as total FROM Poetry p join Writer w on p.writerid = w.writerid ${whereClause}`;
  console.log("countSql:", countSql);
  const countValues = [...values.slice(2)]; // 移除 limit 和 offset 参数

  try {
    // 并发执行查询
    const [allRows, countResult] = await Promise.all([db.getAllAsync(dataSql, values), db.getFirstAsync(countSql, countValues)]);

    const poetryList = [] as Poetry[];

    for (const p of allRows as PoetryRow[]) {
      const writer = new Writer(p.writerid, p.writername, p.dynastyid);
      const _poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
      poetryList.push(_poetry);
    }

    return {
      data: poetryList,
      total: (countResult as { total: number }).total
    };
  } catch (error) {
    console.error("获取数据和总数时出错:", error);
    return {
      data: [],
      total: 0
    };
  }
};
// 定义查询结果的类型
interface CountResult {
  total: number;
}
// 获取所有 Poetry 的数量
const getTotalPoetryCount: () => Promise<number> = async () => {
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
// 根据作者查询诗歌
const getPoetryByWriter: (writerid: number) => Promise<Poetry[]> = async (writerid) => {
  const sql = `select p.poetryid,p.kindid,p.typeid,w.dynastyid,w.writerid,w.writername,p.title, p.content from Poetry p join Writer w on p.writerid = w.writerid where w.writerid = ?`;
  const allRows = await db.getAllAsync(sql, [writerid]);
  const poetryList = [] as Poetry[];
  for (const p of allRows as PoetryRow[]) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    const poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
    poetryList.push(poetry);
  }
  return poetryList;
};
// 根据分类查询诗歌
const getPoetryByTid: (typeid: string) => Promise<Poetry[]> = async (typeid) => {
  const sql = `select p.poetryid,p.kindid,p.typeid,w.dynastyid,w.writerid,w.writername,p.title, p.content from Poetry p join Writer w on p.writerid = w.writerid where p.typeid = ?`;
  const allRows = await db.getAllAsync(sql, [typeid]);
  const poetryList = [] as Poetry[];
  for (const p of allRows as PoetryRow[]) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    const poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
    poetryList.push(poetry);
  }
  return poetryList;
};
// 根据体裁查询诗歌
const getPoetryByKid: (kindid: number) => Promise<Poetry[]> = async (kindid) => {
  const sql = `select p.poetryid,p.kindid,p.typeid,w.dynastyid,w.writerid,w.writername,p.title, p.content from Poetry p join Writer w on p.writerid = w.writerid where p.kindid = ?`;
  const allRows = await db.getAllAsync(sql, [kindid]);
  const poetryList = [] as Poetry[];
  for (const p of allRows as PoetryRow[]) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    const poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
    poetryList.push(poetry);
  }
  return poetryList;
};
// 关键字查询
const getPoetryBySearch: (keyword: string) => Promise<Poetry[]> = async (keyword) => {
  const sql = `
        select p.poetryid,p.kindid,p.typeid,w.dynastyid,w.writerid,w.writername,
				p.title,p.content from Poetry p join Writer w on p.writerid = w.writerid where 
				p.title like '%${keyword}%' or w.writername like '%${keyword}%' or p.content like '%${keyword}%'`;
  const allRows = await db.getAllAsync(sql, [`%${keyword}%`]);
  const poetryList = [] as Poetry[];
  for (const p of allRows as PoetryRow[]) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    const poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
    poetryList.push(poetry);
  }
  return poetryList;
};
export default {
  getAllPoetry,
  getPoetryByPage,
  getTotalPoetryCount,
  getPoetryById,
  getPoetryBySearch,
  getPoetryByWriter,
  getPoetryByTid,
  getPoetryByKid,
  getPoetryDataAndCount
};
