import { AutoFreeHint, ContextualHint, DynamicHint, HintType, StaticHint } from "../../types/hint";
import { QuestionBase } from "../../types/question";

console.log('🏭 [Factories] File loading...');

/**
 * Erstellt einen Buchstabenanzahl-Hint
 * Kosten: 5 Punkte
 */
export const createLetterCountHint = (questionId: number): DynamicHint => {
  console.log('🏭 [createLetterCountHint] Creating hint for question:', questionId);
  const hint = {

    id: `${questionId}_letter_count`,
    type: HintType.LETTER_COUNT as HintType.LETTER_COUNT,
    cost: 5,
    title: 'Buchstabenanzahl',
    description: 'Zeigt die Anzahl der Buchstaben',
    generator: (question: QuestionBase) => `Das gesuchte Tier hat ${question.answer.length} Buchstaben`
  }

  console.log('🏭 [createLetterCountHint] Created hint:', {
    id: hint.id,
    hasGenerator: typeof hint.generator === 'function'
  });

  return hint
};

/**
 * Erstellt einen Erster-Buchstabe-Hint
 * Kosten: 10 Punkte
 */
export const createFirstLetterHint = (questionId: number): DynamicHint => ({
  id: `${questionId}_first_letter`,
  type: HintType.FIRST_LETTER,
  cost: 10,
  title: 'Erster Buchstabe',
  description: 'Zeigt den ersten Buchstaben',
  generator: (question) => `Das gesuchte Tier beginnt mit "${question.answer[0].toUpperCase()}"`
});

/**
 * Erstellt einen benutzerdefinierten Hint
 * @param questionId - ID der Frage
 * @param title - Titel des Hints (z.B. "Lebensraum")
 * @param content - Inhalt des Hints
 * @param cost - Kosten in Punkten (empfohlen: 8-15)
 */
export const createCustomHint = (
  questionId: number,
  title: string,
  content: string,
  cost: number
): StaticHint => ({
  id: `${questionId}_custom_${title.toLowerCase().replace(/\s+/g, '_')}`,
  type: HintType.CUSTOM,
  cost,
  title,
  description: `Individueller Hinweis: ${title}`,
  content
});

/**
 * Erstellt einen kontextuellen Hint (reagiert auf bestimmte Antworten)
 * @param questionId - ID der Frage
 * @param triggers - Antworten die diesen Hint auslösen
 * @param content - Hint-Inhalt
 * @param cost - Kosten (Standard: 0 = kostenlos)
 */
export const createContextualHint = (
  questionId: number,
  triggers: string[],
  content: string,
  cost: number = 0
): ContextualHint => ({
  id: `${questionId}_contextual_${triggers[0].toLowerCase().replace(/\s+/g, '_')}`,
  type: HintType.CONTEXTUAL,
  cost,
  title: 'Spezialhinweis',
  description: 'Wird bei bestimmten Antworten ausgelöst',
  triggers,
  content
});

/**
 * Erstellt einen automatisch kostenlosen Hint nach X falschen Versuchen
 * @param questionId - ID der Frage
 * @param content - Hint-Inhalt
 * @param triggerAfterAttempts - Anzahl falsche Versuche (Standard: 5)
 */
export const createAutoFreeHint = (
  questionId: number,
  content: string,
  triggerAfterAttempts: number = 5
): AutoFreeHint => ({
  id: `${questionId}_auto_free`,
  type: HintType.AUTO_FREE,
  cost: 0,
  title: 'Kostenloses Hilfswort',
  description: `Wird nach ${triggerAfterAttempts} falschen Versuchen freigeschaltet`,
  triggerAfterAttempts,
  content
});

/**
 * Erstellt Escalating Auto-Free Hint mit mehreren Stufen
 * @param questionId - ID der Frage
 * @param contents - Array von Hint-Inhalten (von vage zu spezifisch)
 * @param triggerAfterAttempts - Anzahl falsche Versuche für ersten Hint
 */
export const createEscalatingAutoFreeHint = (
  questionId: number,
  contents: string[],
  triggerAfterAttempts: number = 5
): AutoFreeHint => ({
  id: `${questionId}_escalating_free`,
  type: HintType.AUTO_FREE,
  cost: 0,
  title: 'Erweiterte Hilfe',
  description: 'Zusätzliche Hinweise nach vielen Versuchen',
  triggerAfterAttempts,
  content: contents[0],
  escalatingContent: contents
});