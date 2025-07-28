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
  // 修改排序规则为 COLLATE UNICODE 实现中文排序
  const sql = `SELECT * FROM Writer WHERE dynastyid = ${did} order by writername`;
  console.log("查询作者列表 SQL:", sql);
  const allRows = (await db.getAllAsync(sql)) as WriterRow[];
  return allRows.map((row) => new Writer(row.writerid, row.writername, row.dynastyid, row.summary));
};

const getWriterByWid = async (wid: number): Promise<Writer> => {
  const sql = `SELECT * FROM Writer WHERE writerid = ${wid} limit 1`;
  console.log("查询作者详情 SQL:", sql);
  const row = (await db.getAllAsync(sql)) as WriterRow[];
  return new Writer(row[0].writerid, row[0].writername, row[0].dynastyid, row[0].summary);
};

export default { getWritersByDid, getWriterByWid };
