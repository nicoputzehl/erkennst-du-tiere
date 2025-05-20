export enum QuestionType {
  TEXT = 'text',
  MULTIPLE_CHOICE = 'multiple_choice'
}

export interface Question<T = any> {
  id: number;
  imageUrl: string;
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

export interface QuizQuestion<T = any> extends Question<T> {
  status: QuestionStatus;
}

export interface MultipleChoiceQuestion<T = any> extends Question<T> {
  questionType: QuestionType.MULTIPLE_CHOICE;
  choices: string[]; // Die zur Auswahl stehenden Antwortmöglichkeiten
}

export interface QuizMultipleChoiceQuestion<T = any> extends QuizQuestion<T> {
  questionType: QuestionType.MULTIPLE_CHOICE;
  choices: string[]; // Implementierung des choices-Feldes hier
}

export enum QuizMode {
  SEQUENTIAL = 'sequential',
  ALL_UNLOCKED = 'all_unlocked'
}

export interface Quiz<T = any> {
  id: string;
  title: string;
  questions: Question<T>[];
  initiallyLocked: boolean;
  unlockCondition?: UnlockCondition;
  order?: number;
  quizMode?: QuizMode; // Neues Feld für den Quiz-Modus
  initialUnlockedQuestions?: number; // Anzahl initial freigeschalteter Fragen
}

export interface QuizState<T = any> {
  id: string;
  title: string;
  questions: QuizQuestion<T>[];
  completedQuestions: number;
  quizMode?: QuizMode; // Speichern des Quiz-Modus im Zustand
}

export interface UnlockCondition {
  type: 'percentage' | 'completionCount' | 'specificQuiz';
  requiredPercentage?: number;
  requiredCount?: number;
  requiredQuizId: string;
  description: string;
}