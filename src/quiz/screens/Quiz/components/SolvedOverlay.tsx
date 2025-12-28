import { ColorsValues } from "@/src/common/constants/Colors.values";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import type { SolvedOverlayProps } from "../types";

export const SolvedOverlay = ({ isVisible }: SolvedOverlayProps) => {


  if (!isVisible) {
    return null;
  }
  return (
    <View style={[styles.solvedOverlay]}>
      <View style={styles.triangle} />
      <Ionicons name="checkmark" size={24} color="white"  style={styles.icon}/>
    </View>
  );
};
const TRIANGLE_SIZE = 48;
const styles = StyleSheet.create({
  solvedOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 3,
    borderRadius: 6,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: TRIANGLE_SIZE,
    borderTopWidth: TRIANGLE_SIZE,
    borderRightColor: "transparent",
    borderTopColor: ColorsValues.moonshineblue,
    transform: [{ rotate: "180deg" }],
    position: "absolute",
  },
  icon: {
    color: ColorsValues.pumpkin,
  }
});