class Rhesis {
  rhesisid: number;
  rcontent: string;
  poetryid: number;
  title: string;
  writername: string;
  dynastyid: number;

  constructor(rhesisid: number, rcontent: string, poetryid: number, title: string, writername: string, dynastyid: number) {
    this.rhesisid = rhesisid;
    this.rcontent = rcontent;
    this.poetryid = poetryid;
    this.title = title;
    this.writername = writername;
    this.dynastyid = dynastyid;
  }
}

export default Rhesis;
