import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "react-native";

interface HtmlParserProps {
  html: string;
  fontSize?: number; // 可选字体大小属性
  indent?: number; // 可选缩进属性
}

const HtmlParser: React.FC<HtmlParserProps> = ({ html, fontSize = 20, indent = 8 }) => {
  // 先将 <br> 系列标签替换为换行符
  const textWithLineBreaks = html.replace(/<br\s*\/?>/gi, "\n");
  // 按换行符分割成段落，并过滤掉空行
  const paragraphs = textWithLineBreaks.split("\n").filter((paragraph) => paragraph.trim() !== "");

  const styles = StyleSheet.create({
    paragraph: {
      width: "100%",
      marginBottom: 8,
      textAlign: "center"
    },
    paragraphText: {
      fontSize // 使用传入的字体大小
    }
  });

  return paragraphs.map((paragraph, index) => {
    const parts: React.ReactNode[] = [];
    let remaining = " ".repeat(indent) + paragraph; // 使用传入的缩进
    const emRegex = /<em>(.*?)<\/em>/gi;
    let match;

    while ((match = emRegex.exec(remaining)) !== null) {
      const beforeEm = remaining.slice(0, match.index);
      if (beforeEm) {
        parts.push(beforeEm);
      }
      parts.push(
        <Text key={parts.length} style={{ fontStyle: "italic", fontSize }}>
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

export default HtmlParser;
