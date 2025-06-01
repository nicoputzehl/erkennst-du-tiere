// src/stores/useStoreBridge.ts
// Bridge zwischen neuem Store und altem Provider-System
import { useCallback } from 'react';
import { useQuizStore } from './quizStore';
import { Quiz, QuizState } from '@/src/quiz/types';

interface StoreBridgeReturn {
  // Quiz Content (kompatibel mit useQuizData)
  getQuizById: (id: string) => Quiz | undefined;
  getAllQuizzes: () => Quiz[];
  initialized: boolean;
  isInitializing: boolean;

  // Quiz State (kompatibel mit useQuizState) 
  quizStates: Record<string, QuizState>;
  currentQuizId: string | null;
  currentQuizState: QuizState | null;
  getQuizState: (quizId: string) => QuizState | undefined;
  initializeQuizState: (quizId: string) => Promise<QuizState | null>;
  updateQuizState: (quizId: string, newState: QuizState) => Promise<void>;
  resetQuizState: (quizId: string) => Promise<QuizState | null>;
  
  // Quiz Progress (kompatibel mit useQuizState)
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  // Quiz Operations (kompatibel mit useQuizOperations)
  setCurrentQuiz: (quizId: string | null) => void;
  
  // Statistics (kompatibel mit useQuizState)
  getCompletedQuizzesCount: () => number;
  getTotalQuestionsCount: () => number;
  getCompletedQuestionsCount: () => number;

  // Answer Processing (kompatibel mit useAnswerProcessing)
  processAnswer: (
    quizId: string,
    questionId: number,
    answer: string
  ) => Promise<{
    isCorrect: boolean;
    newState?: QuizState;
    nextQuestionId?: number;
    unlockedQuizzes?: Quiz[];
  }>;

  // UI State Simulation (basic loading)
  isLoading: boolean;
  isOperationLoading: (operation: string) => boolean;
  
  // Debug
  getDebugInfo: () => any;
}

export function useStoreBridge(): StoreBridgeReturn {
  const store = useQuizStore();
  
  // Async wrapper für initializeQuizState
  const initializeQuizState = useCallback(async (quizId: string): Promise<QuizState | null> => {
    return store.initializeQuizState(quizId);
  }, [store]);

  // Async wrapper für updateQuizState
  const updateQuizState = useCallback(async (quizId: string, newState: QuizState): Promise<void> => {
    store.updateQuizState(quizId, newState);
  }, [store]);

  // Async wrapper für resetQuizState
  const resetQuizState = useCallback(async (quizId: string): Promise<QuizState | null> => {
    return store.resetQuizState(quizId);
  }, [store]);

  // Enhanced Answer Processing mit Unlock-Logik
  const processAnswer = useCallback(async (
    quizId: string,
    questionId: number,
    answer: string
  ) => {
    const result = store.submitAnswer(quizId, questionId, answer);
    
    // Simuliere Unlock-Logik (vereinfacht für Migration)
    const unlockedQuizzes: Quiz[] = [];
    
    if (result.isCorrect && result.wasCompleted) {
      // Prüfe ob andere Quizzes freigeschaltet werden sollten
      const allQuizzes = store.getAllQuizzes();
      
      // Einfache Unlock-Logik: nächstes Quiz in Reihenfolge
      // In echter Implementation würde hier die unlock condition geprüft
      const currentQuizIndex = allQuizzes.findIndex(q => q.id === quizId);
      if (currentQuizIndex !== -1 && currentQuizIndex < allQuizzes.length - 1) {
        const nextQuiz = allQuizzes[currentQuizIndex + 1];
        unlockedQuizzes.push(nextQuiz);
      }
    }
    
    return {
      isCorrect: result.isCorrect,
      newState: result.newState,
      nextQuestionId: result.nextQuestionId,
      unlockedQuizzes
    };
  }, [store]);

  return {
    // Quiz Content
    getQuizById: store.getQuizById,
    getAllQuizzes: store.getAllQuizzes,
    initialized: Object.keys(store.quizzes).length > 0, // Simple check
    isInitializing: false, // Store ist immer bereit
    
    // Quiz State
    quizStates: store.quizStates,
    currentQuizId: store.currentQuizId,
    currentQuizState: store.getCurrentQuizState(),
    getQuizState: store.getQuizState,
    initializeQuizState,
    updateQuizState,
    resetQuizState,
    
    // Quiz Progress
    getQuizProgress: store.getQuizProgress,
    getQuizProgressString: store.getQuizProgressString,
    isQuizCompleted: store.isQuizCompleted,
    getNextActiveQuestion: store.getNextActiveQuestion,
    
    // Quiz Operations
    setCurrentQuiz: store.setCurrentQuiz,
    
    // Statistics
    getCompletedQuizzesCount: store.getCompletedQuizzesCount,
    getTotalQuestionsCount: store.getTotalQuestionsCount,
    getCompletedQuestionsCount: store.getCompletedQuestionsCount,
    
    // Answer Processing
    processAnswer,
    
    // UI State
    isLoading: store.isLoading,
    isOperationLoading: store.isOperationLoading,
    
    // Debug
    getDebugInfo: store.getDebugInfo
  };
}