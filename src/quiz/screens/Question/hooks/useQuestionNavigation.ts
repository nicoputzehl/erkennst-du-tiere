import { useCallback } from "react";
import { NavigationService } from "@/src/quiz/services/NavigationService";

export const useQuestionNavigation = (quizId: string, questionId: string) => {
	const navigateToHintsModal = useCallback(() => NavigationService.toHints(quizId, questionId)
		, [quizId, questionId]);

	const navigateToQuestionFromQuestion = useCallback((nextQuestionId: string) => NavigationService.toQuestionFromQuestion(quizId, nextQuestionId)
		, [quizId]);

	const handleBack = useCallback(() => NavigationService.back(), []);

	return {
		navigateToHintsModal,
		navigateToQuestionFromQuestion,
		handleBack,
	};
};
