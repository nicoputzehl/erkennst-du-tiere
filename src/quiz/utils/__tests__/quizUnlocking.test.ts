import {
	createTestQuizConfig,
	createTestQuizState,
} from "../../testing/testUtils";
import type { QuizConfig, QuizState, UnlockCondition } from "../../types";
import { canUnlockQuiz, checkUnlockCondition } from "../quizUnlocking";

describe("Quiz Unlocking Utilities", () => {
	// Beispielhafte QuizStates für die Tests
	const quizStates: Record<string, QuizState> = {
		"quiz-A": createTestQuizState({
			id: "quiz-A",
			completedQuestions: 5,
			questions: Array(5).fill({} as any), // Angenommen, 5 Fragen für ein abgeschlossenes Quiz
		}),
		"quiz-B": createTestQuizState({
			id: "quiz-B",
			completedQuestions: 3,
			questions: Array(5).fill({} as any), // 3 von 5 Fragen abgeschlossen
		}),
		"quiz-C": createTestQuizState({
			id: "quiz-C",
			completedQuestions: 0,
			questions: Array(5).fill({} as any), // 0 von 5 Fragen abgeschlossen
		}),
	};

	describe("checkUnlockCondition", () => {
		it("returns isMet: true and progress: 100 if the required quiz is completed", () => {
			const condition: UnlockCondition = {
				requiredQuizId: "quiz-A",
				description: "Complete Quiz A",
			};
			const result = checkUnlockCondition(condition, quizStates);
			expect(result.isMet).toBe(true);
			expect(result.progress).toBe(100);
		});

		it("returns isMet: false and progress: 0 if the required quiz is in progress", () => {
			const condition: UnlockCondition = {
				requiredQuizId: "quiz-B",
				description: "Complete Quiz B",
			};
			const result = checkUnlockCondition(condition, quizStates);
			expect(result.isMet).toBe(false);
			expect(result.progress).toBe(0);
		});

		it("returns isMet: false and progress: 0 if the required quiz is not started", () => {
			const condition: UnlockCondition = {
				requiredQuizId: "quiz-C",
				description: "Complete Quiz C",
			};
			const result = checkUnlockCondition(condition, quizStates);
			expect(result.isMet).toBe(false);
			expect(result.progress).toBe(0);
		});

		it("returns isMet: false and progress: 0 if the required quiz does not exist", () => {
			const condition: UnlockCondition = {
				requiredQuizId: "non-existent-quiz",
				description: "Non-existent Quiz",
			};
			const result = checkUnlockCondition(condition, quizStates);
			expect(result.isMet).toBe(false);
			expect(result.progress).toBe(0);
		});
	});

	describe("canUnlockQuiz", () => {
		it("returns true if the quiz is not initially locked", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: false,
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(true);
		});

		it("returns true if the quiz is locked but has no unlock condition (should ideally not happen with current types)", () => {
			// Dieser Testfall ist wichtig, falls `unlockCondition` doch mal `undefined` sein sollte.
			// Obwohl der Typ jetzt `description: string` erfordert, könnte es durch externe Daten
			// oder ältere Konfigurationen dennoch passieren, dass `unlockCondition` fehlt.
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: undefined,
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(true);
		});

		it("returns true if the quiz is locked and its unlock condition is met", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: {
					requiredQuizId: "quiz-A",
					description: "Unlock by A",
				}, // quiz-A is completed
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(true);
		});

		it("returns false if the quiz is locked and its unlock condition is NOT met (in progress)", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: {
					requiredQuizId: "quiz-B",
					description: "Unlock by B",
				}, // quiz-B is in progress
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(false);
		});

		it("returns false if the quiz is locked and its unlock condition is NOT met (not started)", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: {
					requiredQuizId: "quiz-C",
					description: "Unlock by C",
				}, // quiz-C is not started
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(false);
		});

		it("returns false if the quiz is locked and the required quiz for unlock does not exist", () => {
			const config: QuizConfig = createTestQuizConfig({
				initiallyLocked: true,
				unlockCondition: {
					requiredQuizId: "non-existent-quiz",
					description: "Unlock by Non-existent",
				},
			});
			expect(canUnlockQuiz(config, quizStates)).toBe(false);
		});
	});
});
