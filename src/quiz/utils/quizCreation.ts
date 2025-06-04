import {
  QuestionStatus,
  QuizQuestion,
  Quiz,
  QuizConfig,
  UnlockCondition,
  QuizState
} from '../types';

/**
 * Erstellt eine Quiz-Konfiguration aus Quiz-Inhalt und Konfigurationsoptionen
 * Trennt sauber zwischen Inhalt (Quiz) und Konfiguration (QuizConfig)
 */
 export const createQuizConfig = (
  quiz: Quiz,
  config: Partial<Omit<QuizConfig, keyof Quiz>> = {}
): QuizConfig => ({
  ...quiz,
  initiallyLocked: config.initiallyLocked ?? false,
  unlockCondition: config.unlockCondition,
  order: config.order ?? 1,
  initialUnlockedQuestions: config.initialUnlockedQuestions ?? 2,
});

/**
 * Erstellt Unlock-Bedingung
 */
 export const createUnlockCondition = (
  requiredQuizId: string,
  description?: string
): UnlockCondition => ({
  requiredQuizId,
  description: description || `Schließe das Quiz "${requiredQuizId}" ab, um dieses Quiz freizuschalten.`
});

/**
 * Berechnet initiale Fragen-Status basierend auf Quiz-Konfiguration
 */
 export const calculateInitialQuestionStatus = (
  questionCount: number,
  initialUnlockedQuestions: number
): QuestionStatus[] => {
  return Array.from({ length: questionCount }, (_, index) => {
    return index < initialUnlockedQuestions ?
      QuestionStatus.ACTIVE :
      QuestionStatus.INACTIVE;
  });
};

/**
 * Erstellt Quiz-State aus Quiz-Inhalt und Konfiguration
 */
 export const createQuizState = (
  quiz: Quiz,
  config: Pick<QuizConfig, 'initialUnlockedQuestions'> = {}
): QuizState => {
  const initialUnlockedQuestions = config.initialUnlockedQuestions || 2;

  const questionStatus = calculateInitialQuestionStatus(
    quiz.questions.length,
    initialUnlockedQuestions
  );

  return {
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map((q, i) => ({
      ...q,
      status: questionStatus[i],
    })) as QuizQuestion[],
    completedQuestions: 0,
  };
 };

