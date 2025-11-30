import type { QuestionBase } from "../../types";
import type {
	AutoFreeHint,
	ContextualHint,
	HintState,
	HintTriggerResult,
} from "../../types/hint";
import { normalizeString } from "../quiz/utils/stringManipulation";

/**
 * Überprüft, welche Contextual Hints durch die Benutzerantwort ausgelöst werden sollten.
 */
export const checkForContextualHints = (
	userAnswer: string,
	question: QuestionBase,
	hintState: HintState,
): ContextualHint[] => {
	console.log("🎯 [checkForContextualHints] Input:", {
		userAnswer,
		questionId: question.id,
		hasContextualHints: !!question.contextualHints,
		contextualHintsCount: question.contextualHints?.length || 0,
	});

	// Prüfe, ob die Question überhaupt Contextual Hints hat
	if (!question.contextualHints || question.contextualHints.length === 0) {
		console.log(
			"🎯 [checkForContextualHints] No contextual hints available for question",
		);
		return [];
	}

	const normalizedUserAnswer = normalizeString(userAnswer);
	console.log(
		"🎯 [checkForContextualHints] Normalized user answer:",
		normalizedUserAnswer,
	);

	// Filtere die Contextual Hints, die durch diese Antwort ausgelöst werden
	const triggeredHints = question.contextualHints.filter((hint) => {
		console.log("🎯 [checkForContextualHints] Checking hint:", {
			hintId: hint.id,
			triggers: hint.triggers,
		});

		// Prüfe, ob einer der Trigger in der Benutzerantwort enthalten ist
		const triggerMatches = hint.triggers.some((trigger) => {
			const normalizedTrigger = normalizeString(trigger);
			const isMatch = normalizedUserAnswer.includes(normalizedTrigger);
			console.log("🎯 [checkForContextualHints] Trigger check:", {
				trigger,
				normalizedTrigger,
				normalizedUserAnswer,
				isMatch,
			});
			return isMatch;
		});

		console.log("🎯 [checkForContextualHints] Hint triggered:", triggerMatches);
		return triggerMatches;
	});

	console.log("🎯 [checkForContextualHints] Final triggered hints:", {
		count: triggeredHints.length,
		hintIds: triggeredHints.map((h) => h.id),
	});

	return triggeredHints;
};

/**
 * Überprüft, welche Auto-Free Hints verfügbar werden sollten.
 */
export const checkForAutoFreeHints = (
	question: QuestionBase,
	hintState: HintState,
): AutoFreeHint[] => {
	console.log(
		"🎯 [checkForAutoFreeHints] Checking auto-free hints for question:",
		question.id,
	);

	// Prüfe, ob die Question überhaupt Auto-Free Hints hat
	if (!question.autoFreeHints || question.autoFreeHints.length === 0) {
		console.log(
			"🎯 [checkForAutoFreeHints] No auto-free hints available for question",
		);
		return [];
	}

	console.log("🎯 [checkForAutoFreeHints] Found auto-free hints:", {
		count: question.autoFreeHints.length,
		wrongAttempts: hintState.wrongAttempts,
		autoFreeHintsUsed: hintState.autoFreeHintsUsed || [],
	});

	// Filtere die Auto-Free Hints, die aktiviert werden sollten
	const availableHints = question.autoFreeHints.filter((hint) => {
		// Prüfe ob bereits verwendet
		const alreadyUsed =
			hintState.autoFreeHintsUsed?.includes(hint.id) ||
			hintState.usedHints.some((used) => used.id === hint.id);

		if (alreadyUsed) {
			console.log(`🎯 [checkForAutoFreeHints] Hint ${hint.id} already used`);
			return false;
		}

		// Prüfe Trigger-Bedingung
		const canTrigger = hintState.wrongAttempts >= hint.triggerAfterAttempts;
		console.log(`🎯 [checkForAutoFreeHints] Hint ${hint.id} can trigger:`, {
			wrongAttempts: hintState.wrongAttempts,
			required: hint.triggerAfterAttempts,
			canTrigger,
		});

		return canTrigger;
	});

	console.log("🎯 [checkForAutoFreeHints] Available auto-free hints:", {
		count: availableHints.length,
		hintIds: availableHints.map((h) => h.id),
	});

	return availableHints;
};

/**
 * Zentrale Funktion, die alle getriggerten Hints überprüft.
 * Das ist der Haupteinstiegspunkt für das Triggering-System.
 */
export const checkTriggeredHints = (
	userAnswer: string,
	question: QuestionBase,
	hintState: HintState,
): HintTriggerResult => {
	console.log("🎯 [checkTriggeredHints] Starting hint trigger check for:", {
		userAnswer,
		questionId: question.id,
		wrongAttempts: hintState.wrongAttempts,
	});

	// Contextual Hints durch die Antwort prüfen
	const contextualHints = checkForContextualHints(
		userAnswer,
		question,
		hintState,
	);

	// Auto-Free Hints durch die Anzahl der Versuche prüfen
	const autoFreeHints = checkForAutoFreeHints(question, hintState);

	const result: HintTriggerResult = {
		contextualHints,
		autoFreeHints,
	};

	console.log("🎯 [checkTriggeredHints] Final trigger result:", {
		contextualHintsTriggered: contextualHints.length,
		autoFreeHintsTriggered: autoFreeHints.length,
	});

	return result;
};

/**
 * Gibt den spezifischen Content für einen Contextual Hint zurück.
 * Manche Contextual Hints haben verschiedene Nachrichten je nach Trigger.
 */
export const getTriggeredContent = (
	hint: ContextualHint,
	userAnswer: string,
): string => {
	// Wenn spezifischer Content für verschiedene Trigger definiert ist
	if (hint.triggerSpecificContent) {
		const normalizedAnswer = normalizeString(userAnswer);

		// Suche nach dem passenden Trigger mit spezifischem Content
		for (const [trigger, specificContent] of Object.entries(
			hint.triggerSpecificContent,
		)) {
			if (normalizedAnswer.includes(normalizeString(trigger))) {
				console.log(
					`🎯 [getTriggeredContent] Using specific content for trigger "${trigger}"`,
				);
				return specificContent;
			}
		}
	}

	// Ansonsten den Standard-Content verwenden
	console.log(
		`🎯 [getTriggeredContent] Using standard content for hint ${hint.id}`,
	);
	return hint.content;
};
