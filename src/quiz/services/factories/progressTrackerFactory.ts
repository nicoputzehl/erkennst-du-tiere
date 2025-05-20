// src/quiz/services/factories/progressTrackerFactory.ts

import { ContentKey } from '@/src/core/content/types';
import { isCompleted, getNextActiveQuestionId } from '@/src/quiz/domain/quizLogic';
import { QuizStateManagerService } from './quizStateManagerFactory';

export interface ProgressTrackerService {
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
}

export const createProgressTrackerService = (
  quizStateManagerService: QuizStateManagerService
): ProgressTrackerService => {
  console.log('[ProgressTrackerService] Creating new service instance');

  return {
    getQuizProgress: (quizId: string): number => {
      console.log(`[ProgressTrackerService] Getting progress for quiz '${quizId}'`);
      const state = quizStateManagerService.getQuizState<ContentKey>(quizId);
      return state ? (state.completedQuestions / state.questions.length) * 100 : 0;
    },

    getQuizProgressString: (quizId: string): string | null => {
      console.log(`[ProgressTrackerService] Getting progress string for quiz '${quizId}'`);
      const state = quizStateManagerService.getQuizState<ContentKey>(quizId);
      return state ? `${state.completedQuestions} von ${state.questions.length} gelöst` : null;
    },

    isQuizCompleted: (quizId: string): boolean => {
      console.log(`[ProgressTrackerService] Checking completion for quiz '${quizId}'`);
      const state = quizStateManagerService.getQuizState<ContentKey>(quizId);
      return state ? isCompleted(state) : false;
    },

    getNextActiveQuestion: (quizId: string, currentQuestionId?: number): number | null => {
      console.log(`[ProgressTrackerService] Getting next active question for quiz '${quizId}', current question: ${currentQuestionId}`);
      const state = quizStateManagerService.getQuizState<ContentKey>(quizId);
      return state ? getNextActiveQuestionId(state, currentQuestionId) : null;
    }
  };
};