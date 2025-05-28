import { normalizeString } from '@/utils/helper';
import { useCallback } from 'react';
import { useQuizData } from '../contexts/QuizDataProvider';
import { useQuizState } from '../contexts/QuizStateProvider';
import { ContentKey, Quiz, QuizState } from '../types';
import { calculateAnswerResult, getNextActiveQuestionId, isCompleted } from '../utils';

interface AnswerResult<T extends ContentKey = ContentKey> {
  isCorrect: boolean;
  newState?: QuizState<T>;
  nextQuestionId?: number;
  unlockedQuizzes?: Quiz[];
}

interface UseAnswerProcessingReturn {
  processAnswer: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string,
    onUnlock?: (unlockedQuizzes: Quiz[]) => Quiz[]
  ) => Promise<AnswerResult<T>>;
}

export function useAnswerProcessing(): UseAnswerProcessingReturn {
  const { getQuizState, updateQuizState } = useQuizState();
  const { getAllQuizzes } = useQuizData();

  const processAnswer = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string,
    onUnlock?: (unlockedQuizzes: Quiz[]) => Quiz[]
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
    
    // DIREKTE UNLOCK-PRÜFUNG nach State-Update
    const unlockedQuizzes: Quiz[] = [];
    
    // Prüfe ob das aktuelle Quiz durch diese Antwort abgeschlossen wurde
    const isCurrentQuizCompleted = isCompleted(result.newState);
    console.log(`[useAnswerProcessing] Current quiz ${quizId} completed: ${isCurrentQuizCompleted}`);
    
    if (isCurrentQuizCompleted) {
      // Prüfe alle Quizzes, die durch dieses Quiz freigeschaltet werden könnten
      const allQuizzes = getAllQuizzes();
      
      for (const quiz of allQuizzes) {
        if (quiz.initiallyLocked && quiz.unlockCondition) {
          // Wenn dieses Quiz das erforderliche Quiz für die Freischaltung ist
          if (quiz.unlockCondition.requiredQuizId === quizId) {
            console.log(`[useAnswerProcessing] Quiz "${quiz.title}" should be unlocked by completing ${quizId}`);
            unlockedQuizzes.push({ ...quiz, initiallyLocked: false });
          }
        }
      }
    }
    
    // Rufe auch das Unlock-Callback auf (für andere Unlock-Checks)
    if (onUnlock) {
      console.log(`[useAnswerProcessing] Calling unlock callback`);
      const additionalUnlocks = onUnlock([]);
      unlockedQuizzes.push(...additionalUnlocks);
    }

    if (unlockedQuizzes.length > 0) {
      console.log(`[useAnswerProcessing] Found ${unlockedQuizzes.length} unlocked quizzes:`, 
        unlockedQuizzes.map(q => q.title));
    }

    return {
      isCorrect: true,
      newState: result.newState,
      nextQuestionId: nextQuestionId || undefined,
      unlockedQuizzes
    };
  }, [getQuizState, updateQuizState, getAllQuizzes]);

  return {
    processAnswer,
  };
}

export type { AnswerResult, UseAnswerProcessingReturn };
