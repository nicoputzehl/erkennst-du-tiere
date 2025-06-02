// src/quiz/hooks/useQuizOperations.ts - Migrated to UI Store Bridge
import { useCallback } from 'react';
import { QuizState } from '../types'; // Vereinfachte Types ohne Generics
import { useQuizState } from '../contexts/QuizStateProvider';
import { useUIStoreBridge } from '../../stores/useUIStoreBridge'; // MIGRATED: UI Store Bridge

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
  
  // MIGRATED: UI operations now via Store Bridge instead of UIStateProvider
  const uiStoreBridge = useUIStoreBridge();

  const startQuiz = useCallback(async (quizId: string): Promise<QuizState | null> => {
    const operationKey = `startQuiz_${quizId}`;
    console.log(`[useQuizOperations] Starting quiz: ${quizId}`);
    
    uiStoreBridge.startLoading(operationKey); // MIGRATED
    
    try {
      // Initialize or get existing quiz state
      const quizState = await initializeQuizState(quizId);
      
      if (quizState) {
        // Set as current quiz
        setCurrentQuizInState(quizId, quizState);
        
        // Track navigation
        uiStoreBridge.trackNavigation(quizId); // MIGRATED
        
        console.log(`[useQuizOperations] Quiz ${quizId} started successfully`);
      } else {
        console.warn(`[useQuizOperations] Failed to start quiz ${quizId}`);
      }
      
      return quizState;
    } catch (error) {
      console.error(`[useQuizOperations] Error starting quiz ${quizId}:`, error);
      uiStoreBridge.showErrorToast(`Fehler beim Starten des Quiz: ${error}`); // MIGRATED
      return null;
    } finally {
      uiStoreBridge.stopLoading(operationKey); // MIGRATED
    }
  }, [initializeQuizState, setCurrentQuizInState, uiStoreBridge]);

  const loadQuiz = useCallback(async (quizId: string): Promise<QuizState | null> => {
    console.log(`[useQuizOperations] Loading quiz: ${quizId}`);
    // Loading a quiz is the same as starting it in our current implementation
    return startQuiz(quizId);
  }, [startQuiz]);

  const resetQuiz = useCallback(async (quizId: string): Promise<QuizState | null> => {
    const operationKey = `resetQuiz_${quizId}`;
    console.log(`[useQuizOperations] Resetting quiz: ${quizId}`);
    
    uiStoreBridge.startLoading(operationKey); // MIGRATED
    
    try {
      // Reset quiz state
      const newState = await resetQuizState(quizId);
      
      if (newState) {
        // If this is the current quiz, update current state
        if (quizId === currentQuizId) {
          setCurrentQuizInState(quizId, newState);
        }
        
        uiStoreBridge.showSuccessToast(`Quiz "${newState.title}" wurde zurückgesetzt!`); // MIGRATED
        console.log(`[useQuizOperations] Quiz ${quizId} reset successfully`);
      } else {
        console.warn(`[useQuizOperations] Failed to reset quiz ${quizId}`);
      }
      
      return newState;
    } catch (error) {
      console.error(`[useQuizOperations] Error resetting quiz ${quizId}:`, error);
      uiStoreBridge.showErrorToast(`Fehler beim Zurücksetzen des Quiz: ${error}`); // MIGRATED
      return null;
    } finally {
      uiStoreBridge.stopLoading(operationKey); // MIGRATED
    }
  }, [resetQuizState, currentQuizId, setCurrentQuizInState, uiStoreBridge]);

  const setCurrentQuiz = useCallback((quizId: string | null) => {
    console.log(`[useQuizOperations] Setting current quiz to: ${quizId}`);
    
    if (quizId) {
      // Get existing quiz state
      const quizState = getQuizState(quizId);
      setCurrentQuizInState(quizId, quizState);
      uiStoreBridge.trackNavigation(quizId); // MIGRATED
    } else {
      // Clear current quiz
      setCurrentQuizInState(null, null);
    }
  }, [getQuizState, setCurrentQuizInState, uiStoreBridge]);

  return {
    startQuiz,
    loadQuiz,
    resetQuiz,
    setCurrentQuiz,
    isOperationLoading: uiStoreBridge.isOperationLoading, // MIGRATED
  };
}

export type { UseQuizOperationsReturn };