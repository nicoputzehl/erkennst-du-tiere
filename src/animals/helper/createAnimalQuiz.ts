import { validateAnimalKey, findClosestAnimal, getValidAnimals } from "./animalValidator";
import { createQuestionsFromAnimals } from "./AnimalQuestionFactory";
import { createMultipleChoiceQuestionsFromAnimals } from "./MultipleChoiceAnimalQuestionFactory";
import { MultipleChoiceQuestionWithAnimal, QuestionWithAnimal } from "../types";
import { Quiz, QuizMode, UnlockCondition } from "@/src/quiz/types";

// TODO in eigenes File
// Basisschnittstelle für beide Quiztypen
export interface AnimalQuizConfig {
  id: string;
  title: string;
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;  // <-- Neu
  initialUnlockedQuestions?: number;  // <-- Neu
}

// Schnittstelle für Standard-Textquiz
export interface TextAnimalQuizConfig extends AnimalQuizConfig {
  animalQuestions: QuestionWithAnimal[];
  questionType?: 'text'; // Optional, Standard ist 'text'
}

// Schnittstelle für Multiple-Choice-Quiz
export interface MultipleChoiceAnimalQuizConfig extends AnimalQuizConfig {
  animalQuestions: MultipleChoiceQuestionWithAnimal[];
  questionType: 'multiple_choice';
  choiceCount?: number; // Optionale Anzahl der Antwortmöglichkeiten
}

// Vereinter Typ für beide Konfigurationen
export type CompleteAnimalQuizConfig = TextAnimalQuizConfig | MultipleChoiceAnimalQuizConfig;

/**
 * Erstellt ein neues Tier-Quiz (Textquiz oder Multiple-Choice)
 */
const createAnimalQuiz = (config: CompleteAnimalQuizConfig): Quiz => {
  // Bestimmen, ob es sich um ein Multiple-Choice-Quiz handelt
  const isMultipleChoice = config.questionType === 'multiple_choice';

  let quizMode = config.quizMode || QuizMode.SEQUENTIAL;
  if (config.questionType === 'multiple_choice' && !config.quizMode) {
    quizMode = QuizMode.ALL_UNLOCKED;
  }
  // Fragen basierend auf dem Quiztyp erstellen
  let questions;
  if (isMultipleChoice) {
    const mcConfig = config as MultipleChoiceAnimalQuizConfig;
    questions = createMultipleChoiceQuestionsFromAnimals(
      mcConfig.animalQuestions,
      mcConfig.choiceCount || 4 // Standard: 4 Antwortmöglichkeiten
    );
  } else {
    questions = createQuestionsFromAnimals(config.animalQuestions);
  }

  return {
    id: config.id,
    title: config.title,
    questions,
    initiallyLocked: config.initiallyLocked ?? false,
    unlockCondition: config.unlockCondition,
    order: config.order ?? 1,
    quizMode,
    initialUnlockedQuestions: config.initialUnlockedQuestions || 2
  };
};

export {
  validateAnimalKey,
  findClosestAnimal,
  getValidAnimals,
  createQuestionsFromAnimals,
  createMultipleChoiceQuestionsFromAnimals,
  createAnimalQuiz
};