import type { ReactNode } from "react";
import { Pressable, Text, type StyleProp, type ViewStyle } from "react-native";

import { styles } from "../styles";

type PrimaryButtonProps = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary";
  buttonStyle?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ label, icon, onPress, variant = "primary", buttonStyle }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" && styles.secondaryButton,
        buttonStyle,
        pressed && styles.buttonPressed,
      ]}
    >
      {icon}
      <Text style={[styles.buttonText, variant === "secondary" && styles.secondaryButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}
