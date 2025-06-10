import Button from "@/src/common/components/Button";
import { ThemedText } from "@/src/common/components/ThemedText";
import React from "react";
// src/quiz/screens/Question/components/QuestionResult/WrongAnswer.tsx - ENHANCED VERSION
import { StyleSheet, View } from "react-native";

export type WrongAnswerHint = {
	title: string;
	content: string;
};

export type WrongAnswerProps = {
	onTryAgain: () => void;
	hint?: WrongAnswerHint;
};

const WrongAnswer = ({ onTryAgain, hint }: WrongAnswerProps) => {
	console.log({ hint });
	return (
		<View style={styles.container}>
			<View>
				<ThemedText style={[styles.resultText, styles.wrongText]} type="title">
					{hint?.title ?? "Leider falsch!"}
				</ThemedText>
				{hint?.content && (
					<ThemedText style={styles.hintText}>{hint.content}</ThemedText>
				)}
			</View>
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
		color: "#FFC107",
	},
	hintText: {
		fontSize: 16,
		marginBottom: 20,
		lineHeight: 24,
	},

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
		padding: 16,
		borderRadius: 24,
		alignItems: "center",
		height: 48,
	},
});
