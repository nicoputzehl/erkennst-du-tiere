import { BorderRadius, Shadows } from "@/src/common/constants/Styles";
import { StyleSheet, TouchableOpacity } from "react-native";
import type { ActiveCardProps } from "../types";
import { useCardStyle } from "../hooks/useCardStyle";

export const ActiveCard = ({
  itemWidth,
  onPress,
  children
}: ActiveCardProps) => {
  const cardStyle = useCardStyle(itemWidth, false);

  return (
    <TouchableOpacity
      style={[styles.questionCard, cardStyle]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
    // accessibilityLabel={`Quiz-Frage ${item.id}${isSolved ? ", bereits gelöst" : ""}`}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    boxShadow: Shadows.boxShadow,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
