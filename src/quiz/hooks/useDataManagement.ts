import { useCallback } from 'react';
import { useQuizState } from '../contexts/QuizStateProvider';
import { useUIState } from '../contexts/UIStateProvider';
import { usePersistence } from '../contexts/PersistenceProvider';

interface UseDataManagementReturn {
  clearAllData: () => Promise<void>;
  getStatistics: () => {
    totalQuizzes: number;
    completedQuizzes: number;
    totalQuestions: number;
    completedQuestions: number;
    completionPercentage: number;
  };
  isOperationLoading: (operation: string) => boolean;
}

export function useDataManagement(): UseDataManagementReturn {
  const {
    resetAllQuizStates,
    getCompletedQuizzesCount,
    getTotalQuestionsCount,
    getCompletedQuestionsCount,
    quizStates
  } = useQuizState();
  
  const {
    startLoading,
    stopLoading,
    isOperationLoading,
    showSuccessToast,
    showErrorToast,
    clearNavigationHistory,
    clearPendingUnlocks // NEU: Pending Unlocks auch clearen
  } = useUIState();

  const { clearAllData: clearPersistenceData } = usePersistence();

  const clearAllData = useCallback(async (): Promise<void> => {
    const operationKey = 'clearAllData';
    console.log('[useDataManagement] Starting to clear all data');
    
    startLoading(operationKey);
    
    try {
      // 1. Verwende den zentralen Persistence-Layer
      await clearPersistenceData();
      
      // 2. Reset all quiz states (jetzt ohne direkten Storage-Zugriff)
      await resetAllQuizStates();
      
      // 3. Clear navigation history
      clearNavigationHistory();
      
      // 4. NEU: Clear pending unlocks komplett
      clearPendingUnlocks();
      
      showSuccessToast('Alle Daten wurden erfolgreich gelöscht!');
      console.log('[useDataManagement] All data cleared successfully - including pending unlocks');
    } catch (error) {
      console.error('[useDataManagement] Error clearing all data:', error);
      showErrorToast(`Fehler beim Löschen der Daten: ${error}`);
      throw error;
    } finally {
      stopLoading(operationKey);
    }
  }, [
    clearPersistenceData, 
    resetAllQuizStates, 
    clearNavigationHistory, 
    clearPendingUnlocks, // NEU!
    showSuccessToast, 
    showErrorToast, 
    startLoading, 
    stopLoading
  ]);

  const getStatistics = useCallback(() => {
    console.log('[useDataManagement] Calculating statistics');
    
    const totalQuizzes = Object.keys(quizStates).length;
    const completedQuizzes = getCompletedQuizzesCount();
    const totalQuestions = getTotalQuestionsCount();
    const completedQuestions = getCompletedQuestionsCount();
    
    const completionPercentage = totalQuestions > 0 
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

    const stats = {
      totalQuizzes,
      completedQuizzes,
      totalQuestions,
      completedQuestions,
      completionPercentage
    };

    console.log('[useDataManagement] Statistics calculated:', stats);
    
    return stats;
  }, [quizStates, getCompletedQuizzesCount, getTotalQuestionsCount, getCompletedQuestionsCount]);

  return {
    clearAllData,
    getStatistics,
    isOperationLoading,
  };
}

export type { UseDataManagementReturn };