import type { QuestionBase } from "../../types";
import type { PointTransaction, UserPointsState } from "../../types/hint";
import { Config } from "../config";

export const calculatePointsForCorrectAnswer = (
	question: QuestionBase,
): number => {
	const basePoints = Config.questionSolvedPoints;
	return basePoints;
};

export const createPointTransaction = (
	type: "earned" | "spent",
	amount: number,
	reason: string,
	quizId?: string,
	questionId?: number,
	hintId?: string,
): PointTransaction => {
	return {
		id: `${Date.now()}_${Math.random()}`,
		type,
		amount,
		reason,
		timestamp: Date.now(),
		quizId,
		questionId,
		hintId,
	};
};

export const getInitialUserPoints = (): UserPointsState => ({
	totalPoints: 0,
	earnedPoints: 0,
	spentPoints: 0,
	pointsHistory: [createPointTransaction("earned", Config.startingPoints, "Startguthaben")],
});
