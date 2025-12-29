export enum HintType {
  LETTER_COUNT = "letter_count",
  FIRST_LETTER = "first_letter",
  CUSTOM = "custom",
  CONTEXTUAL = "contextual",
  AUTO_FREE = "auto_free",
}

export interface HintBase {
  id: string;
  type: HintType;
  title?: string;
  content: string;
}

export interface FirstLetterHint extends HintBase {
  type: HintType.FIRST_LETTER;
  cost: number;
}
export interface LetterCountHint extends HintBase {
  type: HintType.LETTER_COUNT;
  cost: number;
}

// Standard-Hints (Letter Count, First Letter) - werden automatisch generiert
export type StandardHint = FirstLetterHint | LetterCountHint;

// Custom-Hints - statischer Content mit Kosten
export interface CustomHintBase extends HintBase {
  type: HintType.CUSTOM;
  description?: string;
}

export interface CustomHint extends CustomHintBase {
  cost: number;
}

// Contextual-Hints - werden durch bestimmte Antworten ausgelöst
export interface ContextualHint extends HintBase {
  type: HintType.CONTEXTUAL;
  triggers: string[]; // Welche Antworten lösen diesen Hint aus
  triggerSpecificContent?: Record<string, string>; // Verschiedene Inhalte je Trigger
}

// Auto-Free-Hints - werden nach X falschen Versuchen freigeschaltet
export interface AutoFreeHint extends HintBase {
  type: HintType.AUTO_FREE;
  triggerAfterAttempts: number;
  escalatingContent?: string[]; // Mehrere Hints bei vielen Versuchen
}

// Union-Type für alle möglichen Hints
export type Hint = StandardHint | CustomHint | ContextualHint | AutoFreeHint;

// Hints, die gekauft werden können (haben Kosten)
export type PurchasableHint = StandardHint | CustomHint;

export type UsedHint = {
  id: string;
  title: string;
  content: string;
};

export type VisibleHint = {
  type: HintType.FIRST_LETTER;
  value: string
} | {
  type: HintType.LETTER_COUNT;
  value: number;
}

export interface HintState {
  questionId: number;
  usedHints: UsedHint[];
  wrongAttempts: number;
  autoFreeHintsUsed: string[];
  visibleHints: VisibleHint[]
}

export interface PointTransaction {
  id: string;
  type: "earned" | "spent";
  amount: number;
  reason: string;
  timestamp: number;
  questionId?: number;
  hintId?: string;
  quizId?: string;
}

export interface UserPointsState {
  totalPoints: number;
  earnedPoints: number;
  spentPoints: number;
  pointsHistory: PointTransaction[];
}

export interface UseHintResult {
  success: boolean;
  hintContent?: string;
  pointsDeducted?: number;
  error?: string;
}

export interface HintTriggerResult {
  contextualHints: ContextualHint[];
  autoFreeHints: AutoFreeHint[];
}