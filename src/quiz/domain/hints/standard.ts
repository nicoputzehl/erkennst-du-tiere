import type { AutoFreeHint, ContextualHint, CustomHint, QuestionBase } from "../../types";
import { type StandardHint, HintType } from "../../types/hint";

interface StandardHintDefinition {
  type: HintType.LETTER_COUNT | HintType.FIRST_LETTER;
  title: string;
  cost: number;
  description: string;
}

const STANDARD_HINT_DEFINITIONS: StandardHintDefinition[] = [
  {
    type: HintType.LETTER_COUNT,
    title: "Buchstabenanzahl",
    cost: 2,
    description: "Zeigt die Anzahl der Buchstaben",
  },
  {
    type: HintType.FIRST_LETTER,
    title: "Erster Buchstabe", 
    cost: 2,
    description: "Zeigt den ersten Buchstaben",
  },
];

export function getLetterCount(question: QuestionBase): number {
  return question.answer.length;
}

export function getFirstLetter(question: QuestionBase): string {
  return question.answer[0].toUpperCase();
}

function generateStandardHintContent(hintType: HintType, question: QuestionBase): string {
  switch (hintType) {
    case HintType.LETTER_COUNT:
      return `Das gesuchte Tier hat ${getLetterCount(question)} Buchstaben`;
      
    case HintType.FIRST_LETTER:
      return `Das gesuchte Tier beginnt mit "${getFirstLetter(question)}"`;
      
    default:
      console.warn(`Unknown standard hint type: ${hintType}`);
      return "Hint nicht verfügbar";
  }
}

/**
 * Erstellt alle Standard-Hints für eine bestimmte Frage
 * Diese Funktion wird aufgerufen, wenn alle verfügbaren Hints für eine Frage benötigt werden
 */
export function generateStandardHints(question: QuestionBase): StandardHint[] {
  return STANDARD_HINT_DEFINITIONS.map(definition => ({
    id: `${question.id}_${definition.type}`,
    type: definition.type,
    title: definition.title,
    cost: definition.cost,
    content: generateStandardHintContent(definition.type, question),
  }));
}

/**
 * Generiert alle verfügbaren Hints für eine Frage (Standard + Custom + Contextual + Auto-Free)
 * Das ist die zentrale Funktion, die das gesamte Hint-System zusammenführt
 */
export function generateAllHints(question: QuestionBase): (StandardHint | CustomHint | ContextualHint | AutoFreeHint)[] {
  const allHints: (StandardHint | CustomHint | ContextualHint | AutoFreeHint)[] = [];
  
  // Standard-Hints automatisch hinzufügen (Letter Count, First Letter)
  allHints.push(...generateStandardHints(question));
  
  // Question-spezifische Hints hinzufügen, falls definiert
  if (question.customHints) {
    allHints.push(...question.customHints);
  }
  
  if (question.contextualHints) {
    allHints.push(...question.contextualHints);
  }
  
  if (question.autoFreeHints) {
    allHints.push(...question.autoFreeHints);
  }
  
  return allHints;
}