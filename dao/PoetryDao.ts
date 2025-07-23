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

// 同时获取分页数据和符合条件的总数
const getPoetryDataAndCount: (page: number, pageSize: number, params?: Record<string, any>) => Promise<{ data: Poetry[]; total: number }> = async (page, pageSize, params = {}) => {
  const offset = (page - 1) * pageSize;
  let whereClause = " where 1=1 ";
  const values: any[] = [pageSize, offset];
  console.log("getPoetryDataAndCount params:", params);
  // 根据查询条件构建 where 子句
  if (Object.keys(params).length > 0) {
    const conditions = Object.entries(params).map(([key, value]) => {
      if (key === "typeid") {
        // 针对 typeid 使用 LIKE 查询
        // values.push(`%${value}%`);
        return `${key} LIKE '${value},%' OR ${key} LIKE '%,${value},%' OR ${key} LIKE '%,${value}' OR ${key} = '${value}'`;
      } else if (key === "keyword") {
        // 针对 keyword 使用 LIKE 查询
        //values.push(value);
        return `p.title LIKE '%,${value},%' OR w.writername LIKE '%,${value},%' OR p.content LIKE '%,${value},%'`;
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
  getPoetryById,
  getPoetryDataAndCount
};
