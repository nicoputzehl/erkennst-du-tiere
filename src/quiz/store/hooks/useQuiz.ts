import { useMemo } from "react";

import type { Quiz, QuizState } from "../../types";
import { useQuizStore } from "../Store";
import { log } from "@/src/common/helper/logging";

export function useQuiz() {
	const quizzesRecord = useQuizStore((state) => state.quizzes);
	const quizStates = useQuizStore((state) => state.quizStates);
	const quizConfigsRecord = useQuizStore((state) => state.quizConfigs);
	const isQuizDataLoaded = useQuizStore((state) => state.isQuizDataLoaded);
	const currentQuizId = useQuizStore((state) => state.currentQuizId);
	const resetUserPoints = useQuizStore((state) => state.resetUserPoints);

	const quizzes = useMemo(() => {
		const quizArray = Object.values(quizzesRecord);
		log(
			`[useQuiz Hook] Converting ${quizArray.length} quizzes to array. isQuizDataLoaded: ${isQuizDataLoaded}`,
		);
		return quizArray;
	}, [quizzesRecord, isQuizDataLoaded]);

	const getQuizById = useMemo(
		() =>
			(id: string): Quiz | undefined => {
				return quizzesRecord[id];
			},
		[quizzesRecord],
	);

	const getQuizState = useMemo(
		() =>
			(id: string): QuizState | undefined => {
				return quizStates[id];
			},
		[quizStates],
	);

	const currentQuizState = useQuizStore((state) =>
		state.currentQuizId ? state.quizStates[state.currentQuizId] : null,
	);
	const isLoading = useQuizStore((state) => state.isLoading);

	const initializeQuizState = useQuizStore(
		(state) => state.initializeQuizState,
	);
	const updateQuizState = useQuizStore((state) => state.updateQuizState);
	const resetQuizState = useQuizStore((state) => state.resetQuizState);
	const answerQuestion = useQuizStore((state) => state.answerQuestion);
	const setCurrentQuiz = useQuizStore((state) => state.setCurrentQuiz);
	const solveAllQuizQuestions = useQuizStore((state) => state.solveAllQuizQuestions);
	const getQuizProgress = useQuizStore((state) => state.getQuizProgress);
	const getQuizProgressString = useQuizStore(
		(state) => state.getQuizProgressString,
	);
	const getNextActiveQuestion = useQuizStore(
		(state) => state.getNextActiveQuestion,
	);

	const checkForUnlocks = useQuizStore((state) => state.checkForUnlocks);
	const isQuizUnlocked = useQuizStore((state) => state.isQuizUnlocked);
	const getUnlockProgress = useQuizStore((state) => state.getUnlockProgress);
	const detectMissedUnlocks = useQuizStore(
		(state) => state.detectMissedUnlocks,
	);
	const resetAllQuizStates = useQuizStore((state) => state.resetAllQuizStates);

	const isQuizCompleted = useMemo(
		() =>
			(quizId: string): boolean => {
				const state = quizStates[quizId];
				return state
					? state.completedQuestions === state.questions.length
					: false;
			},
		[quizStates],
	);

	const getUnlockDescription = useMemo(
		() =>
			(quizId: string): string | null => {
				const config = quizConfigsRecord[quizId];
				return config?.unlockCondition?.description || null;
			},
		[quizConfigsRecord],
	);

	const getStatistics = useMemo(
		() => () => {
			const allStates = Object.values(quizStates);
			const totalQuizzes = allStates.length;
			const completedQuizzes = allStates.filter(
				(quiz) => quiz.completedQuestions === quiz.questions.length,
			).length;
			const totalQuestions = allStates.reduce(
				(sum, quiz) => sum + quiz.questions.length,
				0,
			);
			const completedQuestions = allStates.reduce(
				(sum, quiz) => sum + quiz.completedQuestions,
				0,
			);
			const completionPercentage =
				totalQuestions > 0
					? Math.round((completedQuestions / totalQuestions) * 100)
					: 0;

			return {
				totalQuizzes,
				completedQuizzes,
				totalQuestions,
				completedQuestions,
				completionPercentage,
			};
		},
		[quizStates],
	);

	return {
		// Datenzugriff
		quizzes,
		getQuizById,
		getQuizState,
		isQuizDataLoaded,

		// Aktueller Zustand
		currentQuizId,
		currentQuizState,
		isLoading,

		// Quiz-Operationen
		initializeQuizState,
		updateQuizState,
		resetQuizState,
		setCurrentQuiz,
		solveAllQuizQuestions,

		// Antwortverarbeitung
		answerQuestion,

		// Fortschritt
		getQuizProgress,
		getQuizProgressString,
		isQuizCompleted,
		getNextActiveQuestion,

		// Freischalt-System
		checkForUnlocks,
		isQuizUnlocked,
		getUnlockProgress,
		getUnlockDescription,
		detectMissedUnlocks,

		// Datenmanagement
		getStatistics,
		resetAllQuizStates,
		resetUserPoints,
	};
}
