import { ContentKey } from './types';
import { Quiz, QuizMode, UnlockCondition, Question } from '../../quiz/types';

export interface ContentQuizConfig {
  id: string;
  title: string;
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
}

export interface TextContentQuizConfig<T extends ContentKey = ContentKey> extends ContentQuizConfig {
  questions: Question<T>[];
  questionType?: 'text';
}

export type CompleteContentQuizConfig<T extends ContentKey = ContentKey> = TextContentQuizConfig<T>;

/**
 * Erstellt ein Quiz aus der gegebenen Konfiguration
 * Jetzt als einfache Funktion statt statische Klassen-Methode
 */
export const createQuiz = <T extends ContentKey = ContentKey>(
  config: CompleteContentQuizConfig<T>
): Quiz<T> => {
  const quizMode = config.quizMode || QuizMode.SEQUENTIAL;

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
};