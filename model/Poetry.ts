import Info from "./Info";
import Writer from "./Writer";
import { KINDS, TYPES } from "../constants/Utils";
/**
 * 诗词
 */
class Poetry {
  poetryid: number;
  kindname: string; //种类eg:唐诗 宋词
  typeid: string; //类型
  writer: Writer; //作者
  title: string; //标题
  content?: string; //内容
  infos?: Info[]; //诗词简介
  typename?: string;
  constructor(poetryid: number, typeid: string, kindid: number, writer: Writer, title: string, content?: string, infos?: Info[]) {
    this.poetryid = poetryid;
    this.typeid = typeid;
    this.kindname = KINDS[kindid];
    this.writer = writer;
    this.title = title;
    this.content = content;
    this.infos = infos;
  }
}
export default Poetry;
