import { SelectList } from "react-native-dropdown-select-list";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
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
import PoetryDao from "@/dao/PoetryDao";

const type1 = new Type(0, "不限", 999);
/**
 * 思路:
 * wid => 获取did
 * kid
 * ctid => 获取ptid
 *
 */

export default function setLikeScreen() {
  const navigation = useNavigation();
  const params = useAppStore((state) => state.params);

  const [did, setDid] = useState(0);
  const [wid, setWid] = useState(0); //作者id
  const [kid, setKid] = useState(0); //体裁
  const [ptid, setPtid] = useState(0); //一级类型
  const [ptName, setPtName] = useState("不限"); //一级类型名称
  const [ctid, setCtid] = useState(0); //二级类型
  const [ctName, setCtName] = useState(""); //二级类型名称

  const [writerName, setWriterName] = useState("");
  const [writerList, setWriterList] = useState<Writer[]>([]);
  //保存类型数据集合
  const [parentTypes, setParentTypes] = useState<Type[]>([]);
  const [childTypes, setChildTypes] = useState<Type[]>([]);

  //空依赖,初始化数据
  useEffect(() => {
    console.log("获取params", params);
    //去默认顶部栏
    navigation.setOptions({
      headerShown: false
    });
    /**
     * 根据wid,设置wid, 获取作者信息,并设置did
     */
    WriterDao.getWriterByWid(params[0]).then((res) => {
      setDid(res.dynastyid);
      setWid(res.writerid);
      setWriterName(res.writername);
      //获取作者列表
      WriterDao.getWritersByDid(res.dynastyid).then((res) => {
        setWriterList(res);
      });
    });
    //体裁
    setKid(params[1]);

    //分类处理
    setCtid(params[2]);

    //获取一级分类列表
    TypeDao.getChildTypes(0).then((res) => {
      //给一级列表插入第一个元素 {typeid:0,typename:"不限",parentid:999}
      res.unshift(type1);
      setParentTypes(res);
      if (params[2] !== 0) {
        TypeDao.getParentAndTypeById(params[2]).then((res: any) => {
          if (res.length > 0) {
            setPtName(res[0].pname);
            setPtid(res[0].pid);
            setCtName(res[0].typename);
            TypeDao.getChildTypes(res[0].pid).then((res) => {
              setChildTypes(res);
            });
          }
        });
      } else {
        if (res.length > 0) {
          console.log("最新的分类列表", res);
          // 确保 res 不为空再设置状态
          setPtName(res[0].typename);
          setPtid(res[0].typeid);
        } else {
          console.log("getChildTypes 返回空数组");
          // 设置默认值
          setPtName("不限");
          setPtid(0);
        }
      }
    });
  }, []);

  const changeParams = () => {
    console.log("作者wid", wid, "体裁kid", kid, "二级分类ctid", ctid);
    //生成一个params,保存到appStore
    // 获取当前过滤参数下 是否有内容
    const params = [wid, kid, ctid];
    PoetryDao.getAllPoetry(params).then((res) => {
      if (res.length > 0) {
        // 有内容,直接返回
        useAppStore.setState({ params });
        navigation.goBack();
      } else {
        Alert.alert(
          "提示",
          "没有你喜欢的诗词,请重新选择!",
          [
            {
              text: "确定",
              style: "default"
            }
          ],
          { cancelable: false }
        );
      }
    });
  };

  const changeWriter = (wid: number) => {
    // 添加检查，避免在初始化时不必要的更新
    if (wid !== undefined && wid !== null) {
      console.log("改变作者", wid);
      setWid(wid);
      setWriterName(writerList.find((writer) => writer.writerid === wid)?.writername || "");
    }
  };

  const changePt = (ptid: number) => {
    if (ptid !== undefined && ptid !== null) {
      setPtid(ptid);
      setPtName(parentTypes.find((type) => type.typeid === ptid)?.typename || "");
      if (ptid != 0) {
        //更新二级分类信息
        TypeDao.getChildTypes(ptid).then((res) => {
          setChildTypes(res); //更新二级分类
          //二级分类改变,默认第一个
          setCtid(res[0].typeid);
          setCtName(res[0].typename);
        });
      } else {
        //一级分类为空,二级分类也为空
        setChildTypes([]);
        setCtid(0);
      }
    }
  };

  const changeCt = (ctid: number) => {
    if (ctid !== undefined && ctid !== null) {
      setCtid(ctid);
      setCtName(childTypes.find((type) => type.typeid === ctid)?.typename || "");
    }
  };

  const changeDynasty = (did: number) => {
    if (did !== undefined && did !== null) {
      setDid(did);
      if (did != 0) {
        //更新二级分类信息
        WriterDao.getWritersByDid(did).then((res) => {
          setWriterList(res); //更新二级分类
          //二级分类改变,默认第一个
          setWid(res[0].writerid);
          setWriterName(res[0].writername);
        });
      } else {
        //朝代为空 作者列表也为空
        setWriterList([]);
        setWid(0);
        setWriterName("");
      }
    }
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
            setSelected={(val: number) => {
              if (val !== did) {
                changeDynasty(val);
              }
            }}
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
              setSelected={(val: number) => {
                if (val !== wid) {
                  changeWriter(val);
                }
              }}
              data={writerList.map((writer) => ({ key: writer.writerid, value: writer.writername }))}
              save="key"
              defaultOption={{
                key: wid,
                value: writerName
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
            setSelected={(val: number) => {
              if (val !== ptid) {
                changePt(val);
                console.log("setSelected一级分类", val);
              }
            }}
            data={parentTypes.map((item) => ({
              key: item.typeid,
              value: item.typename
            }))}
            save="key"
            dropdownStyles={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 999, backgroundColor: "white" }}
            defaultOption={{
              key: ptid,
              value: ptName
            }}
          />
        </ThemedView>
        <ThemedView style={styles.writername}>
          {childTypes.length > 0 && (
            <SelectList
              setSelected={(val: number) => {
                if (val !== ctid) {
                  changeCt(val);
                }
              }}
              data={childTypes.map((item) => ({
                key: item.typeid,
                value: item.typename
              }))}
              save="key"
              dropdownStyles={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 999, backgroundColor: "white" }}
              defaultOption={{
                key: ctid,
                value: ctName
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
