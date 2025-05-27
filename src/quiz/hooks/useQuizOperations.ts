import { useCallback } from 'react';
import { QuizState } from '../types';
import { useQuizState } from '../contexts/QuizStateProvider';
import { useUIState } from '../contexts/UIStateProvider';

interface UseQuizOperationsReturn {
  startQuiz: (quizId: string) => Promise<QuizState | null>;
  loadQuiz: (quizId: string) => Promise<QuizState | null>;
  resetQuiz: (quizId: string) => Promise<QuizState | null>;
  setCurrentQuiz: (quizId: string | null) => void;
  isOperationLoading: (operation: string) => boolean;
}

export function useQuizOperations(): UseQuizOperationsReturn {
  const {
    initializeQuizState,
    resetQuizState,
    setCurrentQuiz: setCurrentQuizInState,
    getQuizState,
    currentQuizId
  } = useQuizState();
  
  const {
    startLoading,
    stopLoading,
    isOperationLoading,
    showSuccessToast,
    showErrorToast,
    trackNavigation
  } = useUIState();

  const startQuiz = useCallback(async (quizId: string): Promise<QuizState | null> => {
    const operationKey = `startQuiz_${quizId}`;
    console.log(`[useQuizOperations] Starting quiz: ${quizId}`);
    
    startLoading(operationKey);
    
    try {
      // Initialize or get existing quiz state
      const quizState = await initializeQuizState(quizId);
      
      if (quizState) {
        // Set as current quiz
        setCurrentQuizInState(quizId, quizState);
        
        // Track navigation
        trackNavigation(quizId);
        
        console.log(`[useQuizOperations] Quiz ${quizId} started successfully`);
      } else {
        console.warn(`[useQuizOperations] Failed to start quiz ${quizId}`);
      }
      
      return quizState;
    } catch (error) {
      console.error(`[useQuizOperations] Error starting quiz ${quizId}:`, error);
      showErrorToast(`Fehler beim Starten des Quiz: ${error}`);
      return null;
    } finally {
      stopLoading(operationKey);
    }
  }, [initializeQuizState, setCurrentQuizInState, trackNavigation, showErrorToast, startLoading, stopLoading]);

  const loadQuiz = useCallback(async (quizId: string): Promise<QuizState | null> => {
    console.log(`[useQuizOperations] Loading quiz: ${quizId}`);
    // Loading a quiz is the same as starting it in our current implementation
    return startQuiz(quizId);
  }, [startQuiz]);

  const resetQuiz = useCallback(async (quizId: string): Promise<QuizState | null> => {
    const operationKey = `resetQuiz_${quizId}`;
    console.log(`[useQuizOperations] Resetting quiz: ${quizId}`);
    
    startLoading(operationKey);
    
    try {
      // Reset quiz state
      const newState = await resetQuizState(quizId);
      
      if (newState) {
        // If this is the current quiz, update current state
        if (quizId === currentQuizId) {
          setCurrentQuizInState(quizId, newState);
        }
        
        showSuccessToast(`Quiz "${newState.title}" wurde zurückgesetzt!`);
        console.log(`[useQuizOperations] Quiz ${quizId} reset successfully`);
      } else {
        console.warn(`[useQuizOperations] Failed to reset quiz ${quizId}`);
      }
      
      return newState;
    } catch (error) {
      console.error(`[useQuizOperations] Error resetting quiz ${quizId}:`, error);
      showErrorToast(`Fehler beim Zurücksetzen des Quiz: ${error}`);
      return null;
    } finally {
      stopLoading(operationKey);
    }
  }, [resetQuizState, currentQuizId, setCurrentQuizInState, showSuccessToast, showErrorToast, startLoading, stopLoading]);

  const setCurrentQuiz = useCallback((quizId: string | null) => {
    console.log(`[useQuizOperations] Setting current quiz to: ${quizId}`);
    
    if (quizId) {
      // Get existing quiz state
      const quizState = getQuizState(quizId);
      setCurrentQuizInState(quizId, quizState);
      trackNavigation(quizId);
    } else {
      // Clear current quiz
      setCurrentQuizInState(null, null);
    }
  }, [getQuizState, setCurrentQuizInState, trackNavigation]);

  return {
    startQuiz,
    loadQuiz,
    resetQuiz,
    setCurrentQuiz,
    isOperationLoading,
  };
}

export type { UseQuizOperationsReturn };