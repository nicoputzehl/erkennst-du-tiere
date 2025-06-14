import { isAnswerCorrect } from "./answerComparison";
import {
	createQuizConfig,
	createQuizState,
	createUnlockCondition,
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
import {} from "./unlocking";

export const QuizUtils = {
	// Quiz Creation
	createUnlockCondition,
	createQuizConfig,
	createQuizState,

	// Progression
	isAnswerCorrect,
	calculateAnswerResult,
	getNextActiveQuestionId,

	// Statistics
	countTotalQuizzes,
	countCompletedQuizzes,
	countTotalQuestions,
	countCompletedQuestions,
	calculateCompletionPercentage,
	isCompleted,
} as const;
