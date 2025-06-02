// src/quiz/contexts/QuizProvider.tsx - Fixed Infinite Loop (Schritt 5A - Fix)
import React, { createContext, ReactNode, useContext, useRef } from 'react';
import { Quiz, QuizState } from '../types';

import { useQuizData } from './QuizDataProvider';
import { useQuizState } from './QuizStateProvider';


import {
  AnswerResult,
  UnlockProgress,
  useAnswerProcessing,
  useDataManagement,
  useQuizOperations,
  useUnlockSystem
} from '../hooks';
import { useUIStoreBridge } from '../../stores/useUIStoreBridge';

interface QuizContextValue {
  // Quiz-Inhalt (für Anzeige)
  getQuizById: (id: string) => Quiz | undefined;
  getAllQuizzes: () => Quiz[];
  
  // Quiz-State Management
  getQuizState: (quizId: string) => QuizState | undefined;
  initializeQuizState: (quizId: string) => Promise<QuizState | null>;
  updateQuizState: (quizId: string, newState: QuizState) => Promise<void>;
  resetQuizState: (quizId: string) => Promise<QuizState | null>;
  
  // Quiz-Fortschritt
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  // Aktueller Quiz-Zustand
  currentQuizId: string | null;
  currentQuizState: QuizState | null;
  isLoading: boolean;
  initialized: boolean;
  isInitializing: boolean;
  
  // UI-Feedback - via UI Store Bridge (but simplified)
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
  
  // Quiz-Interaktionen
  answerQuizQuestion: (quizId: string, questionId: number, answer: string) => Promise<AnswerResult>;
  
  // Unlock-System
  getUnlockProgress: (quizId: string) => UnlockProgress;
  checkForUnlocks: () => Quiz[];
  isQuizUnlocked: (quizId: string) => boolean;
  getUnlockDescription: (quizId: string) => string | null;
  
  // Quiz-Operationen (simplified to avoid loops)
  startQuiz: (quizId: string) => Promise<QuizState | null>;
  loadQuiz: (quizId: string) => Promise<QuizState | null>;
  resetQuiz: (quizId: string) => Promise<QuizState | null>;
  setCurrentQuizId: (id: string | null) => void;
  
  // Daten-Management
  clearAllData: () => Promise<void>;
  getStatistics: () => {
    totalQuizzes: number;
    completedQuizzes: number;
    totalQuestions: number;
    completedQuestions: number;
    completionPercentage: number;
  };
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const {
    getQuizById,
    getAllQuizzes,
    initialized: dataInitialized
  } = useQuizData();
  
  const {
    currentQuizId,
    currentQuizState,
    initialized: stateInitialized,
    getQuizState,
    initializeQuizState,
    updateQuizState,
    resetQuizState,
    getQuizProgress,
    getQuizProgressString,
    isQuizCompleted,
    getNextActiveQuestion,
  } = useQuizState();
  
  // UI Store Bridge - with refs to prevent loops
  const uiStoreBridge = useUIStoreBridge();
  const processingRef = useRef(new Set<string>());

  const { processAnswer } = useAnswerProcessing();
  const { 
    getUnlockProgress, 
    checkForUnlocks, 
    isQuizUnlocked, 
    getUnlockDescription 
  } = useUnlockSystem();
  
  // SIMPLIFIED: Use Quiz State Provider hooks directly to avoid loops
  const { 
    initializeQuizState: initQuizState,
    resetQuizState: resetState,
    setCurrentQuiz 
  } = useQuizState();
  
  const { 
    clearAllData, 
    getStatistics 
  } = useDataManagement();

  const initialized = dataInitialized && stateInitialized;
  const isInitializing = !initialized;

  const answerQuizQuestion = async (quizId: string, questionId: number, answer: string): Promise<AnswerResult> => {
    return processAnswer(quizId, questionId, answer, checkForUnlocks);
  };

  // FIXED: Simplified Quiz Operations to prevent loops
  const startQuiz = async (quizId: string): Promise<QuizState | null> => {
    // Prevent duplicate operations
    if (processingRef.current.has(`start-${quizId}`)) {
      console.log(`[QuizProvider] Skipping duplicate startQuiz for: ${quizId}`);
      return getQuizState(quizId) || null;
    }

    processingRef.current.add(`start-${quizId}`);
    
    try {
      console.log(`[QuizProvider] Starting quiz: ${quizId}`);
      
      // Initialize quiz state if needed
      const quizState = await initQuizState(quizId);
      
      if (quizState) {
        // Set as current quiz (this will not trigger navigation tracking)
        setCurrentQuiz(quizId, quizState);
        console.log(`[QuizProvider] Quiz ${quizId} started successfully`);
      }
      
      return quizState;
    } catch (error) {
      console.error(`[QuizProvider] Error starting quiz ${quizId}:`, error);
      uiStoreBridge.showErrorToast(`Fehler beim Starten des Quiz: ${error}`);
      return null;
    } finally {
      processingRef.current.delete(`start-${quizId}`);
    }
  };

  const loadQuiz = async (quizId: string): Promise<QuizState | null> => {
    return startQuiz(quizId);
  };

  const resetQuiz = async (quizId: string): Promise<QuizState | null> => {
    // Prevent duplicate operations
    if (processingRef.current.has(`reset-${quizId}`)) {
      console.log(`[QuizProvider] Skipping duplicate resetQuiz for: ${quizId}`);
      return getQuizState(quizId) || null;
    }

    processingRef.current.add(`reset-${quizId}`);
    
    try {
      console.log(`[QuizProvider] Resetting quiz: ${quizId}`);
      
      const newState = await resetState(quizId);
      
      if (newState) {
        uiStoreBridge.showSuccessToast(`Quiz "${newState.title}" wurde zurückgesetzt!`);
        console.log(`[QuizProvider] Quiz ${quizId} reset successfully`);
      }
      
      return newState;
    } catch (error) {
      console.error(`[QuizProvider] Error resetting quiz ${quizId}:`, error);
      uiStoreBridge.showErrorToast(`Fehler beim Zurücksetzen des Quiz: ${error}`);
      return null;
    } finally {
      processingRef.current.delete(`reset-${quizId}`);
    }
  };

  const setCurrentQuizId = (quizId: string | null) => {
    console.log(`[QuizProvider] Setting current quiz to: ${quizId}`);
    
    if (quizId) {
      const quizState = getQuizState(quizId);
      setCurrentQuiz(quizId, quizState);
      // NOTE: No navigation tracking here to prevent loops
    } else {
      setCurrentQuiz(null, null);
    }
  };

  const contextValue: QuizContextValue = {
    // Quiz-Inhalt
    getQuizById,
    getAllQuizzes,
    
    // Quiz-State Management
    getQuizState,
    initializeQuizState,
    updateQuizState,
    resetQuizState,
    
    // Quiz-Fortschritt
    getQuizProgress,
    getQuizProgressString,
    isQuizCompleted,
    getNextActiveQuestion,
    
    // Aktueller Quiz-Zustand
    currentQuizId,
    currentQuizState,
    isLoading: uiStoreBridge.isGlobalLoading,
    initialized,
    isInitializing,
    
    // UI-Feedback - Simplified
    showSuccessToast: uiStoreBridge.showSuccessToast,
    showErrorToast: uiStoreBridge.showErrorToast,
    showInfoToast: uiStoreBridge.showInfoToast,
    showWarningToast: uiStoreBridge.showWarningToast,
    
    // Quiz-Interaktionen
    answerQuizQuestion,
    
    // Unlock-System
    getUnlockProgress,
    checkForUnlocks,
    isQuizUnlocked,
    getUnlockDescription,
    
    // Quiz-Operationen - Fixed
    startQuiz,
    loadQuiz,
    resetQuiz,
    setCurrentQuizId,
    
    // Daten-Management
    clearAllData,
    getStatistics,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

export type { QuizContextValue };