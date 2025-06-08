// src/quiz/screens/Question/components/QuestionResult/WrongAnswer.tsx - ENHANCED VERSION
import { StyleSheet, View } from "react-native";
import React from "react";
import Button from "@/src/common/components/Button";
import { ThemedText } from "@/src/common/components/ThemedText";

export type WrongAnswerProps = {
	onTryAgain: () => void;
	// NEUE PROPS für gekaufte Hints (dauerhaft)
	purchasedHints?: string[];
};

const WrongAnswer = ({ onTryAgain, purchasedHints }: WrongAnswerProps) => {
	return (
		<View style={styles.container}>
			<ThemedText style={[styles.resultText, styles.wrongText]} type="title">
				Leider falsch
			</ThemedText>

			{purchasedHints && purchasedHints.length > 0 && (
				<View style={styles.purchasedHintsContainer}>
					<ThemedText style={styles.purchasedHintsTitle}>
						💰 Deine gekauften Hinweise:
					</ThemedText>
					{purchasedHints.map((hint, index) => (
						<View
							key={`${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}-hint-wrong-answer`}
							style={styles.purchasedHintItem}
						>
							<ThemedText style={styles.purchasedHintContent}>
								{hint}
							</ThemedText>
						</View>
					))}
				</View>
			)}

			<View style={styles.buttonRow}>
				<Button
					text="Nochmal versuchen"
					onPress={onTryAgain}
					style={styles.tryAgainButton}
				/>
			</View>
		</View>
	);
};

export default WrongAnswer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
	},
	resultText: {
		textAlign: "center",
		marginBottom: 30,
	},
	wrongText: {
		color: "#F44336", // Konsistente rote Farbe
	},

	// NEUE Styles für purchased hints (dauerhaft)
	purchasedHintsContainer: {
		backgroundColor: "#E3F2FD",
		padding: 16,
		borderRadius: 12,
		marginVertical: 20,
		width: "100%",
		borderWidth: 2,
		borderColor: "#1976D2",
	},
	purchasedHintsTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1976D2",
		marginBottom: 12,
		textAlign: "center",
	},
	purchasedHintItem: {
		backgroundColor: "#BBDEFB",
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
		borderLeftWidth: 4,
		borderLeftColor: "#1976D2",
	},
	purchasedHintContent: {
		fontSize: 15,
		color: "#0D47A1",
		lineHeight: 22,
	},

	buttonRow: {
		flexDirection: "row",
		gap: 12,
		marginTop: 20,
	},
	tryAgainButton: {
		flex: 1,
		backgroundColor: "#FF9800",
		padding: 12,
		borderRadius: 8,
		alignItems: "center",
	},
});
