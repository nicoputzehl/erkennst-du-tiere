import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/common/components/ThemedText";
import { ProgressIndicator } from "@/src/quiz/components/ProgressIndicator";
import type { QuizCardActiveProps } from "./QuizCard.types";

type QuizCardProgressProps = Pick<
	QuizCardActiveProps,
	"quizCardProgress" | "quizCardProgressString"
>;

export const QuizCardProgress = ({
	quizCardProgress,
	quizCardProgressString,
}: QuizCardProgressProps) => {
	return (
		<View style={styles.progressContainer}>
			{quizCardProgress ? (
				<>
					<View style={[{ flex: 0.7 }]}>
						<ProgressIndicator progress={quizCardProgress} />
					</View>
					<ThemedText style={[styles.progressText, { flex: 0.3 }]}>
						{quizCardProgressString}
					</ThemedText>
				</>
			) : (
				<ThemedText style={styles.newText}>Neu</ThemedText>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	progressContainer: {
		flexDirection: "row",
		alignItems: "flex-end",
		gap: 8,
		width: "100%",
		justifyContent: "flex-end",
	},
	progressText: {
		fontSize: 14,
		color: "#666",
		zIndex: 1,
		textAlign: "right",
	},
	newText: {
		fontSize: 14,
		color: "#ff9800",
		fontWeight: "500",
	},
});
