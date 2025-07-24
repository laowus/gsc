import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { unzip } from "react-native-zip-archive";
const DATABASE_NAME = "poem.db";
const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;
const dbDir = `${FileSystem.documentDirectory}SQLite/`;

const fileExist = async (filePath: string) => {
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (fileInfo.exists && fileInfo.size > 0) {
    console.log(`文件 ${filePath} 存在，大小为: ${fileInfo.size} 字节`);
    return true;
  } else {
    console.log(`文件 ${filePath} 不存在或大小为 0 字节`);
    return false;
  }
};

const checkDatabaseFile = async () => {
  const exist = await fileExist(dbPath);
  if (exist) {
    return true;
  } else {
    try {
      const asset = Asset.fromModule(require("@/assets/database/poem.zip"));
      await asset.downloadAsync();
      const fileInfo = await FileSystem.getInfoAsync(asset.localUri!);
      if (fileInfo.exists && fileInfo.size) {
        try {
          // 使用 unzip 方法进行解压，目标路径改为目录
          await unzip(asset.localUri!, dbDir);
          const dbExist = await fileExist(dbPath);
          if (dbExist) {
            return true;
          }
        } catch (error) {
          console.error("解压失败:", error);
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error("下载资源时出错:", error);
    }
  }
};

export { checkDatabaseFile };
