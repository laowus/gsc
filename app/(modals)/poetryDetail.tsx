import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import PoetryDao from "@/dao/PoetryDao";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Poetry from "@/model/Poetry";

// 处理 HTML 标签的函数
const parseHtmlContent = (html: string) => {
  // 先将 <br> 系列标签替换为换行符
  const textWithLineBreaks = html.replace(/<br\s*\/?>/gi, "\n");
  // 按换行符分割成段落
  const paragraphs = textWithLineBreaks.split("\n");

  return paragraphs.map((paragraph, index) => {
    const parts: React.ReactNode[] = [];
    let remaining = " ".repeat(8) + paragraph;
    const emRegex = /<em>(.*?)<\/em>/gi;
    let match;

    while ((match = emRegex.exec(remaining)) !== null) {
      const beforeEm = remaining.slice(0, match.index);
      if (beforeEm) {
        parts.push(beforeEm);
      }
      parts.push(
        <Text key={parts.length} style={{ fontStyle: "italic" }}>
          {match[1]}
        </Text>
      );
      remaining = remaining.slice(match.index + match[0].length);
    }

    if (remaining) {
      parts.push(remaining);
    }

    return (
      <ThemedView key={index} style={styles.paragraph}>
        {/* 直接在 ThemedText 上应用包含字体大小的样式 */}
        <ThemedText style={[styles.paragraphText]}>{parts}</ThemedText>
      </ThemedView>
    );
  });
};

export default function PoetryDetail() {
  const params = useLocalSearchParams();
  const poetryid = typeof params.poetryid === "string" ? parseInt(params.poetryid, 10) : NaN;
  const [poetry, setPoetry] = useState<Poetry | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPoetryContent = async () => {
      try {
        const _poetry = await PoetryDao.getPoetryById(poetryid);
        if (_poetry) {
          const updatedPoetry = { ..._poetry };
          setPoetry(updatedPoetry);
          navigation.setOptions({ title: `${updatedPoetry.title} ` });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("获取诗歌内容时出错:", error.message);
        } else {
          console.error("获取诗歌内容时出错: 未知错误", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPoetryContent();
  }, [poetryid]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>加载中...</ThemedText>
      </ThemedView>
    );
  }

  if (!poetry) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>未找到诗歌内容</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <ThemedView style={[styles.container, { alignItems: "center", justifyContent: "flex-start" }]}>
        <ThemedText style={styles.title}>{`(${poetry.writer.dynasty} ) ${poetry.writer.writername}`}</ThemedText>
        {parseHtmlContent(poetry.content || "")}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 12,
    alignSelf: "flex-start"
  },
  paragraph: {
    width: "100%",
    marginBottom: 8,
    textAlign: "center"
  },
  // 新增段落文字样式，设置字体大小
  paragraphText: {
    fontSize: 20
  }
});
