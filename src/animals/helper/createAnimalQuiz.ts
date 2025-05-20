// src/animals/helper/createAnimalQuiz.ts (korrigiert)

import { ContentQuizFactory, CompleteContentQuizConfig } from '../../core/content/ContentQuizFactory';
import { createMultipleChoiceQuestionsFromAnimals, createQuestionsFromAnimals } from '../adapter/AnimalQuestionFactoryAdapter';
import { MultipleChoiceQuestionWithAnimal, QuestionWithAnimal, AnimalKey } from '../types';
import { Quiz, QuizMode, UnlockCondition } from '../../quiz/types';

// Angepasste Interfaces für Animal-Quiz-Konfiguration
export interface AnimalQuizConfig {
  id: string;
  title: string;
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
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
 * Adapter-Funktion, die die tierbasierte Konfiguration in die generische umwandelt
 */
const adaptAnimalQuizConfig = (config: CompleteAnimalQuizConfig): CompleteContentQuizConfig<AnimalKey> => {
  const isMultipleChoice = config.questionType === 'multiple_choice';
  
  if (isMultipleChoice) {
    const mcConfig = config as MultipleChoiceAnimalQuizConfig;
    const questions = createMultipleChoiceQuestionsFromAnimals(
      mcConfig.animalQuestions,
      mcConfig.choiceCount || 4
    );
    
    return {
      id: config.id,
      title: config.title,
      questions,
      initiallyLocked: config.initiallyLocked,
      unlockCondition: config.unlockCondition,
      order: config.order,
      quizMode: config.quizMode,
      initialUnlockedQuestions: config.initialUnlockedQuestions,
      questionType: 'multiple_choice',
      choiceCount: mcConfig.choiceCount
    };
  } else {
    const textConfig = config as TextAnimalQuizConfig;
    const questions = createQuestionsFromAnimals(textConfig.animalQuestions);
    
    return {
      id: config.id,
      title: config.title,
      questions,
      initiallyLocked: config.initiallyLocked,
      unlockCondition: config.unlockCondition,
      order: config.order,
      quizMode: config.quizMode,
      initialUnlockedQuestions: config.initialUnlockedQuestions,
      questionType: 'text'
    };
  }
};

/**
 * Erstellt ein neues Tier-Quiz (Textquiz oder Multiple-Choice)
 * Verwendet die generische ContentQuizFactory
 */
const createAnimalQuiz = (config: CompleteAnimalQuizConfig): Quiz<AnimalKey> => {
  const contentConfig = adaptAnimalQuizConfig(config);
  return ContentQuizFactory.createQuiz<AnimalKey>(contentConfig);
};

// Re-export der vorhandenen Validierungsfunktionen
export { createAnimalQuiz };