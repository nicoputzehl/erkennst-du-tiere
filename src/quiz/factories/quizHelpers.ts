import { ContentKey } from '../../core/content/types';
import { Quiz, Question, QuizMode, SimpleUnlockCondition } from '../types/base';

// ====== EINFACHE QUIZ-ERSTELLUNG ======

export interface QuizConfig<T extends ContentKey = ContentKey> {
  id: string;
  title: string;
  questions: Question<T>[];
  initiallyLocked?: boolean;
  unlockCondition?: SimpleUnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
}

export function createQuiz<T extends ContentKey = ContentKey>(
  config: QuizConfig<T>
): Quiz<T> {
  return {
    id: config.id,
    title: config.title,
    questions: config.questions,
    initiallyLocked: config.initiallyLocked ?? false,
    unlockCondition: config.unlockCondition,
    order: config.order ?? 1,
    quizMode: config.quizMode ?? QuizMode.SEQUENTIAL,
    initialUnlockedQuestions: config.initialUnlockedQuestions ?? 2,
  };
}

// ====== UNLOCK-CONDITION HELPER ======

export function createUnlockCondition(
  requiredQuizId: string, 
  description?: string
): SimpleUnlockCondition {
  return {
    requiredQuizId,
    description: description || `Schließe das Quiz "${requiredQuizId}" ab, um dieses Quiz freizuschalten.`
  };
}