import { logWarn } from "@/src/common/helper/logging";
import type { QuestionBase } from "../../types";
import type { ContextualHint, Hint } from "../../types/hint";

/**
 * VEREINFACHTE HINT-CONTENT-GENERIERUNG
 * 
 * Diese Funktion ist jetzt viel einfacher, weil die meisten Hints
 * bereits ihren Content haben. Nur für spezielle Fälle wird Content generiert.
 */
export const generateHintContent = (hint: Hint, question: QuestionBase): string => {
  // Für die meisten Hints ist der Content bereits vorhanden
  if (hint.content) {
    return hint.content;
  }
  
  // Fallback für den unwahrscheinlichen Fall, dass Content fehlt
  logWarn(`Hint ${hint.id} has no content, this should not happen`);
  return "Hint nicht verfügbar";
};

/**
 * Hilfsfunktion für Contextual Hints mit spezifischem Content pro Trigger
 * Wird verwendet, wenn ein Contextual Hint verschiedene Nachrichten je nach Trigger haben soll
 */
export const getTriggeredContent = (hint: ContextualHint, userAnswer: string): string => {
  // Wenn spezifischer Content für verschiedene Trigger definiert ist
  if (hint.triggerSpecificContent) {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    
    for (const [trigger, specificContent] of Object.entries(hint.triggerSpecificContent)) {
      if (normalizedAnswer.includes(trigger.toLowerCase().trim())) {
        return specificContent;
      }
    }
  }
  
  // Ansonsten den Standard-Content verwenden
  return hint.content;
};