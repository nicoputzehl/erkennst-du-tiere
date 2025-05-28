import { normalizeString } from '@/utils/helper';
import { useCallback } from 'react';
import { useQuizData } from '../contexts/QuizDataProvider';
import { useQuizState } from '../contexts/QuizStateProvider';
import { Quiz, QuizState } from '../types';
import { 
  calculateAnswerResult, 
  getNextActiveQuestionId, 
  isCompleted 
} from '../utils';


/**
 * Verarbeitet Antwort-Logik - reine Funktion mit injizierten Dependencies
 */
export const processAnswerLogic = (
  quizId: string,
  questionId: number,
  answer: string,
  dependencies: {
    getCurrentState: (id: string) => QuizState | undefined;
    updateState: (id: string, state: QuizState) => Promise<void>;
    getAllQuizzes: () => Quiz[];
  }
): Promise<{
  isCorrect: boolean;
  newState?: QuizState;
  nextQuestionId?: number;
  unlockedQuizzes: Quiz[];
}> => {
  return new Promise(async (resolve) => {
    const currentState = dependencies.getCurrentState(quizId);
    if (!currentState) {
      throw new Error(`Quiz with ID ${quizId} not found`);
    }

    const processedAnswer = normalizeString(answer);
    const result = calculateAnswerResult(currentState, questionId, processedAnswer);

    if (!result.isCorrect) {
      resolve({ isCorrect: false, unlockedQuizzes: [] });
      return;
    }

    await dependencies.updateState(quizId, result.newState);
    
    const nextQuestionId = getNextActiveQuestionId(result.newState);
    
    const unlockedQuizzes: Quiz[] = [];
    
    if (isCompleted(result.newState)) {
      const allQuizzes = dependencies.getAllQuizzes();
      
      for (const quiz of allQuizzes) {
        if (quiz.initiallyLocked && quiz.unlockCondition) {
          if (quiz.unlockCondition.requiredQuizId === quizId) {
            unlockedQuizzes.push({ ...quiz, initiallyLocked: false });
          }
        }
      }
    }

    resolve({
      isCorrect: true,
      newState: result.newState,
      nextQuestionId: nextQuestionId || undefined,
      unlockedQuizzes
    });
  });
};

interface AnswerResult {
  isCorrect: boolean;
  newState?: QuizState;
  nextQuestionId?: number;
  unlockedQuizzes?: Quiz[];
}

interface UseAnswerProcessingReturn {
  processAnswer: (
    quizId: string,
    questionId: number,
    answer: string,
    onUnlock?: (unlockedQuizzes: Quiz[]) => Quiz[]
  ) => Promise<AnswerResult>;
}

/**
 * Hook mit Dependency Injection für bessere Testbarkeit
 */
export function useAnswerProcessing(): UseAnswerProcessingReturn {
  const { getQuizState, updateQuizState } = useQuizState();
  const { getAllQuizzes } = useQuizData();

  const processAnswer = useCallback(async (
    quizId: string,
    questionId: number,
    answer: string,
    onUnlock?: (unlockedQuizzes: Quiz[]) => Quiz[]
  ): Promise<AnswerResult> => {
    
    const dependencies = {
      getCurrentState: getQuizState,
      updateState: updateQuizState,
      getAllQuizzes,
    };

    const result = await processAnswerLogic(quizId, questionId, answer, dependencies);
    
    if (onUnlock && result.unlockedQuizzes.length > 0) {
      const additionalUnlocks = onUnlock(result.unlockedQuizzes);
      result.unlockedQuizzes.push(...additionalUnlocks);
    }

    return result;
  }, [getQuizState, updateQuizState, getAllQuizzes]);

  return { processAnswer };
}

/**
 * Erstellt Hook mit Mock-Dependencies für Tests
 */
export const createTestableAnswerProcessing = (mockDependencies: {
  getCurrentState: (id: string) => QuizState | undefined;
  updateState: (id: string, state: QuizState) => Promise<void>;
  getAllQuizzes: () => Quiz[];
}) => {
  return {
    processAnswer: async (
      quizId: string,
      questionId: number,
      answer: string,
      onUnlock?: (unlockedQuizzes: Quiz[]) => Quiz[]
    ): Promise<AnswerResult> => {
      const result = await processAnswerLogic(quizId, questionId, answer, mockDependencies);
      
      if (onUnlock && result.unlockedQuizzes.length > 0) {
        const additionalUnlocks = onUnlock(result.unlockedQuizzes);
        result.unlockedQuizzes.push(...additionalUnlocks);
      }

      return result;
    }
  };
};

export type { AnswerResult, UseAnswerProcessingReturn };