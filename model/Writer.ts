import Info from "./Info";
import { DYNASTYS } from "../constants/Utils";

class Writer {
  writerid: number;
  writername: string;
  dynastyid: number;
  dynastyname: string;
  summary?: string;
  infos?: Info[];
  constructor(writerid: number, writername: string, dynastyid: number, summary?: string, infos?: Info[]) {
    this.writerid = writerid;
    this.writername = writername;
    this.dynastyid = dynastyid;
    this.dynastyname = DYNASTYS[dynastyid];
    this.summary = summary;
    this.infos = infos;
  }
}
export default Writer;
