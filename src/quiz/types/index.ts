import { ContentKey } from '../../core/content/types';

export enum QuestionType {
  TEXT = 'text',
  MULTIPLE_CHOICE = 'multiple_choice'
}

export interface Question<T extends ContentKey = ContentKey> {
  id: number;
  imageUrl: string;
  thumbnailUrl?: string;
  answer: string;
  alternativeAnswers?: string[];
  funFact?: string;
  wikipediaName?: string;
  questionType?: QuestionType;
  data?: {
    content: T;
  };
}

export enum QuestionStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  SOLVED = 'solved'
}

export interface QuizQuestion<T extends ContentKey = ContentKey> extends Question<T> {
  status: QuestionStatus;
}

export interface MultipleChoiceQuestion<T extends ContentKey = ContentKey> extends Question<T> {
  questionType: QuestionType.MULTIPLE_CHOICE;
  choices: string[]; // Die zur Auswahl stehenden Antwortmöglichkeiten
}

export interface QuizMultipleChoiceQuestion<T extends ContentKey = ContentKey> extends QuizQuestion<T> {
  questionType: QuestionType.MULTIPLE_CHOICE;
  choices: string[]; // Implementierung des choices-Feldes hier
}

export enum QuizMode {
  SEQUENTIAL = 'sequential',
  ALL_UNLOCKED = 'all_unlocked'
}

export interface Quiz<T extends ContentKey = ContentKey> {
  id: string;
  title: string;
  questions: Question<T>[];
  initiallyLocked: boolean;
  unlockCondition?: UnlockCondition;
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

export interface UnlockCondition {
  type: 'percentage' | 'completionCount' | 'specificQuiz';
  requiredPercentage?: number;
  requiredCount?: number;
  requiredQuizId: string;
  description: string;
}