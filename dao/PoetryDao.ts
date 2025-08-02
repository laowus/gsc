import db from "@/constants/Db";
import Poetry from "@/model/Poetry";
import Writer from "@/model/Writer";
import Rhesis from "@/model/Rhesis";

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
      } else if (key === "writerid") {
        // 针对 writerid 使用 = 查询
        return `p.writerid = ${value}`;
      } else {
        values.push(value);
        return `${key} = ${value}`;
      }
    });
    whereClause = `where ${conditions.join(" AND ")}`;
  }

  // 分页查询 SQL
  const dataSql = `
    select p.poetryid, p.kindid, p.typeid,w.dynastyid,w.writerid,w.writername,p.title, p.content 
    from Poetry p
    join Writer w on p.writerid = w.writerid 
    ${whereClause}
    limit ? offset ?
  `;
  // 总数查询 SQL
  const countSql = `SELECT COUNT(*) as total FROM Poetry p join Writer w on p.writerid = w.writerid ${whereClause}`;
  const countValues = [...values.slice(2)]; // 移除 limit 和 offset 参数

  console.log(countSql, countValues);
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

const getPoetryById: (poetryid: number) => Promise<Poetry | null> = async (poetryid) => {
  const sql = `select p.poetryid,p.kindid,p.typeid,w.dynastyid,w.writerid,w.writername,p.title, p.content from Poetry p join Writer w on p.writerid = w.writerid where p.poetryid = ?`;
  const p = (await db.getFirstAsync(sql, [poetryid])) as PoetryRow;
  if (p) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    const poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
    return poetry;
  }
  return null;
};

const getFirstPoetry: () => Promise<Poetry | null> = async () => {
  const sql = `select p.poetryid,p.kindid,p.typeid,w.dynastyid,w.writerid,w.writername,p.title, p.content from Poetry p join Writer w on p.writerid = w.writerid order by p.poetryid limit 1`;
  const p = (await db.getFirstAsync(sql, [])) as PoetryRow;
  if (p) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    const poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
    return poetry;
  }
  return null;
};

//加过滤参数
const getAllPoetry: (params: number[]) => Promise<Poetry[]> = async (params) => {
  let sql = `select p.poetryid,p.kindid,p.typeid,w.dynastyid as dynastyid,w.writerid,w.writername,p.title, p.content from Poetry p join Writer w on p.writerid = w.writerid`;
  if (params[0] != 0) {
    sql += " and p.writerid = " + params[0];
  }
  if (params[1] != 0) {
    sql += " and p.kindid = " + params[1];
  }
  if (params[2] != 0) {
    sql += "  and (p.typeid like '" + params[2] + ",%' or p.typeid like '%," + params[2] + ",%' or p.typeid like '%," + params[2] + "' or p.typeid =" + params[2] + ")";
  }

  sql += " order by p.poetryid asc";
  console.log("getAllPoetry sql:", sql);
  const allRows = (await db.getAllAsync(sql, [])) as PoetryRow[];
  const poetryList = [] as Poetry[];
  for (const p of allRows) {
    const writer = new Writer(p.writerid, p.writername, p.dynastyid);
    const poetry = new Poetry(p.poetryid, p.typeid, p.kindid, writer, p.title, p.content);
    poetryList.push(poetry);
  }
  return poetryList;
};

// 修改 getRhesis 函数，添加分页参数，默认每页20条数据，同时返回总数
const getRhesis: (page: number, pageSize: number) => Promise<{ data: Rhesis[]; total: number }> = async (page = 1, pageSize = 20) => {
  const offset = (page - 1) * pageSize;
  const dataSql = `SELECT r.rhesisid, r.rcontent, p.poetryid, p.title, w.writername, w.dynastyid FROM rhesis r join poetry p on r.poetryid=p.poetryid inner join writer w on p.writerid=w.writerid order by r.rhesisid asc LIMIT ? OFFSET ?`;
  const countSql = `SELECT COUNT(*) as total FROM rhesis r join poetry p on r.poetryid=p.poetryid inner join writer w on p.writerid=w.writerid`;

  try {
    // 并发执行查询
    const [allRows, countResult] = await Promise.all([db.getAllAsync(dataSql, [pageSize, offset]), db.getFirstAsync(countSql, [])]);

    const rhesisList = allRows.map((item: any) => ({
      rhesisid: item.rhesisid,
      rcontent: item.rcontent,
      poetryid: item.poetryid,
      title: item.title,
      writername: item.writername,
      dynastyid: item.dynastyid
    })) as Rhesis[];

    return {
      data: rhesisList,
      total: (countResult as { total: number }).total
    };
  } catch (error) {
    console.error("获取名句数据和总数时出错:", error);
    return {
      data: [],
      total: 0
    };
  }
};
const getAllRhesis: () => Promise<Rhesis[]> = async () => {
  const sql = `SELECT r.rhesisid, r.rcontent, p.poetryid, p.title, w.writername, w.dynastyid FROM rhesis r join poetry p on r.poetryid=p.poetryid inner join writer w on p.writerid=w.writerid order by r.rhesisid asc `;

  try {
    // 并发执行查询
    const allRows = await db.getAllAsync(sql, []);

    const rhesisList = allRows.map((item: any) => ({
      rhesisid: item.rhesisid,
      rcontent: item.rcontent,
      poetryid: item.poetryid,
      title: item.title,
      writername: item.writername,
      dynastyid: item.dynastyid
    })) as Rhesis[];

    return rhesisList;
  } catch (error) {
    console.error("获取名句数据和总数时出错:", error);
    return [];
  }
};

export default {
  getPoetryById,
  getPoetryDataAndCount,
  getFirstPoetry,
  getAllPoetry,
  getRhesis,
  getAllRhesis
};
