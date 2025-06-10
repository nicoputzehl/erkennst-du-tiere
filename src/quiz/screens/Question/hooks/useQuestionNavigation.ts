import { router } from "expo-router";
import { useCallback } from "react";

export const useQuestionNavigation = (quizId: string, questionId: string) => {
	const navigateToHints = useCallback(() => {
		router.push(`/quiz/${quizId}/${questionId}/hints`);
	}, [quizId, questionId]);

	const handleBack = useCallback(() => {
		router.back();
	}, []);

	return { navigateToHints, handleBack };
};