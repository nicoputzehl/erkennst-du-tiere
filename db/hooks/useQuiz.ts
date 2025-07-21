import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { liveDb } from '../client';
import { useCallback } from 'react';
import { asc } from 'drizzle-orm';
import { QuizOperations, UnlockOperations } from '../operations';
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
