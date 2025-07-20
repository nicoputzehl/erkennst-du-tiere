import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { liveDb } from '../client';
import { useCallback, useMemo } from 'react';
import { asc, eq } from 'drizzle-orm';
import { QuizOperations, UnlockOperations, HintOperations, UIOperations, PointsOperations } from '../operations';
import * as schema from '../schema';

export function useQuiz() {
  // Live query für alle quizzes
  const { data: quizzes } = useLiveQuery(
    liveDb.query.quiz.findMany({
      with: {
        config: true,
        questions: {
          with: {
            state: true,
          },
        },
        state: true,
      },
      orderBy: [asc(schema.quiz.createdAt)],
    })
  );

  // Actions
  const initializeQuizState = useCallback(async (quizId: string) => {
    return await QuizOperations.initializeQuizState(quizId);
  }, []);

  const answerQuestion = useCallback(async (quizId: string, questionId: number, answer: string) => {
    return await QuizOperations.answerQuestion(quizId, questionId, answer);
  }, []);

  const getQuizProgress = useCallback((quizId: string): number => {
    const quiz = quizzes?.find(q => q.id === quizId);

    if (!quiz?.questions?.length) return 0;
    return Math.round((quiz.state?.completedQuestions ?? 0 / quiz.questions.length) * 100);
  }, [quizzes]);

  const isQuizUnlocked = useCallback(async (quizId: string): Promise<boolean> => {
    const quiz = quizzes?.find(q => q.id === quizId);
    if (!quiz?.config?.initiallyLocked || !quiz.config.unlockCondition) return true;

    return await UnlockOperations.isUnlockConditionMet(quiz.config.unlockCondition);
  }, [quizzes]);

  return {
    quizzes: quizzes || [],

    // Actions
    initializeQuizState,
    answerQuestion,
    getQuizProgress,
    isQuizUnlocked,

    // Derived data
    isLoading: !quizzes,
  };
}

export function useHints(quizId: string, questionId: number) {
  // Live query für hint state
  const { data: hintState } = useLiveQuery(
    liveDb.query.hintState.findFirst({
      where: eq(schema.hintState.questionId, questionId)
    })
  );

  // Live query für question
  const { data: question } = useLiveQuery(
    liveDb.query.questions.findFirst({
      where: eq(schema.questions.id, questionId)
    })
  );

  // Live query für user points
  const { data: userPoints } = useLiveQuery(
    liveDb.query.userPointsState.findFirst()
  );

  const availableHints = useMemo(() => {
    if (!question) return [];

    const allHints = [
      ...question.customHints || [],
      ...question.contextualHints || [],
      ...question.autoFreeHints || [],
      ...HintOperations.generateStandardHints(question),
    ];

    return allHints.map(hint => ({
      hint,
      canUse: !((hintState?.usedHints ?? []).some(h => h.id === hint.id)) &&
        (hint.cost === 0 || (userPoints?.totalPoints || 0) >= hint.cost),
    }));
  }, [question, hintState, userPoints]);

  const handleUseHint = useCallback(async (hintId: string) => {
    return await HintOperations.applyHint(questionId, hintId);
  }, [questionId]);

  const handleWrongAnswer = useCallback(async () => {
    return await QuizOperations.recordWrongAnswer(questionId);
  }, [questionId]);

  return {
    availableHints,
    usedHints: hintState?.usedHints || [],
    wrongAttempts: hintState?.wrongAttempts || 0,
    pointsBalance: userPoints?.totalPoints || 0,

    // Actions
    handleUseHint,
    handleWrongAnswer,
  };
}

export function useUI() {
  const { data: uiState } = useLiveQuery(
    liveDb.query.uiState.findFirst()
  );

  const setCurrentQuiz = useCallback(async (quizId: string | null) => {
    await UIOperations.setCurrentQuiz(quizId);
  }, []);

  const addToNavigationHistory = useCallback(async (quizId: string) => {
    await UIOperations.addToNavigationHistory(quizId);
  }, []);

  return {
    currentQuizId: uiState?.currentQuizId,
    navigationHistory: uiState?.navigationHistory || [],
    pendingUnlocks: uiState?.pendingUnlocks || [],

    // Actions
    setCurrentQuiz,
    addToNavigationHistory,
  };
}

export function usePoints() {
  const { data: points } = useLiveQuery(
    liveDb.query.userPointsState.findFirst()
  );

  const addPoints = useCallback(async (amount: number, reason: string) => {
    return await PointsOperations.addPoints(amount, reason);
  }, []);

  const deductPoints = useCallback(async (amount: number, reason: string) => {
    return await PointsOperations.deductPoints(amount, reason);
  }, []);

  return {
    totalPoints: points?.totalPoints || 0,
    earnedPoints: points?.earnedPoints || 0,
    spentPoints: points?.spentPoints || 0,
    pointsHistory: points?.pointsHistory || [],

    // Actions
    addPoints,
    deductPoints,
  };
}
