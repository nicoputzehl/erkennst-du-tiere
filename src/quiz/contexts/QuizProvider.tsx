import React, { createContext, ReactNode, useContext } from 'react';
import { Quiz, QuizState } from '../types'; // Vereinfachte Types ohne Generics

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
  getQuizById: (id: string) => Quiz | undefined; // Kein Generic!
  getAllQuizzes: () => Quiz[]; // Vereinfacht!
  
  getQuizState: (quizId: string) => QuizState | undefined; // Kein Generic!
  initializeQuizState: (quizId: string) => Promise<QuizState | null>; // Vereinfacht!
  updateQuizState: (quizId: string, newState: QuizState) => Promise<void>; // Vereinfacht!
  resetQuizState: (quizId: string) => Promise<QuizState | null>; // Vereinfacht!
  
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  currentQuizId: string | null;
  currentQuizState: QuizState | null; // Kein Generic!
  isLoading: boolean;
  initialized: boolean;
  isInitializing: boolean;
  
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
  
  answerQuizQuestion: (quizId: string, questionId: number, answer: string) => Promise<AnswerResult>; // Vereinfacht!
  
  getUnlockProgress: (quizId: string) => UnlockProgress;
  checkForUnlocks: () => Quiz[];
  isQuizUnlocked: (quizId: string) => boolean;
  getUnlockDescription: (quizId: string) => string | null;
  
  startQuiz: (quizId: string) => Promise<QuizState | null>;
  loadQuiz: (quizId: string) => Promise<QuizState | null>;
  resetQuiz: (quizId: string) => Promise<QuizState | null>;
  setCurrentQuizId: (id: string | null) => void;
  
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

  const answerQuizQuestion = async (quizId: string, questionId: number, answer: string): Promise<AnswerResult> => { // Vereinfacht!
    return processAnswer(quizId, questionId, answer, checkForUnlocks);
  };

  const contextValue: QuizContextValue = {
    getQuizById,
    getAllQuizzes,
    
    getQuizState,
    initializeQuizState,
    updateQuizState,
    resetQuizState,
    
    getQuizProgress,
    getQuizProgressString,
    isQuizCompleted,
    getNextActiveQuestion,
    
    currentQuizId,
    currentQuizState,
    isLoading: isGlobalLoading,
    initialized,
    isInitializing,
    
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    
    answerQuizQuestion,
    
    getUnlockProgress,
    checkForUnlocks,
    isQuizUnlocked,
    getUnlockDescription,
    
    startQuiz,
    loadQuiz,
    resetQuiz,
    setCurrentQuizId: setCurrentQuiz,
    
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