import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface PointsDisplayProps {
	compact?: boolean;
	pointsBalance: number;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({
	compact = false,
	pointsBalance
}) => {

	const textColor = useThemeColor({}, "text");

	return (
		<View
			style={[styles.pointsDisplay, compact && styles.pointsDisplayCompact]}
		>
			<FontAwesome6 name="coins" size={compact ? 14 : 18} color="#FFD700" />
			<Text
				style={[
					compact ? styles.pointsTextCompact : styles.pointsTextLarge,
					{ color: textColor },
				]}
			>
				{pointsBalance}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	pointsDisplay: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "rgba(255, 215, 0, 0.2)",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	pointsDisplayCompact: {
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	pointsTextLarge: {
		fontSize: 16,
		fontWeight: "600",
	},
	pointsTextCompact: {
		fontSize: 14,
		fontWeight: "600",
	},
});
