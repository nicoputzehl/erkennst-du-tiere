import React, { createContext, useContext, ReactNode } from 'react';
import { QuizState } from '../types';
import * as QuizStateService from '../services/quizStateManager';

// Context-Interface
interface QuizStateContextType {
  getQuizState: <T = any>(quizId: string) => QuizState<T> | undefined;
  initializeQuizState: <T = any>(quizId: string) => QuizState<T> | null;
  updateQuizState: <T = any>(quizId: string, newState: QuizState<T>) => void;
  resetQuizState: <T = any>(quizId: string) => QuizState<T> | null;
}

// Context erstellen
const QuizStateContext = createContext<QuizStateContextType | null>(null);

// Provider-Komponente
export function QuizStateProvider({ children }: { children: ReactNode }) {
  const contextValue: QuizStateContextType = {
    getQuizState: QuizStateService.getQuizState,
    initializeQuizState: QuizStateService.initializeQuizState,
    updateQuizState: QuizStateService.updateQuizState,
    resetQuizState: QuizStateService.resetQuizState
  };
  
  return (
    <QuizStateContext.Provider value={contextValue}>
      {children}
    </QuizStateContext.Provider>
  );
}

// Custom Hook
export function useQuizState() {
  const context = useContext(QuizStateContext);
  if (!context) {
    throw new Error('useQuizState must be used within a QuizStateProvider');
  }
  return context;
}