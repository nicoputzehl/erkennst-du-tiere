import { useCallback } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { QuizState } from '../types';
import { useAnswerProcessing } from './useAnswerProcessing';
import { useUnlockSystem } from './useUnlockSystem';
import { useQuizOperations } from './useQuizOperations';
import { useDataManagement } from './useDataManagement';

interface QuizWorkflowReturn {
  // Complete quiz workflow
  startQuizWorkflow: (quizId: string) => Promise<{
    success: boolean;
    quizState?: QuizState;
    error?: string;
  }>;
  
  // Complete answer workflow
  submitAnswerWorkflow: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string
  ) => Promise<{
    isCorrect: boolean;
    newState?: QuizState<T>;
    nextQuestionId?: number;
    hasUnlocks: boolean;
    completedQuiz: boolean;
  }>;
  
  // Complete reset workflow
  resetQuizWorkflow: (quizId: string) => Promise<{
    success: boolean;
    quizState?: QuizState;
    error?: string;
  }>;
  
  // Quiz completion check
  checkQuizCompletion: (quizId: string) => {
    isCompleted: boolean;
    progress: number;
    nextQuestionId: number | null;
  };
  
  // Data management workflow
  clearDataWorkflow: () => Promise<{
    success: boolean;
    error?: string;
    statistics?: {
      totalQuizzes: number;
      completedQuizzes: number;
      totalQuestions: number;
      completedQuestions: number;
      completionPercentage: number;
    };
  }>;
}

export function useQuizWorkflow(): QuizWorkflowReturn {
  const { processAnswer } = useAnswerProcessing();
  const { checkForUnlocks, isQuizUnlocked } = useUnlockSystem();
  const { startQuiz, resetQuiz } = useQuizOperations();
  const { clearAllData, getStatistics } = useDataManagement();

  const startQuizWorkflow = useCallback(async (quizId: string) => {
    console.log(`[useQuizWorkflow] Starting quiz workflow for: ${quizId}`);
    
    try {
      // Check if quiz is unlocked
      if (!isQuizUnlocked(quizId)) {
        return {
          success: false,
          error: 'Quiz ist noch nicht freigeschaltet'
        };
      }
      
      // Start the quiz
      const quizState = await startQuiz(quizId);
      
      if (!quizState) {
        return {
          success: false,
          error: 'Quiz konnte nicht gestartet werden'
        };
      }
      
      console.log(`[useQuizWorkflow] Quiz workflow completed successfully for: ${quizId}`);
      return {
        success: true,
        quizState
      };
    } catch (error) {
      console.error(`[useQuizWorkflow] Error in quiz workflow for ${quizId}:`, error);
      return {
        success: false,
        error: `Fehler beim Starten: ${error}`
      };
    }
  }, [isQuizUnlocked, startQuiz]);

  const submitAnswerWorkflow = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string
  ) => {
    console.log(`[useQuizWorkflow] Starting answer workflow for quiz ${quizId}, question ${questionId}`);
    
    try {
      // Process the answer
      const result = await processAnswer<T>(quizId, questionId, answer, (unlockedQuizzes) => {
        // Handle unlocks if any
        if (unlockedQuizzes.length > 0) {
          console.log(`[useQuizWorkflow] ${unlockedQuizzes.length} quizzes unlocked after answer`);
        }
      });
      
      if (!result.isCorrect) {
        return {
          isCorrect: false,
          hasUnlocks: false,
          completedQuiz: false
        };
      }
      
      // Check for unlocks
      const unlockedQuizzes = checkForUnlocks();
      const hasUnlocks = unlockedQuizzes.length > 0;
      
      // Check if quiz is completed
      const completedQuiz = result.newState ? 
        result.newState.completedQuestions === result.newState.questions.length : 
        false;
      
      console.log(`[useQuizWorkflow] Answer workflow completed - Correct: ${result.isCorrect}, Unlocks: ${hasUnlocks}, Completed: ${completedQuiz}`);
      
      return {
        isCorrect: true,
        newState: result.newState,
        nextQuestionId: result.nextQuestionId,
        hasUnlocks,
        completedQuiz
      };
    } catch (error) {
      console.error(`[useQuizWorkflow] Error in answer workflow:`, error);
      return {
        isCorrect: false,
        hasUnlocks: false,
        completedQuiz: false
      };
    }
  }, [processAnswer, checkForUnlocks]);

  const resetQuizWorkflow = useCallback(async (quizId: string) => {
    console.log(`[useQuizWorkflow] Starting reset workflow for: ${quizId}`);
    
    try {
      const quizState = await resetQuiz(quizId);
      
      if (!quizState) {
        return {
          success: false,
          error: 'Quiz konnte nicht zurückgesetzt werden'
        };
      }
      
      // Check for any unlocks after reset (in case reset affects unlock conditions)
      checkForUnlocks();
      
      console.log(`[useQuizWorkflow] Reset workflow completed successfully for: ${quizId}`);
      return {
        success: true,
        quizState
      };
    } catch (error) {
      console.error(`[useQuizWorkflow] Error in reset workflow for ${quizId}:`, error);
      return {
        success: false,
        error: `Fehler beim Zurücksetzen: ${error}`
      };
    }
  }, [resetQuiz, checkForUnlocks]);

  const checkQuizCompletion = useCallback((quizId: string) => {
    // This would need to be implemented by accessing quiz state
    // For now, return placeholder values
    console.log(`[useQuizWorkflow] Checking completion for quiz: ${quizId}`);
    
    return {
      isCompleted: false,
      progress: 0,
      nextQuestionId: null
    };
  }, []);

  const clearDataWorkflow = useCallback(async () => {
    console.log('[useQuizWorkflow] Starting clear data workflow');
    
    try {
      // Get statistics before clearing
      const statisticsBefore = getStatistics();
      console.log('[useQuizWorkflow] Statistics before clearing:', statisticsBefore);
      
      // Clear all data
      await clearAllData();
      
      console.log('[useQuizWorkflow] Clear data workflow completed successfully');
      return {
        success: true,
        statistics: statisticsBefore
      };
    } catch (error) {
      console.error('[useQuizWorkflow] Error in clear data workflow:', error);
      return {
        success: false,
        error: `Fehler beim Löschen der Daten: ${error}`
      };
    }
  }, [clearAllData, getStatistics]);

  return {
    startQuizWorkflow,
    submitAnswerWorkflow,
    resetQuizWorkflow,
    checkQuizCompletion,
    clearDataWorkflow,
  };
}

export type { QuizWorkflowReturn };