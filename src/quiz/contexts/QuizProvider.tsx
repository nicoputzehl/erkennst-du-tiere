import React, { createContext, ReactNode, useContext } from 'react';
import { ContentKey, Quiz, QuizState } from '../types';

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
  getQuizById: <T extends ContentKey = ContentKey>(id: string) => Quiz<T> | undefined;
  getAllQuizzes: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  
  getQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | undefined;
  initializeQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  updateQuizState: <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>) => Promise<void>;
  resetQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  currentQuizId: string | null;
  currentQuizState: QuizState<ContentKey> | null;
  isLoading: boolean;
  initialized: boolean;
  isInitializing: boolean;
  
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
  
  answerQuizQuestion: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string
  ) => Promise<AnswerResult<T>>;
  
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

  const answerQuizQuestion = async <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string
  ): Promise<AnswerResult<T>> => {
    return processAnswer<T>(quizId, questionId, answer, checkForUnlocks);
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
