import { SelectList } from "react-native-dropdown-select-list";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DYNASTYS, KINDS } from "@/constants/Utils";
import Writer from "@/model/Writer";
import WriterDao from "@/dao/WriterDao";
import Type from "@/model/Type";
import TypeDao from "@/dao/TypeDao";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import useAppStore from "@/store/appStore";

const type1 = new Type(0, "不限");

export default function setLikeScreen() {
  const navigation = useNavigation();
  const params = useAppStore((state) => state.params);

  const [did, setDid] = useState(0);
  const [wid, setWid] = useState(0); //作者id
  const [kid, setKid] = useState(0); //体裁
  const [ptid, setPtid] = useState(0); //一级类型
  const [ctid, setCtid] = useState(0); //二级类型

  const [writerName, setWriterName] = useState("");
  const [writerList, setWriterList] = useState<Writer[]>([]);
  //保存类型数据集合
  const [parentTypes, setParentTypes] = useState<Type[]>([]);
  const [childTypes, setChildTypes] = useState<Type[]>([]);

  const fetchWriters = async (isInit: boolean) => {
    if (did != 0) {
      const res = await WriterDao.getWritersByDid(did);
      if (res.length > 0) {
        setWriterList(res);
        !isInit ? setWid(res[0].writerid) : setWid(wid);
      }
    }
  };

  //空依赖,初始化数据
  useEffect(() => {
    //去默认顶部栏
    navigation.setOptions({
      headerShown: false
    });

    //获取类型的第一级数据
    const initPtlist = async () => {
      TypeDao.getChildTypes(0).then((res) => {
        const newRes = [type1, ...res];
        setParentTypes(newRes);
      });
    };
    initPtlist();
    const [did, wid, kid, ptid, ctid] = params;
    console.log("did", did, "wid", wid, "kid", kid, "ptid", ptid, "ctid", ctid);
    setDid(did);
    fetchWriters(true);
    // wid 获取

    setWid(wid);
    setKid(kid);
    setPtid(ptid);
    setCtid(ctid);
  }, []);

  useEffect(() => {
    console.log("改变", did);
    fetchWriters(false);
  }, [did]);

  useEffect(() => {
    //一级分类改变,二级分类也改变
    const fetchChilds = async () => {
      if (ptid != 0) {
        const res = await TypeDao.getChildTypes(ptid);
        setChildTypes(res);
        //一级分类改变,二级分类默认第一个
        setCtid(res[0].typeid);
      } else {
        //一级分类为空,二级分类也为空
        setChildTypes([]);
      }
    };
    fetchChilds();
  }, [ptid]);

  const setWriter = (wid: number) => {
    setWid(wid);
    setWriterName(writerList.find((writer) => writer.writerid == wid)?.writername || "");
  };

  const changeParams = () => {
    console.log("作者wid", wid, "体裁kid", kid, "一级分类ptid", ptid, "一级分类ctid", ctid);
    //生成一个params,保存到appStore
    const params = [did, wid, kid, ptid, ctid];
    useAppStore.setState({ params });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ThemedText style={styles.backButtonText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText>设置喜欢的</ThemedText>
        <TouchableOpacity style={styles.saveButton}>
          <ThemedText style={styles.saveButtonText} onPress={changeParams}>
            修 改
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.writer}>
        <ThemedText style={styles.title}>作者 :</ThemedText>
        <ThemedView style={styles.dynastyname}>
          <SelectList
            setSelected={setDid}
            data={DYNASTYS.map((dynasty, index) => ({
              key: index,
              value: dynasty
            }))}
            save="key"
            dropdownStyles={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 999, backgroundColor: "white" }}
            defaultOption={{
              key: did,
              value: DYNASTYS[did]
            }}
          />
        </ThemedView>
        <ThemedView style={styles.writername}>
          {did != 0 && (
            <SelectList
              setSelected={setWid}
              data={writerList.map((writer) => ({ key: writer.writerid, value: writer.writername }))}
              save="key"
              defaultOption={{
                key: writerList.findIndex((writer) => writer.writerid === wid),
                value: writerList.find((writer) => writer.writerid == wid)?.writername || ""
              }}
              dropdownStyles={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 999, backgroundColor: "white" }}
            />
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.writer}>
        <ThemedText style={styles.title}>体裁 :</ThemedText>
        <ThemedView style={styles.dynastyname}>
          <SelectList
            setSelected={setKid}
            data={KINDS.map((kind, index) => ({
              key: index,
              value: kind
            }))}
            save="key"
            dropdownStyles={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 999, backgroundColor: "white" }}
            defaultOption={{
              key: kid,
              value: KINDS[kid]
            }}
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.writer}>
        <ThemedText style={styles.title}>类型 :</ThemedText>
        <ThemedView style={styles.dynastyname}>
          <SelectList
            setSelected={setPtid}
            data={parentTypes.map((item) => ({
              key: item.typeid,
              value: item.typename
            }))}
            save="key"
            dropdownStyles={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 999, backgroundColor: "white" }}
            defaultOption={{
              key: ptid || 0,
              value: parentTypes.find((type) => type.typeid == ptid)?.typename || "不限"
            }}
          />
        </ThemedView>
        <ThemedView style={styles.writername}>
          {childTypes.length > 0 && (
            <SelectList
              setSelected={setCtid}
              data={childTypes.map((item) => ({
                key: item.typeid,
                value: item.typename
              }))}
              save="key"
              dropdownStyles={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 999, backgroundColor: "white" }}
              defaultOption={{
                key: ctid || 0,
                value: childTypes.find((type) => type.typeid == ctid)?.typename || "不限"
              }}
            />
          )}
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    // 新增样式，使内容两边对齐
    justifyContent: "space-between",
    gap: 10
  },
  writer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10
  },
  title: {
    paddingTop: 10
  },
  dynastyname: {
    width: "40%"
  },
  writername: { width: "40%", height: "100%" },
  kind: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10
  },
  // 新增返回按钮样式
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
    marginRight: 10
  }, // 保存按钮样式
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center"
  },
  saveButtonText: {
    color: "white",
    fontSize: 14,
    paddingHorizontal: 8
  }
});
