import { NavigationService } from "@/src/quiz/services/NavigationService";
import { useLoading } from "@/src/quiz/store";
import { useQuiz } from "@/src/quiz/store/hooks/useQuiz";
import type { QuizState } from "@/src/quiz/types";
import { useCallback, useEffect, useState } from "react";

export function useQuizScreen(quizId: string | null) {
	const { getQuizState, initializeQuizState, getQuizProgress } = useQuiz();
	const { isLoading, startLoading, stopLoading } = useLoading("quizScreen");

	const [quizState, setQuizState] = useState<QuizState | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadQuiz = async () => {
			if (!quizId) {
				setError("Keine Quiz-ID angegeben");
				return;
			}

			startLoading();
			setError(null);

			try {
				let state: QuizState | undefined | null = getQuizState(quizId);

				if (!state) {
					state = initializeQuizState(quizId);
				}

				if (state) {
					setQuizState(state);
				} else {
					setError(`Quiz mit ID ${quizId} nicht gefunden`);
				}
			} catch (err) {
				console.error(`[useQuizScreen] Error loading quiz ${quizId}:`, err);
				setError(`Fehler beim Laden des Quiz: ${err}`);
			} finally {
				stopLoading();
			}
		};

		loadQuiz();
	}, [getQuizState, initializeQuizState, quizId, startLoading, stopLoading]);

	// Refresh state when coming back to screen
	useEffect(() => {
		if (quizId) {
			const currentState = getQuizState(quizId);
			if (currentState) {
				setQuizState(currentState);
			}
		}
	}, [quizId, getQuizState]);

	const handleQuestionClick = useCallback((questionId: number) => {
		if (quizId) {
			NavigationService.toQuestion(quizId, String(questionId));
		}
	},[quizId]);

	const navigateBack = useCallback(() => NavigationService.back() ,[]);

	return {
		quizState,
		isLoading,
		error,
		handleQuestionClick,
		navigateBack,
		getQuizProgress,
	};
}
