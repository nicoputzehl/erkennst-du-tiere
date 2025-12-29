import type { QuizConfig } from "@/src/quiz/types";
import { useQuizStore } from "../store/Store";
import { log } from "@/src/common/helper/logging";

/**
 * Simplified quiz registration - replaces the complex utils/index.ts approach
 */
export function registerQuizzes(configs: QuizConfig[]) {
	const store = useQuizStore.getState();

	log(`[QuizInit] Registering ${configs.length} quiz configs`);

	for (const config of configs) {
		log(`[QuizInit] Registering quiz: ${config.id}`);
		store.registerQuiz(config);
	}

	log(
		`[QuizInit] All ${configs.length} quizzes registered successfully`,
	);
}

/**
 * Initialize all quiz states - call this once on app start
 */
export async function initializeAllQuizzes() {
	const store = useQuizStore.getState();
	const quizIds = Object.keys(store.quizzes);

	log(`[QuizInit] Initializing ${quizIds.length} quiz states`);

	for (const quizId of quizIds) {
		store.initializeQuizState(quizId);
	}

	log(`[QuizInit] All quiz states initialized`);
}
