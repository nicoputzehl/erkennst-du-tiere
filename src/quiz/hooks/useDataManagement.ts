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
  
  exportData: () => Promise<{
    quizStates: Record<string, any>;
    exportTimestamp: number;
  }>;
  getStorageStats: () => Promise<{
    quizStatesSize: number;
    totalStorageUsed: number;
  }>;
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
    clearNavigationHistory
  } = useUIState();

  const { clearAllData: clearPersistenceData, loadQuizStates } = usePersistence();

  const clearAllData = useCallback(async (): Promise<void> => {
    const operationKey = 'clearAllData';
    console.log('[useDataManagement] Starting to clear all data');
    
    startLoading(operationKey);
    
    try {
      await clearPersistenceData();
      
      await resetAllQuizStates();
      
      clearNavigationHistory();
      
      showSuccessToast('Alle Daten wurden erfolgreich gelöscht!');
      console.log('[useDataManagement] All data cleared successfully');
    } catch (error) {
      console.error('[useDataManagement] Error clearing all data:', error);
      showErrorToast(`Fehler beim Löschen der Daten: ${error}`);
      throw error;
    } finally {
      stopLoading(operationKey);
    }
  }, [clearPersistenceData, resetAllQuizStates, clearNavigationHistory, showSuccessToast, showErrorToast, startLoading, stopLoading]);

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

  const exportData = useCallback(async () => {
    console.log('[useDataManagement] Exporting quiz data');
    
    try {
      const quizStatesData = await loadQuizStates();
      
      return {
        quizStates: quizStatesData || {},
        exportTimestamp: Date.now(),
      };
    } catch (error) {
      console.error('[useDataManagement] Error exporting data:', error);
      throw error;
    }
  }, [loadQuizStates]);

  const getStorageStats = useCallback(async () => {
    console.log('[useDataManagement] Calculating storage statistics');
    
    try {
      const quizStatesData = await loadQuizStates();
      const quizStatesSize = JSON.stringify(quizStatesData || {}).length;
      
      return {
        quizStatesSize,
        totalStorageUsed: quizStatesSize,
      };
    } catch (error) {
      console.error('[useDataManagement] Error calculating storage stats:', error);
      return {
        quizStatesSize: 0,
        totalStorageUsed: 0,
      };
    }
  }, [loadQuizStates]);

  return {
    clearAllData,
    getStatistics,
    isOperationLoading,
    exportData,
    getStorageStats,
  };
}

export type { UseDataManagementReturn };