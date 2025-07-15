import Info from "./Info";
import { DYNASTYS } from "../constants/Utils";

class Writer {
  writerid: number;
  writername: string;
  dynasty: string;
  summary?: string;
  infos?: Info[];
  constructor(writerid: number, writername: string, dynastyid: number, summary?: string, infos?: Info[]) {
    this.writerid = writerid;
    this.writername = writername;
    this.dynasty = DYNASTYS[dynastyid];
    this.summary = summary;
    this.infos = infos;
  }
}
export default Writer;
