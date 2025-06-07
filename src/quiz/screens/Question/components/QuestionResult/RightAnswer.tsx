import { StyleSheet, View } from "react-native";
import React from "react";
import { WikipediaLink } from "@/src/quiz/screens/Question/components/WikipediaLink";
import Button from "@/src/common/components/Button";
import { ThemedText } from "@/src/common/components/ThemedText";
import { Lottie } from "../Lottie";

export type RightAnswerProps = {
	funFact?: string;
	onBack: () => void;
	wikipediaSlug: string;
	statusChanged: boolean;
	answer: string;
};

const RightAnswer = ({
	funFact,
	wikipediaSlug,
	onBack,
	statusChanged,
	answer,
}: RightAnswerProps) => {
	return (
		<View style={styles.container}>
			{statusChanged && <Lottie />}
			<View>
				<View style={styles.headlineWrapper}>
					{statusChanged ? (
						<ThemedText
							style={[styles.resultText, styles.correctText]}
							type="title"
						>
							Richtig!
						</ThemedText>
					) : (
						<ThemedText style={styles.resultText} type="title">
							{answer}
						</ThemedText>
					)}
					<WikipediaLink slug={wikipediaSlug} />
				</View>
				{funFact && (
					<>
						<ThemedText style={styles.funFactHeader} type="subtitle">
							Wusstest du das ...
						</ThemedText>
						<ThemedText style={styles.funFact}>{funFact}</ThemedText>
					</>
				)}
			</View>
			<View style={styles.buttonRow}>
				<Button
					text="Zur Übersicht"
					onPress={onBack}
					style={styles.nextQuestionButton}
				/>
			</View>
		</View>
	);
};

export default RightAnswer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
	},
	resultText: {
		textAlign: "center",
		marginBottom: 20,
	},
	correctText: {
		color: "#4CAF50", // Konsistente grüne Farbe
	},
	funFact: {
		fontSize: 16,
		marginBottom: 20,
		lineHeight: 24,
	},
	funFactHeader: {
		marginBottom: 10,
	},
	buttonRow: {
		flexDirection: "row",
		gap: 12,
		marginTop: 20,
	},
	nextQuestionButton: {
		flex: 1,
		backgroundColor: "#4CAF50",
		padding: 12,
		borderRadius: 8,
		alignItems: "center",
	},
	headlineWrapper: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
});
