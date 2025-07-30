import db from "@/constants/Db";
import Type from "@/model/Type";

const getChildTypes = async (parentid: number) => {
  const sql = `select * from type where parentid = ${parentid}`;
  const res = await db.getAllAsync<Type>(sql);

  // 使用 Type 类创建实例
  return res.map((item) => new Type(item.typeid, item.typename, item.parentid));
};

const getTypeNamByIds = async (typeids: string) => {
  const sql = `select parentid, typeid, typename from type where typeid in (${typeids})`;
  const allRows = await db.getAllAsync(sql);
  return allRows;
};

const getTypeNameById = async (typeid: number) => {
  const sql = `select * from type where typeid = ${typeid}`;
  const row = await db.getAllAsync<Type>(sql);
  // 添加空值检查
  if (row && row.length > 0) {
    return new Type(row[0].typeid, row[0].typename, row[0].parentid);
  }
  return null;
};

export default {
  getChildTypes,
  getTypeNamByIds,
  getTypeNameById
};
