// src/stores/QuizStoreProvider.tsx
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuizStore } from './quizStore';
import { initializeQuizRegistry } from './quizRegistry';
import { Quiz, QuizState } from '@/src/quiz/types';

// Erweiterte Interface für Store-Funktionen
interface QuizStoreEnhancedApi {
  // Basic State
  quizzes: Record<string, Quiz>;
  quizStates: Record<string, QuizState>;
  currentQuizId: string | null;
  isInitialized: boolean;
  isLoading: boolean;
  
  // Quiz Registration
  registerQuiz: (quiz: Quiz) => void;
  setCurrentQuiz: (quizId: string | null) => void;
  
  // Quiz State Management - NEU
  initializeQuizState: (quizId: string) => QuizState | null;
  updateQuizState: (quizId: string, newState: QuizState) => void;
  resetQuizState: (quizId: string) => QuizState | null;
  
  // Answer Processing - NEU
  submitAnswer: (quizId: string, questionId: number, answer: string) => {
    isCorrect: boolean;
    newState?: QuizState;
    nextQuestionId?: number;
    wasCompleted?: boolean;
  };
  
  // Progress & Status - NEU
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  // Loading Management - NEU
  setLoading: (operation: string, loading: boolean) => void;
  isOperationLoading: (operation: string) => boolean;
  
  // Convenience Selectors
  getAllQuizzes: () => Quiz[];
  getQuizById: (id: string) => Quiz | undefined;
  getCurrentQuiz: () => Quiz | null;
  getCurrentQuizState: () => QuizState | null;
  
  // Statistics - NEU
  getStatistics: () => {
    totalQuizzes: number;
    completedQuizzes: number;
    totalQuestions: number;
    completedQuestions: number;
    completionPercentage: number;
  };
  
  // Debug (optional)
  getDebugInfo?: () => {
    quizzesCount: number;
    statesCount: number;
    currentQuiz: string | null;
    allQuizIds: string[];
    completedQuizzes: number;
    totalQuestions: number;
    completedQuestions: number;
  };
}

interface QuizStoreContextValue {
  store: QuizStoreEnhancedApi;
}

const QuizStoreContext = createContext<QuizStoreContextValue | null>(null);

interface QuizStoreProviderProps {
  children: ReactNode;
}

export function QuizStoreProvider({ children }: QuizStoreProviderProps) {
  const zustandStore = useQuizStore();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    const initializeStore = async () => {
      if (__DEV__) {
        console.log('[QuizStoreProvider] Initializing enhanced store...');
      }

      try {
        // Registry initialisieren (lädt alle Quiz-Module)
        await initializeQuizRegistry();
        
        if (__DEV__) {
          const debugInfo = zustandStore.getDebugInfo();
          console.log('[QuizStoreProvider] Enhanced store initialized with:', debugInfo);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('[QuizStoreProvider] Initialization failed:', error);
        setIsInitialized(true);
      }
    };

    initializeStore();
  }, [zustandStore]);

  // Erstelle erweiterte API
  const enhancedStore: QuizStoreEnhancedApi = React.useMemo(() => ({
    // Basic State
    quizzes: zustandStore.quizzes,
    quizStates: zustandStore.quizStates,
    currentQuizId: zustandStore.currentQuizId,
    isInitialized,
    isLoading: zustandStore.isLoading,
    
    // Quiz Registration
    registerQuiz: zustandStore.registerQuiz,
    setCurrentQuiz: zustandStore.setCurrentQuiz,
    
    // Quiz State Management - NEU
    initializeQuizState: zustandStore.initializeQuizState,
    updateQuizState: zustandStore.updateQuizState,
    resetQuizState: zustandStore.resetQuizState,
    
    // Answer Processing - NEU
    submitAnswer: zustandStore.submitAnswer,
    
    // Progress & Status - NEU
    getQuizProgress: zustandStore.getQuizProgress,
    getQuizProgressString: zustandStore.getQuizProgressString,
    isQuizCompleted: zustandStore.isQuizCompleted,
    getNextActiveQuestion: zustandStore.getNextActiveQuestion,
    
    // Loading Management - NEU
    setLoading: zustandStore.setLoading,
    isOperationLoading: zustandStore.isOperationLoading,
    
    // Convenience Selectors
    getAllQuizzes: zustandStore.getAllQuizzes,
    getQuizById: zustandStore.getQuizById,
    getCurrentQuiz: zustandStore.getCurrentQuiz,
    getCurrentQuizState: zustandStore.getCurrentQuizState,
    
    // Statistics - NEU
    getStatistics: () => {
      const debugInfo = zustandStore.getDebugInfo();
      const completionPercentage = debugInfo.totalQuestions > 0 
        ? Math.round((debugInfo.completedQuestions / debugInfo.totalQuestions) * 100)
        : 0;
        
      return {
        totalQuizzes: debugInfo.quizzesCount,
        completedQuizzes: debugInfo.completedQuizzes,
        totalQuestions: debugInfo.totalQuestions,
        completedQuestions: debugInfo.completedQuestions,
        completionPercentage
      };
    },
    
    // Debug (nur in Development)
    getDebugInfo: __DEV__ ? zustandStore.getDebugInfo : undefined,
  }), [zustandStore, isInitialized]);

  return (
    <QuizStoreContext.Provider value={{ store: enhancedStore }}>
      {children}
    </QuizStoreContext.Provider>
  );
}

export function useQuizStoreContext() {
  const context = useContext(QuizStoreContext);
  if (!context) {
    throw new Error('useQuizStoreContext must be used within QuizStoreProvider');
  }
  return context;
}

// Hook für direkten Store-Zugriff (erweitert)
export function useQuizStoreEnhanced(): QuizStoreEnhancedApi {
  const { store } = useQuizStoreContext();
  return store;
}

// Alias für Kompatibilität
export const useQuizStoreSimple = useQuizStoreEnhanced;