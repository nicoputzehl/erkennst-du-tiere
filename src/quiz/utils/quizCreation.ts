import {
  QuestionStatus,
  Quiz,
  QuizConfig,
  UnlockCondition,
  QuizState,
  Question
} from '../types';
import { HintState } from '../types/hint';

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
  console.log('🏗️ [createQuizState] Creating state for quiz:', quiz.id);
  console.log('🏗️ [createQuizState] Quiz questions count:', quiz.questions.length);

  const questionStatus = calculateInitialQuestionStatus(
    quiz.questions.length,
    initialUnlockedQuestions
  );
  
  const hintStates: Record<number, HintState> = {};

  // Debug: Prüfe jede Frage und ihre Hints
  quiz.questions.forEach((question, index) => {
    console.log(`🏗️ [createQuizState] Processing question ${question.id}:`, {
      hasHints: !!question.hints,
      hintsCount: question.hints?.length || 0,
      firstHintType: question.hints?.[0]?.type,
      firstHintHasGenerator: question.hints?.[0] ? 'generator' in question.hints[0] : false
    });

    hintStates[question.id] = {
      questionId: question.id,
      usedHints: [],
      wrongAttempts: 0,
      contextualHintsTriggered: []
    };
  });

  const result: QuizState = {
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map((q, i) => ({
      ...q,
      status: questionStatus[i],
    })) as Question[],
    completedQuestions: 0,
    hintStates,
  };

  // Debug: Prüfe die finale Question-Struktur
  console.log('🏗️ [createQuizState] Final questions analysis:');
  result.questions.forEach((question, index) => {
    console.log(`🏗️ Question ${question.id}:`, {
      hasHints: !!question.hints,
      hintsCount: question.hints?.length || 0,
      hintDetails: question.hints?.map(hint => ({
        id: hint.id,
        type: hint.type,
        hasGenerator: 'generator' in hint && typeof (hint as any).generator === 'function'
      }))
    });
  });

  return result;
};