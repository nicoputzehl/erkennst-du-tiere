import { isAnswerCorrect } from "./answerComparison";
import {
	createQuizConfig,
	createQuizState,
	// createUnlockCondition,
	createPlaythroughUnlockCondition,
	createProgressUnlockCondition,
	createMultiplePlaythroughUnlockCondition
} from "./factories";
import { calculateAnswerResult, getNextActiveQuestionId } from "./progression";
import {
	calculateCompletionPercentage,
	countCompletedQuestions,
	countCompletedQuizzes,
	countTotalQuestions,
	countTotalQuizzes,
	isCompleted,
} from "./statistics";
import { isQuizUnlocked, getUnlockProgress } from "./unlocking";

export const QuizUtils = {
	// Quiz Creation
	// createUnlockCondition,
	createPlaythroughUnlockCondition,
	createProgressUnlockCondition,
	createMultiplePlaythroughUnlockCondition,
	createQuizConfig,
	createQuizState,

	// Progression
	isAnswerCorrect,
	calculateAnswerResult,
	getNextActiveQuestionId,
	isQuizUnlocked,
	getUnlockProgress,

	// Statistics
	countTotalQuizzes,
	countCompletedQuizzes,
	countTotalQuestions,
	countCompletedQuestions,
	calculateCompletionPercentage,
	isCompleted,
} as const;
