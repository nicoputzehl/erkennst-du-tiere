import { useCallback, useMemo } from "react";
import { HintUtils } from "../../domain/hints";
import {
	isAutoFreeHint,
	isContextualHint,
	isCustomHint,
	isStandardHint,
} from "../../domain/hints/validation";
import {
	type AutoFreeHint,
	type HintTriggerResult,
	HintType,
	type PurchasableHint,
} from "../../types/hint";
import { useQuizStore } from "../Store";

export const useHints = (quizId: string, questionId: number) => {
	const quizState = useQuizStore((state) => state.quizStates[quizId]);
	const globalPointsBalance = useQuizStore((state) => state.getPointsBalance());

	const question = quizState?.questions.find((q) => q.id === questionId);
	const hintState = quizState?.hintStates[questionId];

	const applyHint = useQuizStore((state) => state.applyHint);
	const recordWrongAnswerFromStore = useQuizStore(
		(state) => state.recordWrongAnswer,
	);
	const checkAutoFreeHintsFromStore = useQuizStore(
		(state) => state.checkAutoFreeHints,
	);

	const allHintsWithStatus = useMemo(() => {
		console.log(
			`🔍 [useHints] Starting hint analysis for question ${questionId}`,
		);
		console.log(
			`🔍 [useHints] Question exists: ${!!question}, HintState exists: ${!!hintState}`,
		);
		console.log(`🔍 [useHints] Global points balance: ${globalPointsBalance}`);

		if (!question || !hintState) {
			console.log(
				`🔍 [useHints] Missing question or hint state, returning empty array`,
			);
			return [];
		}

		const allAvailableHints = HintUtils.generateAllHints(question);

		console.log(
			`🔍 [useHints] Generated ${allAvailableHints.length} total hints:`,
			{
				standardHints: allAvailableHints.filter(isStandardHint).length,
				customHints: allAvailableHints.filter(isCustomHint).length,
				contextualHints: allAvailableHints.filter(isContextualHint).length,
				autoFreeHints: allAvailableHints.filter(isAutoFreeHint).length,
			},
		);

		const hintsWithStatus = allAvailableHints.map((hint) => {
			console.log(`🔍 [useHints] Analyzing hint:`, {
				id: hint.id,
				type: hint.type,
				title: hint.title,
				isStandardHint: isStandardHint(hint),
				isCustomHint: isCustomHint(hint),
				isContextualHint: isContextualHint(hint),
				isAutoFreeHint: isAutoFreeHint(hint),
				cost: (hint as any).cost || "no cost property",
			});

			const alreadyUsed = hintState.usedHints.some((h) => h.id === hint.id);
			let canUse = false;
			let reason: string | undefined;

			if (alreadyUsed) {
				reason = "Hint bereits verwendet";
				console.log(`🔍 [useHints] Hint ${hint.id} already used`);
			} else if (isAutoFreeHint(hint)) {
				const autoFreeTriggered =
					hintState.wrongAttempts >= hint.triggerAfterAttempts;
				const alreadyMarkedAutoFree = hintState.autoFreeHintsUsed?.includes(
					hint.id,
				);

				canUse = autoFreeTriggered && !alreadyMarkedAutoFree;
				reason = canUse
					? undefined
					: `Erst nach ${hint.triggerAfterAttempts} falschen Versuchen`;

				console.log(`🔍 [useHints] Auto-free hint ${hint.id}:`, {
					wrongAttempts: hintState.wrongAttempts,
					requiredAttempts: hint.triggerAfterAttempts,
					autoFreeTriggered,
					alreadyMarkedAutoFree,
					canUse,
					reason,
				});
			} else if (isContextualHint(hint)) {
				canUse = false;
				reason = "Wird durch Antworten ausgelöst";
				console.log(
					`🔍 [useHints] Contextual hint ${hint.id} - not purchasable`,
				);
			} else if (isStandardHint(hint) || isCustomHint(hint)) {
				// HIER IST DER KRITISCHE PUNKT für Standard-Hints!
				const hintCost = (hint as any).cost;
				console.log(`🔍 [useHints] Checking purchasable hint ${hint.id}:`, {
					hintCost,
					globalPointsBalance,
					hasEnoughPoints: globalPointsBalance >= hintCost,
				});

				if (typeof hintCost !== "number") {
					console.error(
						`🔍 [useHints] ERROR: Hint ${hint.id} has no valid cost property!`,
						hint,
					);
					canUse = false;
					reason = "Hint-Konfigurationsfehler";
				} else {
					canUse = globalPointsBalance >= hintCost;
					reason = canUse ? undefined : "Nicht genug Punkte";
				}

				console.log(`🔍 [useHints] Standard/Custom hint ${hint.id} result:`, {
					canUse,
					reason,
				});
			} else {
				console.warn(`🔍 [useHints] Unknown hint type:`, hint);
				canUse = false;
				reason = "Unbekannter Hint-Typ";
			}

			const result = { hint, canUse, reason, alreadyUsed };
			console.log(`🔍 [useHints] Final status for hint ${hint.id}:`, {
				canUse: result.canUse,
				reason: result.reason,
				alreadyUsed: result.alreadyUsed,
			});

			return result;
		});

		console.log(`🔍 [useHints] Final hint analysis summary:`, {
			totalHints: hintsWithStatus.length,
			usableHints: hintsWithStatus.filter((h) => h.canUse).length,
			usedHints: hintsWithStatus.filter((h) => h.alreadyUsed).length,
		});

		return hintsWithStatus;
	}, [question, hintState, globalPointsBalance, questionId]);

	const purchasableHints = useMemo(() => {
		console.log(
			`🛒 [useHints] Filtering purchasable hints from ${allHintsWithStatus.length} total hints`,
		);

		const purchasable = allHintsWithStatus.filter((h) => {
			const isPurchasableType = isStandardHint(h.hint) || isCustomHint(h.hint);
			const isUsable = h.canUse;

			console.log(`🛒 [useHints] Checking hint ${h.hint.id}:`, {
				isPurchasableType,
				isUsable,
				willBeIncluded: isPurchasableType && isUsable,
			});

			return isPurchasableType && isUsable;
		}) as {
			hint: PurchasableHint;
			canUse: boolean;
			reason: string | undefined;
			alreadyUsed: boolean;
		}[];

		console.log(
			`🛒 [useHints] Found ${purchasable.length} purchasable hints:`,
			purchasable.map((h) => ({
				id: h.hint.id,
				title: h.hint.title,
				cost: (h.hint as any).cost,
			})),
		);

		return purchasable;
	}, [allHintsWithStatus]);

	const usedHints = useMemo(() => {
		const used = hintState?.usedHints || [];
		console.log(
			`📖 [useHints] Used hints: ${used.length}`,
			used.map((h) => h.id),
		);
		return used;
	}, [hintState?.usedHints]);

	const visibleHints = useMemo(() => {
		const visible = hintState?.visibleHints || [];
		console.log(
			`📖 [useHints] Visible hints: ${visible.length}`,
			visible.map((h) => h.type),
		);
		return visible;
	}, [hintState?.visibleHints]);

	const firstLetterHint = useMemo(() => {
		const firstLetter = hintState.visibleHints.find(
			(h) => h.type === HintType.FIRST_LETTER,
		);
		console.log(`📖 [useHints] First letter hint:`, firstLetter);
		return firstLetter;
	}, [hintState.visibleHints]);

	const hasVisibleHints = useMemo(() => {
		const visible = usedHints.length > 0 || purchasableHints.length > 0;
		console.log(
			`👁️ [useHints] Has visible hints: ${visible} (used: ${usedHints.length}, purchasable: ${purchasableHints.length})`,
		);
		return visible;
	}, [usedHints.length, purchasableHints.length]);

	const handleUseHint = useCallback(
		async (hintId: string) => {
			console.log(`💰 [useHints] Attempting to apply hint: ${hintId}`);
			const result = await applyHint(quizId, questionId, hintId);
			if (!result.success) {
				console.error(
					`💰 [useHints] Failed to apply hint ${hintId}: ${result.error}`,
				);
			} else {
				console.log(
					`💰 [useHints] Successfully applied hint ${hintId}, points deducted: ${result.pointsDeducted}`,
				);
			}
			return result;
		},
		[quizId, questionId, applyHint],
	);

	const handleWrongAnswer = useCallback(
		(userAnswer: string): HintTriggerResult => {
			console.log("❌ [useHints] Processing wrong answer:", userAnswer);
			const triggerResult = recordWrongAnswerFromStore(
				quizId,
				questionId,
				userAnswer,
			);
			console.log("❌ [useHints] Trigger result:", {
				contextualHints: triggerResult.contextualHints.length,
				autoFreeHints: triggerResult.autoFreeHints.length,
			});
			return triggerResult;
		},
		[quizId, questionId, recordWrongAnswerFromStore],
	);

	const getAutoFreeHints = useCallback((): AutoFreeHint[] => {
		if (!quizId || !questionId) return [];
		const autoFree = checkAutoFreeHintsFromStore(quizId, questionId);
		console.log(`🆓 [useHints] Auto-free hints available: ${autoFree.length}`);
		return autoFree;
	}, [quizId, questionId, checkAutoFreeHintsFromStore]);

	const markContextualHintAsShown = useCallback((hintId: string) => {
		console.log(`💡 [useHints] Contextual hint shown: ${hintId}`);
	}, []);

	const handleActivateAutoFreeHint = useCallback(
		async (hintId: string) => {
			console.log(`🆓 [useHints] Activating auto-free hint: ${hintId}`);
			return await handleUseHint(hintId);
		},
		[handleUseHint],
	);

	// Debug-Ausgabe für das finale Ergebnis
	console.log(`🎯 [useHints] Final hook result for question ${questionId}:`, {
		hasVisibleHints,
		purchasableHintsCount: purchasableHints.length,
		usedHintsCount: usedHints.length,
		wrongAttempts: hintState?.wrongAttempts || 0,
	});

	return {
		availableHints: allHintsWithStatus.map((h) => ({
			hint: h.hint,
			canUse: h.canUse,
			reason: h.reason,
		})),
		pointsBalance: globalPointsBalance,
		wrongAttempts: hintState?.wrongAttempts || 0,
		usedHints,
		visibleHints,
		firstLetterHint,
		hasVisibleHints,
		purchasableHints,
		handleUseHint,
		handleWrongAnswer,
		getAutoFreeHints,
		markContextualHintAsShown,
		handleActivateAutoFreeHint,
	};
};
