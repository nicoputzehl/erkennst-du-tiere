import { ThemedText } from "@/src/common/components/ThemedText";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";

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
			<ThemedText>🦧</ThemedText>
			<ThemedText
				style={[
					compact ? styles.pointsTextCompact : styles.pointsTextLarge,
					{ color: textColor },
				]}
			>
				{pointsBalance}
			</ThemedText>
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
