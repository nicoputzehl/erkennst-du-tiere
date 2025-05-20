import React, { createContext, useContext, ReactNode } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { Quiz } from '../types';
import * as QuizRegistryService from '../services/quizRegistry';

interface QuizRegistryContextType {
  getQuizById: <T extends ContentKey = ContentKey>(id: string) => Quiz<T> | undefined;
  getAllQuizzes: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  getQuizzesByContentType: <T extends ContentKey = ContentKey>(contentType: string) => Quiz<T>[];
  registerQuiz: <T extends ContentKey = ContentKey>(id: string, quiz: Quiz<T>, contentType?: string) => void;
}

const QuizRegistryContext = createContext<QuizRegistryContextType | null>(null);

export function QuizRegistryProvider({ children }: { children: ReactNode }) {
  // Wir verwenden hier direkt die Service-Funktionen
  const contextValue: QuizRegistryContextType = {
    getQuizById: QuizRegistryService.getQuizById,
    getAllQuizzes: QuizRegistryService.getAllQuizzes,
    getQuizzesByContentType: QuizRegistryService.getQuizzesByContentType,
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