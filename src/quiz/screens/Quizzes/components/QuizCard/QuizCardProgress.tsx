import React from "react";
import { View } from "react-native";

import { ThemedText } from "@/src/common/components/ThemedText";
import { ProgressIndicator } from "@/src/quiz/components/ProgressIndicator";
import { styles } from "./QuizCard.styles";
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
					<View style={styles.progressIndicatorContainer}>
						<ProgressIndicator progress={quizCardProgress} />
					</View>
					<ThemedText style={[styles.progressText]}>
						{quizCardProgressString}
					</ThemedText>
				</>
			) : (
				<ThemedText style={styles.newText}>Neu</ThemedText>
			)}
		</View>
	);
};
