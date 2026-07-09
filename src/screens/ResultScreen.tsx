import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { styles } from "../styles";
import type { ScanResult } from "../types";

type ResultNoticeState = {
  title: string;
  message: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  textStyle: typeof styles.enterResultText;
  resultStyle: typeof styles.enterResult;
};

function getResultNoticeState(result: ScanResult): ResultNoticeState {
  if (result.isValid && result.scanCount === 1) {
    return {
      title: "Thank You!",
      message: "You can Enter",
      iconName: "arrow-up-circle",
      iconColor: "#00bf13",
      textStyle: styles.enterResultText,
      resultStyle: styles.enterResult,
    };
  }

  if (result.isValid && result.scanCount === 2) {
    return {
      title: "Thank You!",
      message: "You can Exit",
      iconName: "arrow-up-circle",
      iconColor: "#00bf13",
      textStyle: styles.exitResultText,
      resultStyle: styles.exitResult,
    };
  }

  return {
    title: "Invalid QR",
    message: "Code Ticket",
    iconName: "close-circle",
    iconColor: "#e4310a",
    textStyle: styles.invalidResultText,
    resultStyle: styles.invalidResult,
  };
}

export function ResultScreen({ result, onRetry }: { result: ScanResult; onRetry: () => void }) {
  const noticeState = getResultNoticeState(result);

  return (
    <View style={[styles.resultLayout, noticeState.resultStyle]}>
      <View style={styles.resultNoticeRow}>
        <View style={styles.resultCopy}>
          <Text style={[styles.resultTitle, noticeState.textStyle]}>{noticeState.title}</Text>
          <Text style={[styles.resultMessage, noticeState.textStyle]}>{noticeState.message}</Text>
        </View>

        <View style={styles.resultIcon}>
          <Ionicons name={noticeState.iconName} size={134} color={noticeState.iconColor} />
        </View>
      </View>

      <Text accessibilityRole="button" onPress={onRetry} style={styles.resultRetryText}>
        Tap to scan again
      </Text>
    </View>
  );
}
