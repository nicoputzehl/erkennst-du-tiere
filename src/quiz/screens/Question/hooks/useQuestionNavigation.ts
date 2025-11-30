import { NavigationService } from "@/src/quiz/services/NavigationService";
import { useCallback } from "react";

export const useQuestionNavigation = (quizId: string, questionId: string) => {
	const navigateToHintsModal = useCallback(
		() => NavigationService.toHints(quizId, questionId),
		[quizId, questionId],
	);

	const navigateToQuestionFromQuestion = useCallback(
		(nextQuestionId: string) =>
			NavigationService.toQuestionFromQuestion(quizId, nextQuestionId),
		[quizId],
	);

	const handleBack = useCallback(() => NavigationService.back(), []);

	return {
		navigateToHintsModal,
		navigateToQuestionFromQuestion,
		handleBack,
	};
};
