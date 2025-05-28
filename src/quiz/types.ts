// ====== EINFACHE ENUMS ======

export enum QuestionStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active', 
  SOLVED = 'solved'
}

export enum QuizMode {
  SEQUENTIAL = 'sequential',
  ALL_UNLOCKED = 'all_unlocked'
}

// ====== BILD-TYPES ======

export interface QuizImages {
  imageUrl: string;
  thumbnailUrl?: string;
  unsolvedImageUrl?: string;
  unsolvedThumbnailUrl?: string;
}

// ====== FRAGEN-TYPES (VEREINFACHT) ======

// Basis-Frage ohne Status
export interface Question {
  id: number;
  images: QuizImages;
  answer: string;
  alternativeAnswers?: string[];
  funFact?: string;
  wikipediaName?: string;
  // Vereinfacht: Nur String statt Generic
  contentKey?: string;
}

// Frage mit Status (für aktive Quizzes)
export interface QuizQuestion extends Question {
  status: QuestionStatus;
}

// ====== UNLOCK-TYPES (VEREINFACHT) ======

export interface UnlockCondition {
  requiredQuizId: string;
  description: string;
}

// ====== QUIZ-TYPES (VEREINFACHT) ======

// Basis-Quiz Definition (ohne Generics!)
export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
}

// Quiz-Zustand zur Laufzeit
export interface QuizState {
  id: string;
  title: string;
  questions: QuizQuestion[];
  completedQuestions: number;
  quizMode?: QuizMode;
}

// ====== CONFIG-TYPES (VEREINFACHT) ======

export interface QuizConfig {
  id: string;
  title: string;
  questions: Question[];
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
}

// ====== UTILITY-TYPES ======

export interface QuizProgress {
  quizId: string;
  completed: number;
  total: number;
  percentage: number;
}

// ====== LEGACY-KOMPATIBILITÄT ======
// Alte Typen werden zu einfachen Strings gemappt

export type ContentKey = string;

// Aliases für Rückwärtskompatibilität
export type SimpleUnlockCondition = UnlockCondition;
export type BaseQuestion = Question;