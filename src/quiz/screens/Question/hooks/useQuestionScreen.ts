// src/quiz/screens/Question/hooks/useQuestionScreen.ts - ENHANCED VERSION
import { useUI } from "@/src/quiz/store";
import { useQuiz } from "@/src/quiz/store/hooks/useQuiz";
import { QuestionStatus } from "@/src/quiz/types";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useHints } from "../../../store/hooks/useHints";
import type { WrongAnswerHint } from "../components/QuestionResult/WrongAnswer";

export function useQuestionScreen(quizId: string, questionId: string) {
	const { getQuizState, answerQuestion } = useQuiz();
	const { showSuccess } = useUI();
	const { recordWrongAnswer, markHintAsUsed, hasVisibleHints } = useHints(
		quizId,
		Number.parseInt(questionId),
	);

	const [answer, setAnswer] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [statusChanged, setStatusChanged] = useState(false);
	const [hint, setHint] = useState<WrongAnswerHint | undefined>(undefined);
	const [isHintsLinkVisible, setIsHintLinkVisible] =
		useState<boolean>(hasVisibleHints);

	const quizState = getQuizState(quizId);
	const question = quizState?.questions.find(
		(q) => q.id === Number.parseInt(questionId),
	);

	const isSolved = question?.status === QuestionStatus.SOLVED;

	useState(() => {
		if (isSolved) {
			setShowResult(true);
			setIsCorrect(true);
		}
	});

	const navigateToHints = useCallback(() => {
		router.push(`/quiz/${quizId}/${questionId}/hints`);
	}, [quizId, questionId]);

	const handleSubmit = useCallback(async () => {
		if (isSubmitting || !answer.trim() || !question) return;
		setHint(undefined);
		console.log("[useQuestionScreen] Submitting answer:", answer);
		setIsSubmitting(true);

		try {
			const result = await answerQuestion(quizId, question.id, answer.trim());

			console.log("[useQuestionScreen] Answer result:", {
				isCorrect: result.isCorrect,
			});

			if (result.isCorrect) {
				setIsCorrect(true);
				setShowResult(true);
				setStatusChanged(true);

				// Show toasts for unlocked quizzes
				if (result.unlockedQuizzes.length > 0) {
					result.unlockedQuizzes.forEach((unlockedQuiz, index) => {
						setTimeout(() => {
							showSuccess(`🎉 "${unlockedQuiz.title}" freigeschaltet!`, 4000);
						}, index * 500);
					});
				}
			} else {
				console.log(
					"[useQuestionScreen] Wrong answer - checking for all hint types",
				);

				const { contextualHints, autoFreeHints } = recordWrongAnswer(
					answer.trim(),
				);

				console.log("[useQuestionScreen] Triggered hints:", {
					contextual: contextualHints.length,
					autoFree: autoFreeHints.length,
				});

				if (contextualHints.length > 0) {
					console.log("[useQuestionScreen] adding contextual hint");
					const contextualHint = contextualHints[0];
					markHintAsUsed(
						quizId,
						Number.parseInt(questionId),
						contextualHint.id,
					);

					setHint({ ...contextualHint });
				} else if (autoFreeHints.length > 0) {
					console.log("[useQuestionScreen] Showing auto-free hint");
					const autoFreeHint = autoFreeHints[0];
					markHintAsUsed(quizId, Number.parseInt(questionId), autoFreeHint.id);
					setHint({ ...autoFreeHint });
				}

				console.log("[useQuestionScreen] showing wrong answer screen");
				setIsCorrect(false);
				setShowResult(true);
			}
		} catch (error) {
			console.error("[useQuestionScreen] Error submitting answer:", error);
			setIsCorrect(false);
			setShowResult(true);
		} finally {
			setIsSubmitting(false);
		}
	}, [
		isSubmitting,
		answer,
		question,
		answerQuestion,
		quizId,
		showSuccess,
		recordWrongAnswer,
		markHintAsUsed,
		questionId,
	]);

	const handleTryAgain = useCallback(() => {
		console.log("[useQuestionScreen] Try again pressed");
		setShowResult(false);
		setAnswer("");
		setIsHintLinkVisible(hasVisibleHints);
	}, [hasVisibleHints]);

	const handleBack = useCallback(() => {
		router.back();
	}, []);

	return {
		// State
		quizState,
		question,
		answer,
		setAnswer,
		isSubmitting,
		showResult,
		isCorrect,
		statusChanged,
		isSolved,
		isHintsLinkVisible,
		// Actions
		handleSubmit,
		handleTryAgain,
		handleBack,
		navigateToHints,
		hint,
	};
}
