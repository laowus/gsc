import db from "@/constants/Db";

// type typeid typename parentid

// const getParentTypes = async () => {
//   const sql = `select typeid, typename from type where parentid = 0`;
//   const allRows = await db.getAllAsync(sql);
//   return allRows;
// };

const getChildTypes = async (parentid: number) => {
  const sql = `select typeid, typename from type where parentid = ${parentid}`;
  const allRows = await db.getAllAsync(sql);
  return allRows;
};

export default {
  getChildTypes
};
