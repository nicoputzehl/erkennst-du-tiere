import { memo } from "react";
import { View } from "react-native";

import { styles } from "../../QuizCard.styles";
import type { QuizCardViewProps } from "../../QuizCard.types";
import { Progress } from "./Progress";

export const ProgressSection = memo(
	({
		variant,
		unlockProgress,
		quizCardProgress,
		quizCardProgressString,
	}: Pick<
		QuizCardViewProps,
		"variant" | "unlockProgress" | "quizCardProgress" | "quizCardProgressString"
	>) => {
		return (
			<View style={styles.activeProgressContainer}>
				<Progress
					quizCardProgress={quizCardProgress ?? 0}
					quizCardProgressString={quizCardProgressString ?? null}
				/>
			</View>
		);
	},
);
ProgressSection.displayName = "QuizCardProgressSection";
