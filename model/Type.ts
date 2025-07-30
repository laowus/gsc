class Type {
  typeid: number;
  typename: string;
  parentid?: number;
  constructor(typeid: number, typename: string, parentid?: number) {
    this.typeid = typeid;
    this.typename = typename;
    this.parentid = parentid;
  }
}

export default Type;
