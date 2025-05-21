import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
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

interface QuizStateContextProps {
  quizStateManagerService: QuizStateManagerService;
  getQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | undefined;
  initializeQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  updateQuizState: <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>) => Promise<void>;
  resetQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  isLoading: boolean;
}

const QuizStateContext = createContext<QuizStateContextProps | null>(null);

export function QuizStateProvider({ children }: { children: ReactNode }) {
  const quizStateManagerService = getQuizStateManagerService();
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialisierung des Services
  useEffect(() => {
    const initializeServices = async () => {
      setIsLoading(true);
      try {
        // Hier könnten wir andere Initialisierungen durchführen
        console.log('[QuizStateProvider] Services initialized');
      } catch (error) {
        console.error('[QuizStateProvider] Error initializing services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeServices();
  }, []);
  
  // Memoize the context value
  const contextValue = useMemo(() => {
    console.log('[QuizStateProvider] Creating memoized context value');
    
    return {
      quizStateManagerService,
      getQuizState,
      initializeQuizState: async <T extends ContentKey = ContentKey>(quizId: string) => {
        try {
          return await initializeQuizState<T>(quizId);
        } catch (error) {
          console.error(`[QuizStateProvider] Error initializing quiz state for ${quizId}:`, error);
          return null;
        }
      },
      updateQuizState: async <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>) => {
        try {
          await updateQuizState(quizId, newState);
        } catch (error) {
          console.error(`[QuizStateProvider] Error updating quiz state for ${quizId}:`, error);
        }
      },
      resetQuizState: async <T extends ContentKey = ContentKey>(quizId: string) => {
        try {
          return await resetQuizState<T>(quizId);
        } catch (error) {
          console.error(`[QuizStateProvider] Error resetting quiz state for ${quizId}:`, error);
          return null;
        }
      },
      isLoading
    };
  }, [quizStateManagerService, isLoading]);
  
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