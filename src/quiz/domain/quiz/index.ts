import { isAnswerCorrect } from "./answerComparison";
import {
	createMultiplePlaythroughUnlockCondition,
	// createUnlockCondition,
	createPlaythroughUnlockCondition,
	createProgressUnlockCondition,
	createQuizConfig,
	createQuizState,
} from "./factories";
import {
	calculateAnswerResult,
	getNextActiveQuestionId,
	getNextQuestionId,
} from "./progression";
import {
	calculateCompletionPercentage,
	countCompletedQuestions,
	countCompletedQuizzes,
	countTotalQuestions,
	countTotalQuizzes,
	isCompleted,
} from "./statistics";
import { getUnlockProgress, isQuizUnlocked } from "./unlocking";

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
	getNextQuestionId,

	// Statistics
	countTotalQuizzes,
	countCompletedQuizzes,
	countTotalQuestions,
	countCompletedQuestions,
	calculateCompletionPercentage,
	isCompleted,
} as const;
