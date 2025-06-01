import { useCallback } from 'react';
import { Quiz, UnlockCondition } from '../types';
import { useQuizData } from '../contexts/QuizDataProvider';
import { useQuizState } from '../contexts/QuizStateProvider';
import { useUIState } from '../contexts/UIStateProvider';
import { isCompleted } from '../utils';

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
  const { getQuizById, getQuizConfigById, getAllQuizConfigs } = useQuizData();
  const { quizStates, getQuizProgress } = useQuizState();
  const { showSuccessToast, addPendingUnlock } = useUIState();

  const getUnlockProgress = useCallback((quizId: string): UnlockProgress => {
    console.log(`[useUnlockSystem] Checking unlock progress for quiz: ${quizId}`);
    
    const config = getQuizConfigById(quizId);
    if (!config || !config.initiallyLocked || !config.unlockCondition) {
      return { condition: null, progress: 100, isMet: true };
    }

    const requiredQuizState = quizStates[config.unlockCondition.requiredQuizId];
    const isRequiredQuizCompleted = requiredQuizState ? isCompleted(requiredQuizState) : false;

    console.log(`[useUnlockSystem] Quiz ${quizId} requires ${config.unlockCondition.requiredQuizId} - completed: ${isRequiredQuizCompleted}`);

    const requiredQuizProgress = getQuizProgress(config.unlockCondition.requiredQuizId);
    console.log(`[useUnlockSystem] Quiz ${quizId} requires ${config.unlockCondition.requiredQuizId} - progress: ${requiredQuizProgress}`);
    
    return { 
      condition: config.unlockCondition,
      progress: isRequiredQuizCompleted ? 100 : requiredQuizProgress,
      isMet: isRequiredQuizCompleted
    };
  }, [getQuizConfigById, quizStates, getQuizProgress]);

  const isQuizUnlocked = useCallback((quizId: string): boolean => {
    const config = getQuizConfigById(quizId);
    if (!config) return false;
    
    // Wenn Quiz nicht gesperrt ist, ist es freigeschaltet
    if (!config.initiallyLocked) return true;
    
    const { isMet } = getUnlockProgress(quizId);
    return isMet;
  }, [getQuizConfigById, getUnlockProgress]);

  const checkForUnlocks = useCallback((): Quiz[] => {
    console.log('[useUnlockSystem] Checking for newly unlockable quizzes');
    
    const allConfigs = getAllQuizConfigs();
    const unlockedQuizzes: Quiz[] = [];
    
    for (const config of allConfigs) {
      if (config.initiallyLocked && config.unlockCondition) {
        const requiredQuizState = quizStates[config.unlockCondition.requiredQuizId];
        
        if (requiredQuizState && isCompleted(requiredQuizState) && !isQuizUnlocked(config.id)) {
          // WICHTIG: Hole Quiz-Inhalt für Rückgabe
          const quiz = getQuizById(config.id);
          if (quiz) {
            unlockedQuizzes.push(quiz);
            
            console.log(`[useUnlockSystem] Quiz "${quiz.title}" has been unlocked!`);
            
            showSuccessToast(
              `🎉 Neues Quiz "${quiz.title}" wurde freigeschaltet!`,
              4000
            );
            
            addPendingUnlock(quiz.id, quiz.title);
          }
        }
      }
    }
    
    if (unlockedQuizzes.length > 0) {
      console.log(`[useUnlockSystem] Total unlocked quizzes: ${unlockedQuizzes.length}`);
    }
    
    return unlockedQuizzes;
  }, [getAllQuizConfigs, quizStates, showSuccessToast, isQuizUnlocked, addPendingUnlock, getQuizById]);

  const getUnlockDescription = useCallback((quizId: string): string | null => {
    const config = getQuizConfigById(quizId);
    return config?.unlockCondition?.description || null;
  }, [getQuizConfigById]);

  return {
    getUnlockProgress,
    checkForUnlocks,
    isQuizUnlocked,
    getUnlockDescription,
  };
}

export type { UnlockProgress, UseUnlockSystemReturn };