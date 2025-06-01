// src/stores/ParallelQuizProvider.tsx
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuizStore } from './quizStore';

interface ParallelQuizContextValue {
  store: ReturnType<typeof useQuizStore>;
}

const ParallelQuizContext = createContext<ParallelQuizContextValue | null>(null);

interface ParallelQuizProviderProps {
  children: ReactNode;
  enableLogging?: boolean;
}

export function ParallelQuizProvider({ 
  children, 
  enableLogging = false 
}: ParallelQuizProviderProps) {
  const store = useQuizStore();

  useEffect(() => {
    if (enableLogging) {
      console.log('[ParallelQuizProvider] Mounted with store:', store.getDebugInfo());
      
      // Log store changes in dev mode
      if (__DEV__) {
        const unsubscribe = useQuizStore.subscribe((state) => {
          console.log('[ParallelQuizProvider] Store updated:', {
            quizzesCount: Object.keys(state.quizzes).length,
            currentQuiz: state.currentQuizId
          });
        });
        
        return unsubscribe;
      }
    }
  }, [store, enableLogging]);

  return (
    <ParallelQuizContext.Provider value={{ store }}>
      {children}
    </ParallelQuizContext.Provider>
  );
}

export function useParallelQuiz() {
  const context = useContext(ParallelQuizContext);
  if (!context) {
    throw new Error('useParallelQuiz must be used within ParallelQuizProvider');
  }
  return context;
}