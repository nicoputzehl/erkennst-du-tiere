import React, { createContext, useContext, ReactNode } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { QuizState } from '../types';
import { 
  getQuizState, 
  initializeQuizState, 
  updateQuizState, 
  resetQuizState,
  getQuizStateManagerService 
} from '../services/quizStateManager';
import { QuizStateManagerService } from '../services/factories/quizStateManagerFactory';

interface QuizStateContextType {
  quizStateManagerService: QuizStateManagerService;
  getQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | undefined;
  initializeQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | null;
  updateQuizState: <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>) => void;
  resetQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | null;
}

const QuizStateContext = createContext<QuizStateContextType | null>(null);

export function QuizStateProvider({ children }: { children: ReactNode }) {
  const quizStateManagerService = getQuizStateManagerService();
  
  const contextValue: QuizStateContextType = {
    quizStateManagerService,
    getQuizState,
    initializeQuizState,
    updateQuizState,
    resetQuizState
  };
  
  return (
    <QuizStateContext.Provider value={contextValue}>
      {children}
    </QuizStateContext.Provider>
  );
}

export function useQuizState() {
  const context = useContext(QuizStateContext);
  if (!context) {
    throw new Error('useQuizState must be used within a QuizStateProvider');
  }
  return context;
}