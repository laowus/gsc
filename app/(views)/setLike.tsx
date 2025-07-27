import { ThemedText } from "@/components/ThemedText";
import useAppStore from "@/store/appStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { DYNASTYS } from "@/constants/Utils";

export default function setLikeScreen() {
  // const params = useAppStore((state) => state.params);
  // const curPid = useAppStore((state) => state.curPid);
  // const [selectedDynasty, setSelectedDynasty] = useState<string | null>(null);

  // const dynastyItems = DYNASTYS.map((dynasty) => ({
  //   label: dynasty,
  //   value: dynasty
  // }));

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <ThemedText>设置喜欢</ThemedText>
      <ThemedText>
        {/* 作者: {params[0]}{" "} */}
        {/* <RNPickerSelect
          onValueChange={(value) => setSelectedDynasty(value)}
          items={dynastyItems}
          style={{
            inputIOS: {
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 5,
              padding: 10,
              marginTop: 10
            },
            inputAndroid: {
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 5,
              padding: 10,
              marginTop: 10
            }
          }}
          placeholder={{ label: "请选择朝代", value: null }}
        /> */}
      </ThemedText>

      {/* <ThemedText>体裁: {params[1]}</ThemedText>
      <ThemedText>类型: {params[2]}</ThemedText> */}
    </SafeAreaView>
  );
}
