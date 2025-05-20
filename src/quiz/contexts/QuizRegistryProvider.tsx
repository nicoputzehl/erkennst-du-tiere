import React, { createContext, useContext, ReactNode } from 'react';
import { Quiz } from '../types';
import * as QuizRegistryService from '../services/quizRegistry';

interface QuizRegistryContextType {
  getQuizById: <T = any>(id: string) => Quiz<T> | undefined;
  getAllQuizzes: <T = any>() => Quiz<T>[];
  registerQuiz: <T = any>(id: string, quiz: Quiz<T>) => void;
}

const QuizRegistryContext = createContext<QuizRegistryContextType | null>(null);

export function QuizRegistryProvider({ children }: { children: ReactNode }) {
  // Wir verwenden hier direkt die Service-Funktionen
  const contextValue: QuizRegistryContextType = {
    getQuizById: QuizRegistryService.getQuizById,
    getAllQuizzes: QuizRegistryService.getAllQuizzes,
    registerQuiz: QuizRegistryService.registerQuiz
  };
  
  return (
    <QuizRegistryContext.Provider value={contextValue}>
      {children}
    </QuizRegistryContext.Provider>
  );
}

export function useQuizRegistry() {
  const context = useContext(QuizRegistryContext);
  if (!context) {
    throw new Error('useQuizRegistry must be used within a QuizRegistryProvider');
  }
  return context;
}