import React, { createContext, ReactNode, useContext } from 'react';
import { Quiz, QuizState } from '../types';

import { useQuizData } from './QuizDataProvider';
import { useQuizState } from './QuizStateProvider';
import { useUIState } from './UIStateProvider';

import {
  AnswerResult,
  UnlockProgress,
  useAnswerProcessing,
  useDataManagement,
  useQuizOperations,
  useUnlockSystem
} from '../hooks';

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
  
  // UI-Feedback
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
  
  // Quiz-Operationen
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
  
  const {
    isGlobalLoading,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  } = useUIState();

  const { processAnswer } = useAnswerProcessing();
  const { 
    getUnlockProgress, 
    checkForUnlocks, 
    isQuizUnlocked, 
    getUnlockDescription 
  } = useUnlockSystem();
  const { 
    startQuiz, 
    loadQuiz, 
    resetQuiz, 
    setCurrentQuiz 
  } = useQuizOperations();
  const { 
    clearAllData, 
    getStatistics 
  } = useDataManagement();

  const initialized = dataInitialized && stateInitialized;
  const isInitializing = !initialized;

  const answerQuizQuestion = async (quizId: string, questionId: number, answer: string): Promise<AnswerResult> => {
    return processAnswer(quizId, questionId, answer, checkForUnlocks);
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
    isLoading: isGlobalLoading,
    initialized,
    isInitializing,
    
    // UI-Feedback
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    
    // Quiz-Interaktionen
    answerQuizQuestion,
    
    // Unlock-System
    getUnlockProgress,
    checkForUnlocks,
    isQuizUnlocked,
    getUnlockDescription,
    
    // Quiz-Operationen
    startQuiz,
    loadQuiz,
    resetQuiz,
    setCurrentQuizId: setCurrentQuiz,
    
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