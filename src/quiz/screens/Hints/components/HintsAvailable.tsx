import { ThemedText } from "@/src/common/components/ThemedText";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { useHints } from "@/src/quiz/store/hooks/useHints";
import { useCallback } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import sharedHintstyles from "./Hints.styles";

interface HintsAvailableProps {
	quizId: string;
	questionId: number;
	onHintPurchased: (content: string) => void;
}

export const HintsAvailable: React.FC<HintsAvailableProps> = ({
	quizId,
	questionId,
	onHintPurchased,
}) => {
	const {
		purchasableHints,
		pointsBalance,
		handleUseHint: applyHint,
	} = useHints(quizId, questionId);

	const textColor = useThemeColor({}, "text");

	const handlePurchaseHint = useCallback(
		async (hintId: string, cost = 0) => {
			return Alert.alert(
				"Hinweis freischalten?",
				`Der Hinweis benötigt ${cost} Punkt${cost !== 1 ? "e" : ""}. Du hast aktuell ${pointsBalance} Punkte.`,
				[
					{
						text: "Abbrechen",
						style: "cancel",
					},
					{
						text: "Freischalten",
						onPress: async () => {
							const result = await applyHint(hintId);
							if (result.success && result.hintContent) {
								onHintPurchased(result.hintContent);
							}
						},
					},
				],
				{ cancelable: true },
			);
		},
		[applyHint, onHintPurchased, pointsBalance],
	);

	return (
		<View>
			{purchasableHints.map(({ hint, canUse, reason }) => (
				<TouchableOpacity
					key={hint.id}
					style={[sharedHintstyles.card, !canUse && sharedHintstyles.cardDisabled]}
					onPress={() => canUse && handlePurchaseHint(hint.id, hint.cost)}
					disabled={!canUse}
					activeOpacity={0.7}
				>
					<View style={styles.hintHeader}>
						<ThemedText style={[sharedHintstyles.hintTitle]}>
							{hint.title}
						</ThemedText>
						<View style={styles.hintCost}>
							<ThemedText style={styles.costText}>🦧</ThemedText>
							<ThemedText style={styles.costText}>{hint.cost}</ThemedText>
						</View>
					</View>
				</TouchableOpacity>
			))}

			{purchasableHints.length === 0 && (
				<View style={styles.noHintsContainer}>
					<ThemedText style={[styles.noHintsText, { color: textColor }]}>
						Keine kaufbaren Hinweise verfügbar
					</ThemedText>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	hintHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	hintCost: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: "#fff3cd",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	costText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#856404",
	},

	noHintsContainer: {
		padding: 32,
		alignItems: "center",
	},
	noHintsText: {
		textAlign: "center",
		fontSize: 16,
		fontStyle: "italic",
	},
	cardDisabled: {
		opacity: 0.5,
	},
});
