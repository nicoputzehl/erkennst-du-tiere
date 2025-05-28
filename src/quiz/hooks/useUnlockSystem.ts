import { useCallback } from 'react';
import { Quiz, SimpleUnlockCondition } from '../types';
import { useQuizData } from '../contexts/QuizDataProvider';
import { useQuizState } from '../contexts/QuizStateProvider';
import { useUIState } from '../contexts/UIStateProvider';
import { isCompleted } from '../utils';

interface UnlockProgress {
  condition: SimpleUnlockCondition | null;
  progress: number;
  isMet: boolean;
}

interface UseUnlockSystemReturn {
  getUnlockProgress: (quizId: string) => UnlockProgress;
  checkForUnlocks: () => Quiz[];
  isQuizUnlocked: (quizId: string) => boolean;
  getUnlockDescription: (quizId: string) => string | null;
}

/**
 * VEREINFACHTES UNLOCK-SYSTEM
 * Arbeitet mit den einfachen SimpleUnlockCondition aus den Quiz-Definitionen
 * Keine hartcodierten Regeln mehr - die Logik ist generisch und wiederverwendbar
 */
export function useUnlockSystem(): UseUnlockSystemReturn {
  const { getQuizById, getAllQuizzes } = useQuizData();
  const { quizStates } = useQuizState();
  const { showSuccessToast, addPendingUnlock } = useUIState();

  const getUnlockProgress = useCallback((quizId: string): UnlockProgress => {
    console.log(`[useUnlockSystem] Checking unlock progress for quiz: ${quizId}`);
    
    const quiz = getQuizById(quizId);
    if (!quiz || !quiz.initiallyLocked || !quiz.unlockCondition) {
      return { condition: null, progress: 100, isMet: true };
    }

    // Prüfe ob das erforderliche Quiz abgeschlossen ist
    const requiredQuizState = quizStates[quiz.unlockCondition.requiredQuizId];
    const isRequiredQuizCompleted = requiredQuizState ? isCompleted(requiredQuizState) : false;

    console.log(`[useUnlockSystem] Quiz ${quizId} requires ${quiz.unlockCondition.requiredQuizId} - completed: ${isRequiredQuizCompleted}`);
    
    return { 
      condition: quiz.unlockCondition,
      progress: isRequiredQuizCompleted ? 100 : 0,
      isMet: isRequiredQuizCompleted
    };
  }, [getQuizById, quizStates]);

    const isQuizUnlocked = useCallback((quizId: string): boolean => {
    const quiz = getQuizById(quizId);
    if (!quiz) return false;
    
    // Wenn Quiz nicht gesperrt ist, ist es freigeschaltet
    if (!quiz.initiallyLocked) return true;
    
    // Prüfe einfache Unlock-Bedingung
    const { isMet } = getUnlockProgress(quizId);
    return isMet;
  }, [getQuizById, getUnlockProgress]);

  const checkForUnlocks = useCallback((): Quiz[] => {
    console.log('[useUnlockSystem] Checking for newly unlockable quizzes');
    
    const allQuizzes = getAllQuizzes();
    const unlockedQuizzes: Quiz[] = [];
    
    // Prüfe alle gesperrten Quizzes
    for (const quiz of allQuizzes) {
      if (quiz.initiallyLocked && quiz.unlockCondition) {
        const requiredQuizState = quizStates[quiz.unlockCondition.requiredQuizId];
        
        // Wenn das erforderliche Quiz abgeschlossen ist, aber dieses Quiz noch gesperrt
        if (requiredQuizState && isCompleted(requiredQuizState) && !isQuizUnlocked(quiz.id)) {
          const updatedQuiz = { ...quiz, initiallyLocked: false };
          unlockedQuizzes.push(updatedQuiz);
          
          console.log(`[useUnlockSystem] Quiz "${updatedQuiz.title}" has been unlocked!`);
          
          // DIREKTE TOAST-ANZEIGE (für sofortige Freischaltung)
          showSuccessToast(
            `🎉 Neues Quiz "${updatedQuiz.title}" wurde freigeschaltet!`,
            4000
          );
          
          // PENDING UNLOCK (für spätere Anzeige auf Quizzes-Screen)
          addPendingUnlock(updatedQuiz.id, updatedQuiz.title);
        }
      }
    }
    
    if (unlockedQuizzes.length > 0) {
      console.log(`[useUnlockSystem] Total unlocked quizzes: ${unlockedQuizzes.length}`);
    }
    
    return unlockedQuizzes;
  }, [getAllQuizzes, quizStates, showSuccessToast, isQuizUnlocked, addPendingUnlock]);


  const getUnlockDescription = useCallback((quizId: string): string | null => {
    const quiz = getQuizById(quizId);
    return quiz?.unlockCondition?.description || null;
  }, [getQuizById]);

  return {
    getUnlockProgress,
    checkForUnlocks,
    isQuizUnlocked,
    getUnlockDescription,
  };
}

export type { UnlockProgress, UseUnlockSystemReturn };