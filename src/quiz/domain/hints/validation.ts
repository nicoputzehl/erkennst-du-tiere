import {
  type AutoFreeHint,
  type ContextualHint,
  type CustomHint,
  type Hint,
  type HintState,
  HintType,
  type StandardHint,
  type UserPointsState,
} from "../../types/hint";

export const canUseHint = (
  hint: Hint,
  hintState: HintState,
  globalUserPoints: UserPointsState,
): { canUse: boolean; reason?: string } => {
  // Bereits verwendet?
  if (hintState.usedHints.some((h) => h.id === hint.id)) {
    return { canUse: false, reason: "Hint bereits verwendet" };
  }

  if (isAutoFreeHint(hint)) {
    // Auto-Free Hints: Prüfe ob bereits verwendet
    if (hintState.autoFreeHintsUsed?.includes(hint.id)) {
      return { canUse: false, reason: "Hint bereits verwendet" };
    }

    // Prüfe Trigger-Bedingung
    if (hintState.wrongAttempts < hint.triggerAfterAttempts) {
      return {
        canUse: false,
        reason: `Erst nach ${hint.triggerAfterAttempts} falschen Versuchen`,
      };
    }
    return { canUse: true };
  }

  if (isContextualHint(hint)) {
    return { canUse: false, reason: "Wird durch Antworten ausgelöst" };
  }

  // ==========================================
  // VEREINFACHTE PUNKTE-PRÜFUNG
  // ==========================================
  
  // Standard-Hints und Custom-Hints haben Kosten
  if (isStandardHint(hint) || isCustomHint(hint)) {
    if (globalUserPoints.totalPoints < hint.cost) {
      return { canUse: false, reason: "Nicht genug Punkte" };
    }
  }

  return { canUse: true };
};

export const canTriggerContextualHint = (
  hint: ContextualHint,
  userAnswer: string,
): boolean => {
  if (!isContextualHint(hint)) return false;

  const normalizedAnswer = userAnswer.toLowerCase().trim();
  return hint.triggers.some((trigger) =>
    normalizedAnswer.includes(trigger.toLowerCase().trim()),
  );
};

// ==========================================
// VEREINFACHTE TYPE GUARDS
// ==========================================

export const isStandardHint = (hint: Hint): hint is StandardHint => {
  return [HintType.LETTER_COUNT, HintType.FIRST_LETTER].includes(hint.type);
};

export const isCustomHint = (hint: Hint): hint is CustomHint => {
  return hint.type === HintType.CUSTOM;
};

export const isContextualHint = (hint: Hint): hint is ContextualHint => {
  return hint.type === HintType.CONTEXTUAL;
};

export const isAutoFreeHint = (hint: Hint): hint is AutoFreeHint => {
  return hint.type === HintType.AUTO_FREE;
};