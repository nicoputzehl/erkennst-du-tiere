// src/quiz/store/hooks/useHints.ts - ENHANCED VERSION
import { useCallback, useMemo } from "react";
import { useQuizStore } from "../Quiz.store";
import type { AutoFreeHint, ContextualHint } from "../../types/hint";

export const useHints = (quizId: string, questionId: number) => {
	// Store-Zugriff über Selektoren
	const quizState = useQuizStore((state) => state.quizStates[quizId]);
	const globalPointsBalance = useQuizStore((state) => state.getPointsBalance());

	// Store-Aktionen
	const applyHint = useQuizStore((state) => state.applyHint);
	const recordWrongAnswer = useQuizStore((state) => state.recordWrongAnswer);
	const getAvailableHints = useQuizStore((state) => state.getAvailableHints);
	const checkAutoFreeHints = useQuizStore((state) => state.checkAutoFreeHints);
	const markAutoFreeHintAsUsed = useQuizStore(
		(state) => state.markAutoFreeHintAsUsed,
	);

	// Abgeleitete Werte
	const question = quizState?.questions.find((q) => q.id === questionId);
	const hintState = quizState?.hintStates[questionId];

	const availableHints = useMemo(() => {
		if (!question || !hintState) return [];
		return getAvailableHints(quizId, questionId);
	}, [quizId, questionId, hintState, getAvailableHints, question]);

	// NEUE LOGIK: Separiere Hints nach Typ
	const { purchasableHints, autoTriggerHints } = useMemo(() => {
		const purchasable = availableHints.filter(
			(h) =>
				h.hint.cost > 0 &&
				h.hint.type !== "contextual" &&
				h.hint.type !== "auto_free",
		);
		const autoTrigger = availableHints.filter(
			(h) => h.hint.type === "contextual" || h.hint.type === "auto_free",
		);

		return { purchasableHints: purchasable, autoTriggerHints: autoTrigger };
	}, [availableHints]);

	// FUNKTION: Check für Auto-Free Hints
	const getAutoFreeHints = useCallback((): AutoFreeHint[] => {
		return checkAutoFreeHints(quizId, questionId);
	}, [checkAutoFreeHints, quizId, questionId]);

	const handleUseHint = useCallback(
		async (hintId: string) => {
			return await applyHint(quizId, questionId, hintId);
		},
		[quizId, questionId, applyHint],
	);

	// ERWEITERTE FUNKTION: Behandelt sowohl Contextual als auch Auto-Free Hints
	const handleWrongAnswer = useCallback(
		(
			userAnswer: string,
		): {
			contextualHints: ContextualHint[];
			autoFreeHints: AutoFreeHint[];
		} => {
			// Zuerst den falschen Versuch registrieren
			const contextualHints = recordWrongAnswer(quizId, questionId, userAnswer);

			// Dann prüfen ob Auto-Free Hints ausgelöst werden (VOR der Registrierung)
			const autoFreeHints = getAutoFreeHints();

			return { contextualHints, autoFreeHints };
		},
		[quizId, questionId, recordWrongAnswer, getAutoFreeHints],
	);

	return {
		// Bestehende API
		availableHints,
		pointsBalance: globalPointsBalance,
		wrongAttempts: hintState?.wrongAttempts || 0,
		handleUseHint,
		recordWrongAnswer: handleWrongAnswer,

		// NEUE API für getrennte Hint-Typen
		purchasableHints,
		autoTriggerHints,
		getAutoFreeHints,
		markAutoFreeHintAsUsed,
	};
};
