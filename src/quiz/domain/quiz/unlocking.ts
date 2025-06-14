import type { QuizConfig, QuizState, UnlockCondition } from "../../types";
import { isCompleted } from "./statistics";

// TODO Prüfen ob aktuell noch benötigt
export const checkUnlockCondition = (
	condition: UnlockCondition,
	quizStates: Record<string, QuizState>,
): { isMet: boolean; progress: number } => {
	const requiredQuizState = quizStates[condition.requiredQuizId];
	const isRequiredQuizCompleted = requiredQuizState
		? isCompleted(requiredQuizState)
		: false;

	return {
		isMet: isRequiredQuizCompleted,
		progress: isRequiredQuizCompleted ? 100 : 0,
	};
};

export const canUnlockQuiz = (
	config: QuizConfig,
	quizStates: Record<string, QuizState>,
): boolean => {
	if (!config.initiallyLocked || !config.unlockCondition) {
		return true; // Nicht gesperrt oder keine Bedingung -> immer freigeschaltet
	}

	const { isMet } = checkUnlockCondition(config.unlockCondition, quizStates);
	return isMet;
};
