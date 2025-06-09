// src/quiz/store/hooks/useHints.ts - ENHANCED VERSION
import { useCallback, useMemo } from "react";
import type { AutoFreeHint, ContextualHint } from "../../types/hint";
import { useQuizStore } from "../Quiz.store";

export const useHints = (quizId: string, questionId: number) => {
	const quizState = useQuizStore((state) => state.quizStates[quizId]);
	const globalPointsBalance = useQuizStore((state) => state.getPointsBalance());

	const applyHint = useQuizStore((state) => state.applyHint);
	const recordWrongAnswer = useQuizStore((state) => state.recordWrongAnswer);
	const getAvailableHints = useQuizStore((state) => state.getAvailableHints);
	const getUsedHints = useQuizStore((state) => state.getUsedHints);
	const checkAutoFreeHints = useQuizStore((state) => state.checkAutoFreeHints);
	const markHintAsUsed = useQuizStore((state) => state.markHintAsUsed);

	const question = quizState?.questions.find((q) => q.id === questionId);
	const hintState = quizState?.hintStates[questionId];

	const availableHints = useMemo(() => {
		if (!question || !hintState) return [];
		return getAvailableHints(quizId, questionId);
	}, [quizId, questionId, hintState, getAvailableHints, question]);

	const { purchasableHints, autoTriggerHints } = useMemo(() => {
		const purchasable = availableHints.filter(
			(h) =>
				h.hint.cost > 0 &&
				h.hint.type !== "contextual" &&
				h.hint.type !== "auto_free" &&
				h.canUse,
		);
		const autoTrigger = availableHints.filter(
			(h) => h.hint.type === "contextual" || h.hint.type === "auto_free",
		);

		return { purchasableHints: purchasable, autoTriggerHints: autoTrigger };
	}, [availableHints]);

	const getAutoFreeHints = useCallback((): AutoFreeHint[] => {
		return checkAutoFreeHints(quizId, questionId);
	}, [checkAutoFreeHints, quizId, questionId]);

	const handleUseHint = useCallback(
		async (hintId: string) => {
			return await applyHint(quizId, questionId, hintId);
		},
		[quizId, questionId, applyHint],
	);

	const usedHints = useMemo(
		() => getUsedHints(quizId, questionId),
		[quizId, getUsedHints, questionId],
	);

	const hasVisibleHints = useMemo(
		() => usedHints.length > 0 || purchasableHints.length > 0,
		[usedHints, purchasableHints],
	);

	const handleWrongAnswer = useCallback(
		(
			userAnswer: string,
		): {
			contextualHints: ContextualHint[];
			autoFreeHints: AutoFreeHint[];
		} => {
			const contextualHints = recordWrongAnswer(quizId, questionId, userAnswer);
			const autoFreeHints = getAutoFreeHints();
			return { contextualHints, autoFreeHints };
		},
		[quizId, questionId, recordWrongAnswer, getAutoFreeHints],
	);

	return {
		availableHints,
		pointsBalance: globalPointsBalance,
		wrongAttempts: hintState?.wrongAttempts || 0,
		handleUseHint,
		recordWrongAnswer: handleWrongAnswer,
		purchasableHints,
		autoTriggerHints,
		getAutoFreeHints,
		markHintAsUsed,
		getUsedHints,
		usedHints,
		hasVisibleHints,
	};
};
