import { BorderRadius, Shadows } from "@/src/common/constants/Styles";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons"
import { View, StyleSheet } from "react-native"
import type { InactiveCardProps } from "../types";
import { useCardStyle } from "../hooks/useCardStyle";

export const InactiveCard = ({ itemWidth }: InactiveCardProps) => {
  const iconColor = useThemeColor({}, "icon");

  const cardStyle = useCardStyle(itemWidth, true);


  return <View style={[styles.questionCard, cardStyle]}>
    <View style={styles.container}>
      <FontAwesome6
        name="lock"
        size={48}
        color={typeof iconColor === "string" ? iconColor : "gray"}
      />
    </View>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  questionCard: {
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    boxShadow: Shadows.boxShadow,
  },
});
