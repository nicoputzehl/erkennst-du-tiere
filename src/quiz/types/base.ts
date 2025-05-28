import { ContentKey, QuizImages } from '../../core/content/types';

// ====== GRUNDLEGENDE QUIZ-TYPEN ======

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

// ====== BASIS-QUESTION ======

export interface BaseQuestion {
  id: number;
  images: QuizImages;
  answer: string;
}

// ====== ERWEITERTE QUESTION ======

export interface Question<T extends ContentKey = ContentKey> extends BaseQuestion {
  alternativeAnswers?: string[];
  funFact?: string;
  wikipediaName?: string;
  questionType?: QuestionType;
  data?: {
    content: T;
  };
}

// ====== QUIZ-QUESTION (mit Status) ======

export interface QuizQuestion<T extends ContentKey = ContentKey> extends Question<T> {
  status: QuestionStatus;
}

// ====== UNLOCK-CONDITION ======

export interface SimpleUnlockCondition {
  requiredQuizId: string;
  description: string;
}

// ====== QUIZ ======

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

// ====== QUIZ-STATE ======

export interface QuizState<T extends ContentKey = ContentKey> {
  id: string;
  title: string;
  questions: QuizQuestion<T>[];
  completedQuestions: number;
  quizMode?: QuizMode;
}