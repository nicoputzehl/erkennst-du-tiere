import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Quiz, QuizConfig } from '../types';
import '@/src/animals/quizzes';
import { initializeAllQuizzes } from '@/src/common/utils';
import { extractQuizContent } from '../utils';

interface QuizDataState {
  quizzes: Record<string, Quiz>;
  quizConfigs: Record<string, QuizConfig>;
  initialized: boolean;
  isInitializing: boolean;
}

interface QuizDataContextValue {
  // Quiz-Inhalt (für Anzeige)
  getQuizById: (id: string) => Quiz | undefined;
  getAllQuizzes: () => Quiz[];
  getQuizzesByOrder: () => Quiz[];
  
  // Quiz-Konfiguration (für Logik)
  getQuizConfigById: (id: string) => QuizConfig | undefined;
  getAllQuizConfigs: () => QuizConfig[];
  getQuizConfigsByOrder: () => QuizConfig[];
  
  // Status
  initialized: boolean;
  isInitializing: boolean;
  
  // Registrierung (intern)
  registerQuizConfig: (id: string, config: QuizConfig) => void;
}

const QuizDataContext = createContext<QuizDataContextValue | null>(null);

export function QuizDataProvider({ children }: { children: ReactNode }) {
  const [dataState, setDataState] = useState<QuizDataState>({
    quizzes: {},
    quizConfigs: {},
    initialized: false,
    isInitializing: true,
  });

  const registerQuizConfig = useCallback((id: string, config: QuizConfig) => { 
    console.log(`[QuizDataProvider] Registering quiz config: ${id}`);
    
    const quiz = extractQuizContent(config);
    
    setDataState(prev => ({
      ...prev,
      quizzes: { ...prev.quizzes, [id]: quiz },
      quizConfigs: { ...prev.quizConfigs, [id]: config }
    }));
  }, []);

  const getQuizById = useCallback((id: string): Quiz | undefined => {
    return dataState.quizzes[id];
  }, [dataState.quizzes]);

  const getAllQuizzes = useCallback((): Quiz[] => {
    const allQuizzes = Object.values(dataState.quizzes);
    console.log(`[QuizDataProvider] getAllQuizzes called, returning ${allQuizzes.length} quizzes`);
    return allQuizzes;
  }, [dataState.quizzes]);

  const getQuizzesByOrder = useCallback((): Quiz[] => {
    const allConfigs = Object.values(dataState.quizConfigs);
    return allConfigs
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(config => dataState.quizzes[config.id])
      .filter(Boolean);
  }, [dataState.quizzes, dataState.quizConfigs]);


  const getQuizConfigById = useCallback((id: string): QuizConfig | undefined => {
    return dataState.quizConfigs[id];
  }, [dataState.quizConfigs]);

  const getAllQuizConfigs = useCallback((): QuizConfig[] => {
    return Object.values(dataState.quizConfigs);
  }, [dataState.quizConfigs]);

  const getQuizConfigsByOrder = useCallback((): QuizConfig[] => {
    const allConfigs = Object.values(dataState.quizConfigs);
    return allConfigs.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [dataState.quizConfigs]);

  useEffect(() => {
    const initializeQuizRegistry = async () => {
      try {
        console.log('[QuizDataProvider] Initializing quiz registry...');
        
        (globalThis as any).registerQuizInProvider = registerQuizConfig;
        
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
  }, [registerQuizConfig]);

  const contextValue: QuizDataContextValue = {
    // Quiz-Inhalt
    getQuizById,
    getAllQuizzes,
    getQuizzesByOrder,
    
    // Quiz-Konfiguration
    getQuizConfigById,
    getAllQuizConfigs,
    getQuizConfigsByOrder,
    
    // Status
    initialized: dataState.initialized,
    isInitializing: dataState.isInitializing,
    
    // Registrierung
    registerQuizConfig,
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