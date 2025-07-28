import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";
import { DYNASTYS } from "@/constants/Utils";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import Writer from "@/model/Writer";
import WriterDao from "@/dao/WriterDao";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "@react-navigation/native";

export default function setLikeScreen() {
  const [did, setDid] = useState(0);
  const [wid, setWid] = useState(0);
  const [writerName, setWriterName] = useState("");
  const [writerList, setWriterList] = useState<Writer[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  useEffect(() => {
    const fetchWriters = async () => {
      if (did != 0) {
        const res = await WriterDao.getWritersByDid(did);
        if (res.length > 0) {
          setWriterList(res);
          setWid(res[0].writerid);
          setWriterName(res[0].writername);
        }
      }
    };

    fetchWriters();
  }, [did]);

  const setWriter = (wid: number) => {
    console.log(wid);
    setWid(wid);
    setWriterName(writerList.find((writer) => writer.writerid == wid)?.writername || "");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ThemedText style={styles.backButtonText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText>设置喜欢的</ThemedText>
        <TouchableOpacity style={styles.saveButton}>
          <ThemedText style={styles.saveButtonText}> 修 改 </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.writer}>
        <ThemedText style={styles.title}>作者:</ThemedText>
        <ThemedView style={styles.dynastyname}>
          <SelectList
            setSelected={setDid}
            data={DYNASTYS.map((dynasty, index) => ({
              key: index.toString(),
              value: dynasty
            }))}
            save="key"
            dropdownStyles={{
              backgroundColor: "white"
            }}
            defaultOption={{
              key: did,
              value: DYNASTYS[did]
            }}
          />
        </ThemedView>
        <ThemedView style={styles.writername}>
          {did != 0 && (
            <SelectList
              setSelected={setWriter}
              data={writerList.map((writer) => ({ key: writer.writerid, value: writer.writername }))}
              save="key"
              defaultOption={{
                key: wid,
                value: writerName
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
    height: "100%",
    paddingTop: 10
  },
  dynastyname: {
    width: "40%",
    height: "100%"
  },
  writername: { width: "40%", height: "100%" },
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
