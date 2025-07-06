import { useCallback, useMemo } from "react";
import type { PurchasableHint, AutoFreeHint, HintTriggerResult } from "../../types/hint";
import { useQuizStore } from "../Store";
import { isAutoFreeHint, isContextualHint } from "../../domain/hints/validation";

export const useHints = (quizId: string, questionId: number) => {
	const quizState = useQuizStore((state) => state.quizStates[quizId]);
	const globalPointsBalance = useQuizStore((state) => state.getPointsBalance());

	const question = quizState?.questions.find((q) => q.id === questionId);
	const hintState = quizState?.hintStates[questionId];

	const applyHint = useQuizStore((state) => state.applyHint);
	const recordWrongAnswerFromStore = useQuizStore((state) => state.recordWrongAnswer);
	const checkAutoFreeHintsFromStore = useQuizStore((state) => state.checkAutoFreeHints);

	const allHintsWithStatus = useMemo(() => {
		if (!question?.hints || !hintState) return [];

		return question.hints.map((hint) => {
			const alreadyUsed = hintState.usedHints.some((h) => h.id === hint.id);
			let canUse = false;
			let reason: string | undefined;

			if (alreadyUsed) {
				reason = "Hint bereits verwendet";
			} else if (isAutoFreeHint(hint)) {
				const autoFreeTriggered = hintState.wrongAttempts >= hint.triggerAfterAttempts;
				const alreadyMarkedAutoFree = hintState.autoFreeHintsUsed?.includes(hint.id);

				canUse = autoFreeTriggered && !alreadyMarkedAutoFree;
				reason = canUse
					? undefined
					: `Erst nach ${hint.triggerAfterAttempts} falschen Versuchen`;
			} else if (isContextualHint(hint)) {
				canUse = false;
				reason = "Wird durch Antworten ausgelöst";
			} else {
				// Kaufbare Hints
				canUse = globalPointsBalance >= hint.cost;
				reason = canUse ? undefined : "Nicht genug Punkte";
			}

			return { hint, canUse, reason, alreadyUsed };
		});
	}, [question?.hints, hintState, globalPointsBalance]);


	const purchasableHints = useMemo(() => {
		return allHintsWithStatus.filter(
			(h) => !isAutoFreeHint(h.hint) && !isContextualHint(h.hint) && h.canUse
		) as { hint: PurchasableHint; canUse: boolean; reason: string | undefined; alreadyUsed: boolean; }[];
	}, [allHintsWithStatus]);

	const getAutoFreeHints = useCallback((): AutoFreeHint[] => {
		if (!quizId || !questionId) return [];
		return checkAutoFreeHintsFromStore(quizId, questionId);
	}, [quizId, questionId, checkAutoFreeHintsFromStore]);


	const usedHints = useMemo(() => {
		return hintState?.usedHints || [];
	}, [hintState?.usedHints]);

	const hasVisibleHints = useMemo(
		() => usedHints.length > 0 || purchasableHints.length > 0,
		[usedHints.length, purchasableHints.length],
	);


	const handleUseHint = useCallback(
		async (hintId: string) => {
			console.log(`[useHints] Attempting to apply hint: ${hintId}`);
			const result = await applyHint(quizId, questionId, hintId);
			if (!result.success) {
				console.error(`[useHints] Failed to apply hint ${hintId}: ${result.error}`);
			}
			return result;
		},
		[quizId, questionId, applyHint],
	);

	const handleWrongAnswer = useCallback(
		(userAnswer: string): HintTriggerResult => {
			console.log("[useHints] Processing wrong answer:", userAnswer);
			const triggerResult = recordWrongAnswerFromStore(quizId, questionId, userAnswer);
			console.log("[useHints] Trigger result:", {
				contextualHints: triggerResult.contextualHints.length,
				autoFreeHints: triggerResult.autoFreeHints.length,
			});
			return triggerResult;
		},
		[quizId, questionId, recordWrongAnswerFromStore],
	);


	const markContextualHintAsShown = useCallback((hintId: string) => {
		console.log(
			`[useHints] Contextual hint shown (no explicit state update needed): ${hintId}. They can be triggered multiple times.`
		);
	}, []);


	const handleActivateAutoFreeHint = useCallback(
		async (hintId: string) => {
			console.log(`[useHints] Activating auto-free hint: ${hintId}`);
			return await handleUseHint(hintId);
		},
		[handleUseHint],
	);

	return {
		availableHints: allHintsWithStatus.map(h => ({
			hint: h.hint,
			canUse: h.canUse,
			reason: h.reason,
		})), // TODO: aktuell nicht genutzt. Prüfen ob noch gebraucht
		pointsBalance: globalPointsBalance,
		wrongAttempts: hintState?.wrongAttempts || 0,
		usedHints,
		hasVisibleHints,

		purchasableHints,

		handleUseHint,
		handleWrongAnswer,
		getAutoFreeHints, // TODO: aktuell nicht genutzt. Prüfen ob noch gebraucht
		markContextualHintAsShown,

		handleActivateAutoFreeHint,
	};
};