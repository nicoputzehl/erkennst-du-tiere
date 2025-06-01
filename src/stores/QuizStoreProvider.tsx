// src/stores/QuizStoreProvider.tsx - Enhanced mit UI-State
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuizStore } from './quizStore';
import { useUIStore } from './uiStore';
import { initializeQuizRegistry } from './quizRegistry';
import { Quiz, QuizState } from '@/src/quiz/types';
import { Toast } from '@/src/quiz/components/Toast';

// Vollständige Enhanced Interface mit UI-State
interface QuizStoreFullApi {
  // Basic State
  quizzes: Record<string, Quiz>;
  quizStates: Record<string, QuizState>;
  currentQuizId: string | null;
  isInitialized: boolean;
  isLoading: boolean;
  
  // Quiz Registration
  registerQuiz: (quiz: Quiz) => void;
  setCurrentQuiz: (quizId: string | null) => void;
  
  // Quiz State Management
  initializeQuizState: (quizId: string) => QuizState | null;
  updateQuizState: (quizId: string, newState: QuizState) => void;
  resetQuizState: (quizId: string) => QuizState | null;
  
  // Answer Processing
  submitAnswer: (quizId: string, questionId: number, answer: string) => {
    isCorrect: boolean;
    newState?: QuizState;
    nextQuestionId?: number;
    wasCompleted?: boolean;
  };
  
  // Progress & Status
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  // Loading Management
  setLoading: (operation: string, loading: boolean) => void;
  isOperationLoading: (operation: string) => boolean;
  
  // UI State - NEU in dieser Version
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
  hideToast: () => void;
  
  // Navigation Tracking - NEU
  trackNavigation: (quizId: string) => void;
  clearNavigationHistory: () => void;
  lastNavigatedQuizId: string | null;
  navigationHistory: string[];
  
  // Pending Unlocks - NEU  
  addPendingUnlock: (quizId: string, quizTitle: string) => void;
  checkPendingUnlocks: () => void;
  clearPendingUnlocks: () => void;
  resetPendingUnlocks: () => void;
  getPendingUnlocksCount: () => number;
  
  // Convenience Selectors
  getAllQuizzes: () => Quiz[];
  getQuizById: (id: string) => Quiz | undefined;
  getCurrentQuiz: () => Quiz | null;
  getCurrentQuizState: () => QuizState | null;
  
  // Statistics
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
    // UI Debug Info
    toastCount: number;
    activeOperations: string[];
    navigationHistoryCount: number;
    pendingUnlocksCount: number;
  };
}

interface QuizStoreContextValue {
  store: QuizStoreFullApi;
}

const QuizStoreContext = createContext<QuizStoreContextValue | null>(null);

interface QuizStoreProviderProps {
  children: ReactNode;
  enableUIToasts?: boolean; // Feature Flag für Toast-Rendering
}

export function QuizStoreProvider({ children, enableUIToasts = true }: QuizStoreProviderProps) {
  const quizStore = useQuizStore();
  const uiStore = useUIStore();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    const initializeStore = async () => {
      if (__DEV__) {
        console.log('[QuizStoreProvider] Initializing enhanced store with UI state...');
      }

      try {
        // Quiz Registry initialisieren
        await initializeQuizRegistry();
        
        if (__DEV__) {
          const quizDebugInfo = quizStore.getDebugInfo();
          const uiDebugInfo = uiStore.getDebugInfo();
          console.log('[QuizStoreProvider] Enhanced store initialized:', {
            quiz: quizDebugInfo,
            ui: uiDebugInfo
          });
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('[QuizStoreProvider] Initialization failed:', error);
        setIsInitialized(true);
      }
    };

    initializeStore();
  }, [quizStore, uiStore]);

  // Erstelle vollständige Enhanced API
  const enhancedStore: QuizStoreFullApi = React.useMemo(() => ({
    // Basic State (Quiz Store)
    quizzes: quizStore.quizzes,
    quizStates: quizStore.quizStates,
    currentQuizId: quizStore.currentQuizId,
    isInitialized,
    isLoading: quizStore.isLoading || uiStore.isGlobalLoading,
    
    // Quiz Registration
    registerQuiz: quizStore.registerQuiz,
    setCurrentQuiz: quizStore.setCurrentQuiz,
    
    // Quiz State Management
    initializeQuizState: quizStore.initializeQuizState,
    updateQuizState: quizStore.updateQuizState,
    resetQuizState: quizStore.resetQuizState,
    
    // Answer Processing
    submitAnswer: quizStore.submitAnswer,
    
    // Progress & Status
    getQuizProgress: quizStore.getQuizProgress,
    getQuizProgressString: quizStore.getQuizProgressString,
    isQuizCompleted: quizStore.isQuizCompleted,
    getNextActiveQuestion: quizStore.getNextActiveQuestion,
    
    // Loading Management (kombiniert)
    setLoading: (operation: string, loading: boolean) => {
      quizStore.setLoading(operation, loading);
      if (loading) {
        uiStore.startLoading(operation);
      } else {
        uiStore.stopLoading(operation);
      }
    },
    isOperationLoading: (operation: string) => {
      return quizStore.isOperationLoading(operation) || uiStore.isOperationLoading(operation);
    },
    
    // UI State (UI Store)
    showToast: uiStore.showToast,
    showSuccessToast: uiStore.showSuccessToast,
    showErrorToast: uiStore.showErrorToast,
    showInfoToast: uiStore.showInfoToast,
    showWarningToast: uiStore.showWarningToast,
    hideToast: uiStore.hideToast,
    
    // Navigation Tracking (UI Store)
    trackNavigation: uiStore.trackNavigation,
    clearNavigationHistory: uiStore.clearNavigationHistory,
    lastNavigatedQuizId: uiStore.lastNavigatedQuizId,
    navigationHistory: uiStore.navigationHistory,
    
    // Pending Unlocks (UI Store)
    addPendingUnlock: uiStore.addPendingUnlock,
    checkPendingUnlocks: uiStore.checkPendingUnlocks,
    clearPendingUnlocks: uiStore.clearPendingUnlocks,
    resetPendingUnlocks: uiStore.resetPendingUnlocks,
    getPendingUnlocksCount: uiStore.getPendingUnlocksCount,
    
    // Convenience Selectors
    getAllQuizzes: quizStore.getAllQuizzes,
    getQuizById: quizStore.getQuizById,
    getCurrentQuiz: quizStore.getCurrentQuiz,
    getCurrentQuizState: quizStore.getCurrentQuizState,
    
    // Statistics
    getStatistics: () => {
      const debugInfo = quizStore.getDebugInfo();
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
    
    // Enhanced Debug (kombiniert)
    getDebugInfo: __DEV__ ? () => {
      const quizDebug = quizStore.getDebugInfo();
      const uiDebug = uiStore.getDebugInfo();
      
      return {
        ...quizDebug,
        ...uiDebug
      };
    } : undefined,
  }), [
    quizStore, 
    uiStore, 
    isInitialized
  ]);

  return (
    <QuizStoreContext.Provider value={{ store: enhancedStore }}>
      {children}
      {enableUIToasts && uiStore.activeToast && (
        <Toast
          visible={!!uiStore.activeToast}
          message={uiStore.activeToast.message}
          type={uiStore.activeToast.type}
          duration={uiStore.activeToast.duration}
          position={uiStore.activeToast.position}
          onHide={uiStore.hideToast}
        />
      )}
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

// Hook für direkten Store-Zugriff (vollständig)
export function useQuizStoreEnhanced(): QuizStoreFullApi {
  const { store } = useQuizStoreContext();
  return store;
}

// Convenience Hooks für spezifische Bereiche
export function useQuizData() {
  const store = useQuizStoreEnhanced();
  return {
    getAllQuizzes: store.getAllQuizzes,
    getQuizById: store.getQuizById,
    getCurrentQuiz: store.getCurrentQuiz,
    isInitialized: store.isInitialized
  };
}

export function useQuizState() {
  const store = useQuizStoreEnhanced();
  return {
    quizStates: store.quizStates,
    currentQuizId: store.currentQuizId,
    currentQuizState: store.getCurrentQuizState(),
    getQuizState: (id: string) => store.quizStates[id],
    initializeQuizState: store.initializeQuizState,
    updateQuizState: store.updateQuizState,
    resetQuizState: store.resetQuizState,
    getQuizProgress: store.getQuizProgress,
    getQuizProgressString: store.getQuizProgressString,
    isQuizCompleted: store.isQuizCompleted,
    getNextActiveQuestion: store.getNextActiveQuestion
  };
}

export function useQuizUI() {
  const store = useQuizStoreEnhanced();
  return {
    isLoading: store.isLoading,
    isOperationLoading: store.isOperationLoading,
    setLoading: store.setLoading,
    showToast: store.showToast,
    showSuccessToast: store.showSuccessToast,
    showErrorToast: store.showErrorToast,
    showInfoToast: store.showInfoToast,
    showWarningToast: store.showWarningToast,
    trackNavigation: store.trackNavigation,
    lastNavigatedQuizId: store.lastNavigatedQuizId,
    navigationHistory: store.navigationHistory,
    addPendingUnlock: store.addPendingUnlock,
    checkPendingUnlocks: store.checkPendingUnlocks,
    getPendingUnlocksCount: store.getPendingUnlocksCount
  };
}

// Alias für Kompatibilität mit bestehenden Importen
export const useQuizStoreSimple = useQuizStoreEnhanced;