import * as SQLite from "expo-sqlite";

// 打开或创建数据库
const db = SQLite.openDatabaseSync("poem.db");

export default db;
