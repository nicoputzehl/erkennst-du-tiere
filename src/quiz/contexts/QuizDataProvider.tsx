import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Quiz } from '../types'; // Vereinfachte Quiz-Type ohne Generics
// Import der Quiz-Definitionen (löst Auto-Registrierung aus)
import '@/src/animals/quizzes';
import { initializeAllQuizzes } from '@/src/common/utils';

interface QuizDataState {
  quizzes: Record<string, Quiz>;
  initialized: boolean;
  isInitializing: boolean;
}

interface QuizDataContextValue {
  getQuizById: (id: string) => Quiz | undefined; // Kein Generic mehr!
  getAllQuizzes: () => Quiz[]; // Vereinfacht!
  getQuizzesByOrder: () => Quiz[]; // Vereinfacht!
  initialized: boolean;
  isInitializing: boolean;
  registerQuiz: (id: string, quiz: Quiz) => void; // Kein Generic mehr!
}

const QuizDataContext = createContext<QuizDataContextValue | null>(null);

export function QuizDataProvider({ children }: { children: ReactNode }) {
  const [dataState, setDataState] = useState<QuizDataState>({
    quizzes: {},
    initialized: false,
    isInitializing: true,
  });

  const registerQuiz = useCallback((id: string, quiz: Quiz) => { // Vereinfacht!
    console.log(`[QuizDataProvider] Registering quiz: ${id}`);
    setDataState(prev => ({
      ...prev,
      quizzes: { ...prev.quizzes, [id]: quiz }
    }));
  }, []);

  const getQuizById = useCallback((id: string): Quiz | undefined => { // Kein Generic!
    return dataState.quizzes[id];
  }, [dataState.quizzes]);

  const getAllQuizzes = useCallback((): Quiz[] => { // Vereinfacht!
    const allQuizzes = Object.values(dataState.quizzes);
    console.log(`[QuizDataProvider] getAllQuizzes called, returning ${allQuizzes.length} quizzes`);
    return allQuizzes;
  }, [dataState.quizzes]);

  const getQuizzesByOrder = useCallback((): Quiz[] => { // Vereinfacht!
    const allQuizzes = Object.values(dataState.quizzes);
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
