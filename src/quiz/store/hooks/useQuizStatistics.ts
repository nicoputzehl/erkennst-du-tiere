import { useMemo } from "react";

import {
	calculateCompletionPercentage,
	countCompletedQuestions,
	countCompletedQuizzes,
	countTotalQuestions,
	countTotalQuizzes,
} from "../../utils/quizStatistics";
import { useQuizStore } from "../Quiz.store";

/**
 * Statistics hook
 */
export function useQuizStatistics() {
	const quizStates = useQuizStore((state) => state.quizStates);

	return useMemo(() => {
		return {
			totalQuizzes: countTotalQuizzes(quizStates),
			completedQuizzes: countCompletedQuizzes(quizStates),
			totalQuestions: countTotalQuestions(quizStates),
			completedQuestions: countCompletedQuestions(quizStates),
			completionPercentage: calculateCompletionPercentage(
				countTotalQuestions(quizStates),
				countCompletedQuestions(quizStates),
			),
		};
	}, [quizStates]);
}
