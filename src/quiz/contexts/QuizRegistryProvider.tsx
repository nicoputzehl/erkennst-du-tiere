import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { Quiz } from '../types';
import {
  getQuizById,
  getAllQuizzes,
  getQuizzesByContentType,
  registerQuiz,
  getQuizRegistryService,
} from '../services/quizRegistry';
import { QuizRegistryService } from '../services/factories/quizRegistryFactory';

interface QuizRegistryContextProps {
  quizRegistryService: QuizRegistryService;
  getQuizById: <T extends ContentKey = ContentKey>(
    id: string
  ) => Quiz<T> | undefined;
  getAllQuizzes: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  getQuizzesByContentType: <T extends ContentKey = ContentKey>(
    contentType: string
  ) => Quiz<T>[];
  registerQuiz: <T extends ContentKey = ContentKey>(
    id: string,
    quiz: Quiz<T>,
    contentType?: string
  ) => void;
}

const QuizRegistryContext = createContext<QuizRegistryContextProps | null>(null);

export function QuizRegistryProvider({ children }: { children: ReactNode }) {
  const quizRegistryService = getQuizRegistryService();

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    console.log('[QuizRegistryProvider] Creating memoized context value');
    
    return {
      quizRegistryService,
      getQuizById,
      getAllQuizzes,
      getQuizzesByContentType,
      registerQuiz,
    };
  }, [quizRegistryService]);

  return (
    <QuizRegistryContext.Provider value={contextValue}>
      {children}
    </QuizRegistryContext.Provider>
  );
}

export function useQuizRegistry() {
  const context = useContext(QuizRegistryContext);
  if (!context) {
    throw new Error(
      'useQuizRegistry must be used within a QuizRegistryProvider'
    );
  }
  return context;
}