// src/quiz/store/hooks/useHints.ts - KORRIGIERTE VERSION

import { useCallback, useMemo } from "react";
import type { AutoFreeHint, ContextualHint } from "../../types/hint";
import { useQuizStore } from "../Quiz.store";

export const useHints = (quizId: string, questionId: number) => {
	
	const quizState = useQuizStore((state) => state.quizStates[quizId]);
	const globalPointsBalance = useQuizStore((state) => state.getPointsBalance());

	const question = quizState?.questions.find((q) => q.id === questionId);
	const hintState = quizState?.hintStates[questionId];

	const availableHints = useMemo(() => {
		if (!question?.hints || !hintState) return [];

		return question.hints.map((hint) => {
			const alreadyUsed = hintState.usedHints.some((h) => h.id === hint.id);

			if (alreadyUsed) {
				return { hint, canUse: false, reason: "Hint bereits verwendet" };
			}

			if (hint.type === "auto_free") {
				const canUse = hintState.wrongAttempts >= hint.triggerAfterAttempts;
				return {
					hint,
					canUse,
					reason: canUse ? undefined : `Erst nach ${hint.triggerAfterAttempts} falschen Versuchen`
				};
			}

			if (hint.type === "contextual") {
				const isTriggered = hintState.contextualHintsTriggered.includes(hint.id);
				return {
					hint,
					canUse: isTriggered,
					reason: isTriggered ? undefined : "Noch nicht ausgelöst"
				};
			}

			const hasEnoughPoints = globalPointsBalance >= hint.cost;
			return {
				hint,
				canUse: hasEnoughPoints,
				reason: hasEnoughPoints ? undefined : "Nicht genug Punkte"
			};
		});
	}, [
		question?.hints, 
		hintState,
		globalPointsBalance,
	]);

	
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

	const usedHints = useMemo(() => {
		return hintState?.usedHints || [];
	}, [hintState?.usedHints]);

	const hasVisibleHints = useMemo(
		() => usedHints.length > 0 || purchasableHints.length > 0,
		[usedHints.length, purchasableHints.length]
	);

	const applyHint = useQuizStore((state) => state.applyHint);
	const recordWrongAnswer = useQuizStore((state) => state.recordWrongAnswer);
	const markHintAsUsed = useQuizStore((state) => state.markHintAsUsed);

	const getAutoFreeHints = useCallback((): AutoFreeHint[] => {
		if (!question?.hints || !hintState) return [];

		return question.hints.filter(
			(hint): hint is AutoFreeHint =>
				hint.type === "auto_free" &&
				!hintState.usedHints.some((uh) => uh.id === hint.id) &&
				hintState.wrongAttempts >= hint.triggerAfterAttempts,
		);
	}, [question?.hints, hintState]);

	const handleUseHint = useCallback(
		async (hintId: string) => {
			return await applyHint(quizId, questionId, hintId);
		},
		[quizId, questionId, applyHint],
	);

	const handleWrongAnswer = useCallback(
		(userAnswer: string): {
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
		usedHints,
		hasVisibleHints,
	};
};