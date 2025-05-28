import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Quiz } from '../../../types';
import { useQuiz } from '../../../contexts/QuizProvider';
import { usePendingUnlocks } from '../../../contexts/UIStateProvider';
import { useUnlockDetection } from '../../../hooks/useUnlockDetection';

interface UseQuizzesScreenReturn {
  isLoading: boolean;
  initializeQuizStates: () => Promise<void>;
}

export function useQuizzesScreen(quizzes: Quiz[]): UseQuizzesScreenReturn {
  const { initializeQuizState } = useQuiz();
  const { checkPendingUnlocks, getPendingUnlocksCount } = usePendingUnlocks();
  const [isLoading, setIsLoading] = useState(true);

  // NEU: Detect missed unlocks from already completed quizzes
  const { detectMissedUnlocks } = useUnlockDetection();

  // Handle pending unlocks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('[useQuizzesScreen] Screen focused - checking for pending unlocks');
      
      // Kleine Verzögerung damit der Screen-Übergang smooth ist
      const timer = setTimeout(() => {
        const pendingCount = getPendingUnlocksCount();
        console.log(`[useQuizzesScreen] Found ${pendingCount} pending unlock notifications`);
        
        if (pendingCount > 0) {
          console.log('[useQuizzesScreen] Triggering pending unlock toasts');
          checkPendingUnlocks();
        } else {
          console.log('[useQuizzesScreen] No pending unlocks to show');
        }
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }, [checkPendingUnlocks, getPendingUnlocksCount])
  );

  // Initialize quiz states
  const initializeQuizStates = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('[useQuizzesScreen] Initializing quiz states...');

      // Initialisiere die Zustände aller Quizzes
      for (const quiz of quizzes) {
        await initializeQuizState(quiz.id);
      }

      console.log('[useQuizzesScreen] All quiz states initialized');
      
      // NEU: Nach der Initialisierung prüfen auf verpasste Unlocks
      setTimeout(() => {
        console.log('[useQuizzesScreen] Running missed unlock detection');
        detectMissedUnlocks();
      }, 200);
      
    } catch (error) {
      console.error('[useQuizzesScreen] Error initializing quiz states:', error);
    } finally {
      setIsLoading(false);
    }
  }, [quizzes, initializeQuizState, detectMissedUnlocks]);

  // Auto-initialize on mount
  useEffect(() => {
    initializeQuizStates();
  }, [initializeQuizStates]);

  return {
    isLoading,
    initializeQuizStates,
  };
}