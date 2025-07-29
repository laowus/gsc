import db from "@/constants/Db";
import Type from "@/model/Type";

const getChildTypes = async (parentid: number) => {
  const sql = `select typeid, typename from type where parentid = ${parentid}`;
  const res = await db.getAllAsync<{ typeid: number; typename: string }>(sql);

  // 使用 Type 类创建实例
  return res.map((item) => new Type(item.typeid, item.typename));
};

const getTypeNamByIds = async (typeids: string) => {
  const sql = `select typeid, typename from type where typeid in (${typeids})`;
  const allRows = await db.getAllAsync(sql);
  return allRows;
};

export default {
  getChildTypes,
  getTypeNamByIds
};
