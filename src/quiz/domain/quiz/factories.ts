import {
	type Question,
	QuestionStatus,
	type Quiz,
	type QuizConfig,
	type QuizState,
} from "../../types";
import type { HintState } from "../../types/hint";
import type {
	MultiplePlaythroughCondition,
	PlaythroughCondition,
	ProgressCondition,
} from "../../types/unlock";
import { HintUtils } from "../hints";

/**
 * Erstellt eine Quiz-Konfiguration aus Quiz-Inhalt und Konfigurationsoptionen
 * Trennt sauber zwischen Inhalt (Quiz) und Konfiguration (QuizConfig)
 */
export const createQuizConfig = (
	quiz: Quiz,
	config: Partial<Omit<QuizConfig, keyof Quiz>> = {},
): QuizConfig => ({
	...quiz,
	initiallyLocked: config.initiallyLocked ?? false,
	unlockCondition: config.unlockCondition,
	order: config.order ?? 1,
	initialUnlockedQuestions: config.initialUnlockedQuestions ?? 2,
});

export const createPlaythroughUnlockCondition = (
	requiredQuizId: string,
	description?: string,
): PlaythroughCondition => ({
	type: "playthrough",
	requiredQuizId,
	description:
		description ||
		`Schließe das Quiz "${requiredQuizId}" ab, um dieses Quiz freizuschalten.`,
});

export const createProgressUnlockCondition = (
	requiredQuizId: string,
	requiredQuestionsSolved: number,
	description?: string,
): ProgressCondition => ({
	type: "progress",
	requiredQuizId,
	requiredQuestionsSolved,
	description:
		description ||
		`Löse ${requiredQuestionsSolved} Fragen von Quiz "${requiredQuizId}", um dieses Quiz freizuschalten.`,
});

export const createMultiplePlaythroughUnlockCondition = (
	requiredQuizId: string[],
	description?: string,
): MultiplePlaythroughCondition => ({
	type: "multipleplaythrough",
	requiredQuizId,
	description:
		description ||
		`Schließe die Quizs ${requiredQuizId.join(", ")} ab, um dieses Quiz freizuschalten.`,
});

export const calculateInitialQuestionStatus = (
	questionCount: number,
	initialUnlockedQuestions: number,
): QuestionStatus[] => {
	return Array.from({ length: questionCount }, (_, index) => {
		return index < initialUnlockedQuestions
			? QuestionStatus.ACTIVE
			: QuestionStatus.INACTIVE;
	});
};

export const createQuizState = (
	quiz: Quiz,
	config: Pick<QuizConfig, "initialUnlockedQuestions"> = {},
): QuizState => {
	const initialUnlockedQuestions = config.initialUnlockedQuestions || 2;
	console.log("🏗️ [createQuizState] Creating state for quiz:", quiz.id);
	console.log(
		"🏗️ [createQuizState] Quiz questions count:",
		quiz.questions.length,
	);

	const questionStatus = calculateInitialQuestionStatus(
		quiz.questions.length,
		initialUnlockedQuestions,
	);

	const hintStates: Record<number, HintState> = {};

	quiz.questions.forEach((question, index) => {
		const allHints = HintUtils.generateAllHints(question);

		console.log(`🏗️ [createQuizState] Processing question ${question.id}:`, {
			hasCustomHints: !!question.customHints,
			customHintsCount: question.customHints?.length || 0,
			hasContextualHints: !!question.contextualHints,
			contextualHintsCount: question.contextualHints?.length || 0,
			hasAutoFreeHints: !!question.autoFreeHints,
			autoFreeHintsCount: question.autoFreeHints?.length || 0,
			totalGeneratedHints: allHints.length,
		});

		hintStates[question.id] = {
			questionId: question.id,
			usedHints: [],
			wrongAttempts: 0,
			autoFreeHintsUsed: [],
			visibleHints: [],
		};
	});

	const result: QuizState = {
		id: quiz.id,
		title: quiz.title,
		questions: quiz.questions.map((q, i) => ({
			...q,
			status: questionStatus[i],
		})) as Question[],
		completedQuestions: 0,
		hintStates,
	};

	console.log("🏗️ [createQuizState] Final quiz state analysis:");
	result.questions.forEach((question, index) => {
		const allHints = HintUtils.generateAllHints(question);
		console.log(`🏗️ Question ${question.id}:`, {
			status: question.status,
			hasHintState: !!result.hintStates[question.id],
			totalAvailableHints: allHints.length,
			hintTypes: allHints.map((hint) => ({ id: hint.id, type: hint.type })),
		});
	});

	console.log(
		"🏗️ [createQuizState] Hint states initialized:",
		Object.keys(hintStates).length,
	);

	return result;
};
