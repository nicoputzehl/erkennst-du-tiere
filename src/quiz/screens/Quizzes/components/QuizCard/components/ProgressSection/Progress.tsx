import React, { memo } from "react";
import { View } from "react-native";

import { ThemedText } from "@/src/common/components/ThemedText";
import { ProgressIndicator } from "@/src/quiz/components/ProgressIndicator";
import { styles } from "../../quizCard.styles";
import type { QuizCardActiveProps } from "../../quizCard.types";

type QuizCardProgressProps = Pick<
	QuizCardActiveProps,
	"quizCardProgress" | "quizCardProgressString"
>;

export const Progress = memo(
	({ quizCardProgress, quizCardProgressString }: QuizCardProgressProps) => {
		if (!quizCardProgress) return null;
		return (
			<View style={styles.progressContainer}>
				<View style={styles.progressIndicatorContainer}>
					<ProgressIndicator progress={quizCardProgress} />
				</View>
				<ThemedText style={[styles.progressText]}>
					{quizCardProgressString}
				</ThemedText>
			</View>
		);
	},
);

Progress.displayName = "QuizCardProgress";
