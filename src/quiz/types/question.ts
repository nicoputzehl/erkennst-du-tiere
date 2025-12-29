import type { ContextualHint, AutoFreeHint, CustomHintBase } from "./hint";
import type { QuizImages } from "./image";

export enum QuestionStatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  SOLVED = "solved",
}

export interface QuestionBase {
  id: number;
  images: QuizImages;
  answer: string;
  alternativeAnswers?: string[];
  funFact?: string;
  wikipediaName?: string;
  title?: string;

  // ==========================================
  // NEUE STRUKTURIERTE HINT-PROPERTIES
  // ==========================================

  // Custom Hints: Statische Hints mit festem Content und Kosten
  // Beispiel: Lebensraum-Infos, Größenangaben, etc.
  customHints?: CustomHintBase[];

  // Contextual Hints: Werden durch spezifische falsche Antworten ausgelöst
  // Beispiel: "Jaguar" -> "Richtige Richtung, aber falcher Kontinent"
  contextualHints?: ContextualHint[];

  // Auto-Free Hints: Werden automatisch nach X falschen Versuchen freigeschaltet
  // Beispiel: Nach 5 Versuchen -> "Das ist ein Säugetier"
  autoFreeHints?: AutoFreeHint[];

  // WICHTIG: Standard-Hints (Letter Count, First Letter) werden automatisch
  // zur Laufzeit generiert und müssen hier nicht definiert werden!
}

export interface Question extends QuestionBase {
  status: QuestionStatus;
}
