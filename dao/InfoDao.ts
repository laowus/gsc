import db from "@/constants/Db";
import Info from "@/model/Info";
interface InfoRow {
  infoid: number;
  title: string;
  content: string;
}
// 按id和cateid查询 cateid : 0 为作者, 1 为作品
const getInfosByIds = async (id: number, cateid: number) => {
  const sql = `select * from Info where fid = ${id} and cateId = ${cateid}`;
  const allRows = (await db.getAllAsync(sql)) as InfoRow[];
  const infoList = allRows.map((info) => new Info(info.infoid, info.title, info.content));
  return infoList;
};

export default { getInfosByIds };
