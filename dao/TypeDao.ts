import db from "@/constants/Db";

const getChildTypes = async (parentid: number) => {
  const sql = `select typeid, typename from type where parentid = ${parentid}`;
  const allRows = await db.getAllAsync(sql);
  return allRows;
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
