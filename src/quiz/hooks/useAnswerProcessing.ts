import { useCallback } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { Quiz, QuizState } from '../types';
import { normalizeString } from '@/utils/helper';
import { calculateAnswerResult, getNextActiveQuestionId } from '../domain/quizLogic';
import { useQuizState } from '../contexts/QuizStateProvider';

interface AnswerResult<T extends ContentKey = ContentKey> {
  isCorrect: boolean;
  newState?: QuizState<T>;
  nextQuestionId?: number;
  unlockedQuiz?: Quiz;
}

interface UseAnswerProcessingReturn {
  processAnswer: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string,
    onUnlock?: (unlockedQuizzes: Quiz[]) => void
  ) => Promise<AnswerResult<T>>;
}

export function useAnswerProcessing(): UseAnswerProcessingReturn {
  const { getQuizState, updateQuizState } = useQuizState();

  const processAnswer = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string,
    onUnlock?: (unlockedQuizzes: Quiz[]) => void
  ): Promise<AnswerResult<T>> => {
    console.log(`[useAnswerProcessing] Processing answer for quiz ${quizId}, question ${questionId}`);
    
    // Get current quiz state
    const currentState = getQuizState(quizId) as QuizState<T>;
    if (!currentState) {
      throw new Error(`Quiz with ID ${quizId} not found`);
    }

    // Process the answer
    const processedAnswer = normalizeString(answer);
    const result = calculateAnswerResult(currentState, questionId, processedAnswer);

    // If answer is incorrect, return early
    if (!result.isCorrect) {
      console.log(`[useAnswerProcessing] Incorrect answer for quiz ${quizId}, question ${questionId}`);
      return { isCorrect: false };
    }

    // Update quiz state
    console.log(`[useAnswerProcessing] Correct answer! Updating quiz state for ${quizId}`);
    await updateQuizState(quizId, result.newState);
    
    // Calculate next question
    const nextQuestionId = getNextActiveQuestionId(result.newState);
    
    // Check for unlocks (if callback provided)
    let unlockedQuizzes: Quiz[] = [];
    if (onUnlock) {
      // We'll call the unlock callback to let the parent handle unlock logic
      onUnlock([]);
    }

    return {
      isCorrect: true,
      newState: result.newState,
      nextQuestionId: nextQuestionId || undefined,
      unlockedQuiz: unlockedQuizzes[0] || undefined
    };
  }, [getQuizState, updateQuizState]);

  return {
    processAnswer,
  };
}

export type { AnswerResult, UseAnswerProcessingReturn };