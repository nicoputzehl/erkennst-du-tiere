import { Question, QuestionBase } from "./question";
import { UnlockCondition } from "./unlock";


//  TODO entfernen
export enum QuizMode {
  SEQUENTIAL = 'sequential',
  ALL_UNLOCKED = 'all_unlocked'
}


export interface Quiz {
  id: string;
  title: string;
  questions: QuestionBase[];
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
  titleImage?: string;
}

export interface QuizState {
  id: string;
  title: string;
  questions: Question[];
  completedQuestions: number;
  quizMode?: QuizMode;
}

export interface QuizConfig {
  id: string;
  title: string;
  questions: QuestionBase[];
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
  titleImage?: string;
}

export interface QuizProgress {
  quizId: string;
  completed: number;
  total: number;
  percentage: number;
}
