import { useCallback } from 'react';
import { Quiz, UnlockCondition } from '../types';
import { getNextUnlockableQuiz, calculateUnlockProgress } from '../domain/unlockLogic';
import { useQuizData } from '../contexts/QuizDataProvider';
import { useQuizState } from '../contexts/QuizStateProvider';
import { useUIState } from '../contexts/UIStateProvider';

interface UnlockProgress {
  condition: UnlockCondition | null;
  progress: number;
  isMet: boolean;
}

interface UseUnlockSystemReturn {
  getUnlockProgress: (quizId: string) => UnlockProgress;
  checkForUnlocks: () => Quiz[];
  isQuizUnlocked: (quizId: string) => boolean;
  getUnlockDescription: (quizId: string) => string | null;
}

export function useUnlockSystem(): UseUnlockSystemReturn {
  const { getQuizById, getAllQuizzes } = useQuizData();
  const { quizStates } = useQuizState();
  const { showSuccessToast } = useUIState();

  const getUnlockProgress = useCallback((quizId: string): UnlockProgress => {
    console.log(`[useUnlockSystem] Checking unlock progress for quiz: ${quizId}`);
    
    const quiz = getQuizById(quizId);
    if (!quiz || !quiz.unlockCondition) {
      return { condition: null, progress: 0, isMet: true };
    }

    const allQuizzes = getAllQuizzes();
    const quizStatesMap = new Map(Object.entries(quizStates));
    const { isMet, progress } = calculateUnlockProgress(quiz.unlockCondition, allQuizzes, quizStatesMap);

    console.log(`[useUnlockSystem] Quiz ${quizId} unlock progress: ${progress}, isMet: ${isMet}`);
    
    return { 
      condition: quiz.unlockCondition, 
      progress, 
      isMet 
    };
  }, [getQuizById, getAllQuizzes, quizStates]);

  const checkForUnlocks = useCallback((): Quiz[] => {
    console.log('[useUnlockSystem] Checking for newly unlockable quizzes');
    
    const allQuizzes = getAllQuizzes();
    const quizStatesMap = new Map(Object.entries(quizStates));
    const unlockedQuizzes: Quiz[] = [];
    
    let nextUnlockable = getNextUnlockableQuiz(allQuizzes, quizStatesMap);
    while (nextUnlockable) {
      const updatedQuiz = { ...nextUnlockable, initiallyLocked: false };
      
      unlockedQuizzes.push(updatedQuiz);
      
      console.log(`[useUnlockSystem] Quiz "${updatedQuiz.title}" has been unlocked!`);
      showSuccessToast(
        `🎉 Neues Quiz "${updatedQuiz.title}" wurde freigeschaltet!`,
        4000
      );
      
      // TODO: Actually update the quiz in QuizDataProvider
      // For now we just notify about the unlock
      
      nextUnlockable = getNextUnlockableQuiz(allQuizzes, quizStatesMap);
    }
    
    if (unlockedQuizzes.length > 0) {
      console.log(`[useUnlockSystem] Total unlocked quizzes: ${unlockedQuizzes.length}`);
    }
    
    return unlockedQuizzes;
  }, [getAllQuizzes, quizStates, showSuccessToast]);

  const isQuizUnlocked = useCallback((quizId: string): boolean => {
    const quiz = getQuizById(quizId);
    if (!quiz) return false;
    
    // If quiz is not initially locked, it's always unlocked
    if (!quiz.initiallyLocked) return true;
    
    // Check unlock condition
    const { isMet } = getUnlockProgress(quizId);
    return isMet;
  }, [getQuizById, getUnlockProgress]);

  const getUnlockDescription = useCallback((quizId: string): string | null => {
    const quiz = getQuizById(quizId);
    if (!quiz || !quiz.unlockCondition) return null;
    
    return quiz.unlockCondition.description;
  }, [getQuizById]);

  return {
    getUnlockProgress,
    checkForUnlocks,
    isQuizUnlocked,
    getUnlockDescription,
  };
}

export type { UnlockProgress, UseUnlockSystemReturn };