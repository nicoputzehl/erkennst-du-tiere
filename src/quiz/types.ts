import { ContentKey, QuizImages } from '../common/utils';

// ====== GRUNDLEGENDE ENUMS ======

export enum QuestionType {
  TEXT = 'text'
}

export enum QuestionStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  SOLVED = 'solved'
}

export enum QuizMode {
  SEQUENTIAL = 'sequential',
  ALL_UNLOCKED = 'all_unlocked'
}

// ====== QUESTION TYPES ======

export interface BaseQuestion {
  id: number;
  images: QuizImages;
  answer: string;
}

export interface Question<T extends ContentKey = ContentKey> extends BaseQuestion {
  alternativeAnswers?: string[];
  funFact?: string;
  wikipediaName?: string;
  questionType?: QuestionType;
  data?: {
    content: T;
  };
}

export interface QuizQuestion<T extends ContentKey = ContentKey> extends Question<T> {
  status: QuestionStatus;
}

// ====== UNLOCK TYPES ======

export interface SimpleUnlockCondition {
  requiredQuizId: string;
  description: string;
}

// ====== QUIZ TYPES ======

export interface Quiz<T extends ContentKey = ContentKey> {
  id: string;
  title: string;
  questions: Question<T>[];
  initiallyLocked?: boolean;
  unlockCondition?: SimpleUnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
}

export interface QuizState<T extends ContentKey = ContentKey> {
  id: string;
  title: string;
  questions: QuizQuestion<T>[];
  completedQuestions: number;
  quizMode?: QuizMode;
}

// ====== CONFIG TYPES ======

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

// ====== UTILITY TYPES ======

export type QuizWithState<T extends ContentKey = ContentKey> = {
  quiz: Quiz<T>;
  state: QuizState<T>;
};

export type QuizProgress = {
  quizId: string;
  completed: number;
  total: number;
  percentage: number;
};

// ====== LEGACY COMPATIBILITY ======
// Re-exports für Rückwärtskompatibilität
export type { ContentKey, QuizImages };