// src/quiz/contexts/QuizDataProvider.tsx
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { Quiz } from '../types';
import { initializeAllQuizzes } from '@/src/core/initialization/quizInitialization';

// =============================================================================
// TYPES - Nur für Quiz-Daten und Registry
// =============================================================================

// Import der Quiz-Definitionen (löst Auto-Registrierung aus)
import '@/src/animals/quizzes';

interface QuizDataState {
  quizzes: Record<string, Quiz>;
  initialized: boolean;
  isInitializing: boolean;
}

interface QuizDataContextValue {
  // Quiz Registry - Read Operations
  getQuizById: <T extends ContentKey = ContentKey>(id: string) => Quiz<T> | undefined;
  getAllQuizzes: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  getQuizzesByOrder: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  
  // Registry Status
  initialized: boolean;
  isInitializing: boolean;
  
  // Registry Management (internal)
  registerQuiz: <T extends ContentKey = ContentKey>(id: string, quiz: Quiz<T>) => void;
}

const QuizDataContext = createContext<QuizDataContextValue | null>(null);


// =============================================================================
// QUIZ DATA PROVIDER - Nur für Registry und Quiz-Definitionen
// =============================================================================

export function QuizDataProvider({ children }: { children: ReactNode }) {
  // Minimaler State - nur Quiz-Definitionen
  const [dataState, setDataState] = useState<QuizDataState>({
    quizzes: {},
    initialized: false,
    isInitializing: true,
  });

  // =============================================================================
  // REGISTRY FUNCTIONS - Reine Quiz-Verwaltung
  // =============================================================================
  
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

  // =============================================================================
  // INITIALIZATION - Nur Quiz-Registry laden
  // =============================================================================
  
  useEffect(() => {
    const initializeQuizRegistry = async () => {
      try {
        console.log('[QuizDataProvider] Initializing quiz registry...');
        
        // Globale Registrierungsfunktion bereitstellen
        (globalThis as any).registerQuizInProvider = registerQuiz;
        
        // Quiz-Definitionen laden (aus den importierten Modulen)
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
    
    // Cleanup
    return () => {
      delete (globalThis as any).registerQuizInProvider;
    };
  }, [registerQuiz]);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================
  
  const contextValue: QuizDataContextValue = {
    // Quiz Registry
    getQuizById,
    getAllQuizzes,
    getQuizzesByOrder,
    
    // Status
    initialized: dataState.initialized,
    isInitializing: dataState.isInitializing,
    
    // Internal (für andere Provider)
    registerQuiz,
  };

  return (
    <QuizDataContext.Provider value={contextValue}>
      {children}
    </QuizDataContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useQuizData() {
  const context = useContext(QuizDataContext);
  if (!context) {
    throw new Error('useQuizData must be used within a QuizDataProvider');
  }
  return context;
}

// =============================================================================
// TYPESCRIPT UTILITIES
// =============================================================================

export type { QuizDataContextValue };