import db from "@/constants/Db";
import Writer from "@/model/Writer";

interface WriterRow {
  writerid: number;
  writername: string;
  dynastyid: number;
  summary?: string;
}

// 按朝代id查询
const getWritersByDid = async (did: number): Promise<Writer[]> => {
  let sql = `SELECT *  FROM Writer`;
  if (did > 0) {
    sql += ` WHERE dynastyid = ${did}`;
  }
  sql += ` order by writername`;
  console.log("按获取查询", sql);
  const allRows = (await db.getAllAsync(sql)) as WriterRow[];
  return allRows.map((row) => new Writer(row.writerid, row.writername, row.dynastyid, row.summary));
};

const getWriterByWid = async (wid: number): Promise<Writer> => {
  const sql = `SELECT * FROM Writer WHERE writerid = ${wid} limit 1`;
  const row = (await db.getAllAsync(sql)) as WriterRow[];
  return new Writer(row[0].writerid, row[0].writername, row[0].dynastyid, row[0].summary);
};

// 获取朝代下面的 作者数量
const getWCountByDid = async (did: number): Promise<number> => {
  let sql = `SELECT count(*) as sum  FROM Writer`;
  if (did > 0) {
    sql += ` WHERE dynastyid = ${did}`;
  }
  const row = (await db.getFirstAsync(sql)) as { sum: number };
  return row["sum"];
};

export default { getWritersByDid, getWriterByWid, getWCountByDid };
