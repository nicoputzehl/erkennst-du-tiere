export enum HintType {
  LETTER_COUNT = "letter_count",
  FIRST_LETTER = "first_letter", 
  CUSTOM = "custom",
  CONTEXTUAL = "contextual",
  AUTO_FREE = "auto_free",
}

// ==========================================
// VEREINFACHTE HINT-INTERFACES
// ==========================================

// Basis-Interface für alle Hints - jetzt mit content statt generator
export interface HintBase {
  id: string;
  type: HintType;
  title?: string;
  content: string; // Jetzt direkt als String, nicht mehr als Funktion
}

// Standard-Hints (Letter Count, First Letter) - werden automatisch generiert
export interface StandardHint extends HintBase {
  type: HintType.LETTER_COUNT | HintType.FIRST_LETTER;
  cost: number;
}

// Custom-Hints - statischer Content mit Kosten
export interface CustomHint extends HintBase {
  type: HintType.CUSTOM;
  cost: number;
  description?: string;
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

// Hints, die bereits verwendet wurden
export type UsedHint = {
  id: string;
  title: string;
  content: string;
};

// ==========================================
// STATE TYPES (unverändert)
// ==========================================

export interface HintState {
  questionId: number;
  usedHints: UsedHint[];
  wrongAttempts: number;
  autoFreeHintsUsed: string[];
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

// ==========================================
// RESULT TYPES (unverändert)
// ==========================================

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