export enum QuestionStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active', 
  SOLVED = 'solved'
}

export enum QuizMode {
  SEQUENTIAL = 'sequential',
  ALL_UNLOCKED = 'all_unlocked'
}

export interface QuizImages {
  imageUrl: string;
  thumbnailUrl?: string;
  unsolvedImageUrl?: string;
  unsolvedThumbnailUrl?: string;
}

export interface Question {
  id: number;
  images: QuizImages;
  answer: string;
  alternativeAnswers?: string[];
  funFact?: string;
  wikipediaName?: string;
  contentKey?: string;
}

export interface QuizQuestion extends Question {
  status: QuestionStatus;
}

export interface UnlockCondition {
  requiredQuizId: string;
  description: string;
}


export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
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
  questions: QuizQuestion[];
  completedQuestions: number;
  quizMode?: QuizMode;
}

export interface QuizConfig {
  id: string;
  title: string;
  questions: Question[];
  initiallyLocked?: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode;
  initialUnlockedQuestions?: number;
  titleimage?: string;
}

export interface QuizProgress {
  quizId: string;
  completed: number;
  total: number;
  percentage: number;
}
