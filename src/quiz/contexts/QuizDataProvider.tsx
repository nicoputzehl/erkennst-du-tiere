import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { ContentKey, Quiz } from '../types';
// Import der Quiz-Definitionen (löst Auto-Registrierung aus)
import '@/src/animals/quizzes';
import { initializeAllQuizzes } from '@/src/common/utils';

interface QuizDataState {
  quizzes: Record<string, Quiz>;
  initialized: boolean;
  isInitializing: boolean;
}

interface QuizDataContextValue {
  getQuizById: <T extends ContentKey = ContentKey>(id: string) => Quiz<T> | undefined;
  getAllQuizzes: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  getQuizzesByOrder: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  initialized: boolean;
  isInitializing: boolean;
  registerQuiz: <T extends ContentKey = ContentKey>(id: string, quiz: Quiz<T>) => void;
}

const QuizDataContext = createContext<QuizDataContextValue | null>(null);


export function QuizDataProvider({ children }: { children: ReactNode }) {
  const [dataState, setDataState] = useState<QuizDataState>({
    quizzes: {},
    initialized: false,
    isInitializing: true,
  });

  const registerQuiz = useCallback(<T extends ContentKey = ContentKey>(
    id: string, 
    quiz: Quiz<T>
  ) => {
    console.log(`[QuizDataProvider] Registering quiz: ${id}`);
    setDataState(prev => ({
      ...prev,
      quizzes: { ...prev.quizzes, [id]: quiz }
    }));
  }, []);

  const getQuizById = useCallback(<T extends ContentKey = ContentKey>(id: string): Quiz<T> | undefined => {
    return dataState.quizzes[id] as Quiz<T> | undefined;
  }, [dataState.quizzes]);

  const getAllQuizzes = useCallback(<T extends ContentKey = ContentKey>(): Quiz<T>[] => {
    const allQuizzes = Object.values(dataState.quizzes) as Quiz<T>[];
    console.log(`[QuizDataProvider] getAllQuizzes called, returning ${allQuizzes.length} quizzes`);
    return allQuizzes;
  }, [dataState.quizzes]);

  const getQuizzesByOrder = useCallback(<T extends ContentKey = ContentKey>(): Quiz<T>[] => {
    const allQuizzes = Object.values(dataState.quizzes) as Quiz<T>[];
    return allQuizzes.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [dataState.quizzes]);

  useEffect(() => {
    const initializeQuizRegistry = async () => {
      try {
        console.log('[QuizDataProvider] Initializing quiz registry...');
        
        (globalThis as any).registerQuizInProvider = registerQuiz;
        
        await initializeAllQuizzes();
        
        setDataState(prev => ({
          ...prev,
          initialized: true,
          isInitializing: false
        }));
        
        console.log('[QuizDataProvider] Quiz registry initialization complete');
      } catch (error) {
        console.error('[QuizDataProvider] Quiz registry initialization error:', error);
        setDataState(prev => ({
          ...prev,
          isInitializing: false
        }));
      }
    };
    
    initializeQuizRegistry();
    
    return () => {
      delete (globalThis as any).registerQuizInProvider;
    };
  }, [registerQuiz]);

  const contextValue: QuizDataContextValue = {
    getQuizById,
    getAllQuizzes,
    getQuizzesByOrder,
    initialized: dataState.initialized,
    isInitializing: dataState.isInitializing,
    registerQuiz,
  };

  return (
    <QuizDataContext.Provider value={contextValue}>
      {children}
    </QuizDataContext.Provider>
  );
}

export function useQuizData() {
  const context = useContext(QuizDataContext);
  if (!context) {
    throw new Error('useQuizData must be used within a QuizDataProvider');
  }
  return context;
}

export type { QuizDataContextValue };
