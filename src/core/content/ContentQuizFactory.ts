// src/core/content/ContentQuizFactory.ts (nochmals korrigiert)

import { ContentKey } from './types';
import { Quiz, QuizMode, UnlockCondition, Question, QuestionType } from '../../quiz/types';

/**
 * Basis-Konfiguration für alle Quiz-Typen
 * Der generische Parameter T wird für die spätere Vererbung definiert
 */
export interface ContentQuizConfig {
  id: string;
  title: string;
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
}

/**
 * Konfiguration für Text-basierte Quizze
 */
export interface TextContentQuizConfig<T extends ContentKey = ContentKey> extends ContentQuizConfig {
  questions: Question<T>[];
  questionType?: 'text'; // Optional, Standard ist 'text'
}

/**
 * Konfiguration für Multiple-Choice-Quizze
 */
export interface MultipleChoiceContentQuizConfig<T extends ContentKey = ContentKey> extends ContentQuizConfig {
  questions: Question<T>[];
  questionType: 'multiple_choice';
  choiceCount?: number; // Optionale Anzahl der Antwortmöglichkeiten
}

/**
 * Vereinter Typ für beide Konfigurationen
 */
export type CompleteContentQuizConfig<T extends ContentKey = ContentKey> = TextContentQuizConfig<T> | MultipleChoiceContentQuizConfig<T>;

/**
 * Factory für die Erstellung von Quizzen basierend auf verschiedenen Inhaltstypen
 */
export class ContentQuizFactory {
  /**
   * Erstellt ein neues Quiz aus einer Konfiguration
   */
  static createQuiz<T extends ContentKey = ContentKey>(config: CompleteContentQuizConfig<T>): Quiz<T> {
    // Bestimmen, ob es sich um ein Multiple-Choice-Quiz handelt
    const isMultipleChoice = config.questionType === 'multiple_choice';

    // Quiz-Modus festlegen, bei Multiple-Choice standardmäßig ALL_UNLOCKED
    let quizMode = config.quizMode || QuizMode.SEQUENTIAL;
    if (isMultipleChoice && !config.quizMode) {
      quizMode = QuizMode.ALL_UNLOCKED;
    }

    return {
      id: config.id,
      title: config.title,
      questions: config.questions,
      initiallyLocked: config.initiallyLocked ?? false,
      unlockCondition: config.unlockCondition,
      order: config.order ?? 1,
      quizMode,
      initialUnlockedQuestions: config.initialUnlockedQuestions || 2
    };
  }
}