import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { styles } from "../styles";
import { PrimaryButton } from "./PrimaryButton";

type NoticeScreenProps = {
  title: string;
  message: string;
  actionLabel: string;
  iconName: keyof typeof Ionicons.glyphMap;
  actionIconName: keyof typeof Ionicons.glyphMap;
  onAction: () => void;
  tone?: "default" | "error";
};

export function NoticeScreen({
  title,
  message,
  actionLabel,
  iconName,
  actionIconName,
  onAction,
  tone = "default",
}: NoticeScreenProps) {
  const isError = tone === "error";

  return (
    <View style={[styles.noticeLayout, isError && styles.errorNoticeLayout]}>
      <View style={[styles.noticeAccent, isError && styles.errorNoticeAccent]} />
      <View style={styles.noticeBody}>
        <View style={[styles.noticeIcon, isError && styles.errorNoticeIcon]}>
          <Ionicons name={iconName} size={54} color={isError ? "#dc2626" : "#f14136"} />
        </View>

        <View style={styles.noticeCopy}>
          <Text style={styles.noticeTitle}>{title}</Text>
          <Text style={styles.noticeText}>{message}</Text>
        </View>

        <View style={styles.noticeAction}>
          <PrimaryButton
            label={actionLabel}
            onPress={onAction}
            icon={<Ionicons name={actionIconName} size={28} color="#fff8f4" />}
          />
        </View>
      </View>
    </View>
  );
}
