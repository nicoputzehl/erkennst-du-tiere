import type { QuizConfig } from "@/src/quiz/types";
import { useQuizStore } from "../store/Store";
import { QuizOperations } from "@/db/operations";

/**
 * Simplified quiz registration - replaces the complex utils/index.ts approach
 */
export async function registerQuizzes(configs: QuizConfig[]) {
	const store = useQuizStore.getState();

	console.log(`[QuizInit] Registering ${configs.length} quiz configs`);

	for (const config of configs) {
		console.log(`[QuizInit] Registering quiz: ${config.id}`);
		store.registerQuiz(config);
		
		const quizData = {
			quiz: {
				id: config.id,
				title: config.title,
				description: config.description,
				titleImage: config.titleImage,
			},
			config: {
				initiallyLocked: config.initiallyLocked,
				unlockCondition: config.unlockCondition,
				order: config.order,
				initialUnlockedQuestions: config.initialUnlockedQuestions,
			},
			questions: config.questions.map((question) => ({
				...question,
				quizId: config.id, // Add the quizId property to each question object
			})),
		};
		await QuizOperations.registerQuiz(quizData);
	}

	console.log(
		`[QuizInit] All ${configs.length} quizzes registered successfully`,
	);
}

/**
 * Initialize all quiz states - call this once on app start
 */
export async function initializeAllQuizzes() {
	const store = useQuizStore.getState();
	const quizIds = Object.keys(store.quizzes);

	console.log(`[QuizInit] Initializing ${quizIds.length} quiz states`);

	for (const quizId of quizIds) {
		store.initializeQuizState(quizId);
	}

	console.log(`[QuizInit] All quiz states initialized`);
}
