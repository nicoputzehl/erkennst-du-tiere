import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { useHints } from "@/src/quiz/store/hooks/useHints";
import { FontAwesome6 } from "@expo/vector-icons";
import type React from "react";
import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HintButtonProps {
	quizId: string;
	questionId: number;
	onOpenHints: () => void;
}

export const HintButton: React.FC<HintButtonProps> = ({
	quizId,
	questionId,
	onOpenHints,
}) => {
	const { purchasableHints } = useHints(quizId, questionId);
	const availableCount = purchasableHints.filter((h) => h.canUse).length;
	const tintColor = useThemeColor({}, "tint");

	const handlePress = useCallback(() => {
		console.log("[HintButton] Opening purchase hints modal");
		onOpenHints();
	}, [onOpenHints]);

	// Nur anzeigen wenn kaufbare Hints verfügbar sind
	if (availableCount === 0) {
		return null;
	}

	return (
		<TouchableOpacity
			style={[styles.hintFloatingButton, { backgroundColor: tintColor }]}
			onPress={handlePress}
			activeOpacity={0.8}
		>
			<FontAwesome6 name="lightbulb" size={20} color="white" />
			{availableCount > 0 && (
				<View style={styles.hintBadge}>
					<Text style={styles.hintBadgeText}>{availableCount}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	hintFloatingButton: {
		position: "absolute",
		bottom: 100,
		right: 16,
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	hintBadge: {
		position: "absolute",
		top: -4,
		right: -4,
		backgroundColor: "#dc3545",
		borderRadius: 10,
		width: 20,
		height: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	hintBadgeText: {
		color: "white",
		fontSize: 12,
		fontWeight: "bold",
	},
});
