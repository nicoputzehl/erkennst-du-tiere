import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuizManager } from '../hooks/useQuizManager';
import { QuizRegistryProvider } from './QuizRegistryProvider';
import { QuizStateProvider } from './QuizStateProvider';
import { ProgressTrackerProvider } from './ProgressTrackerProvider';
import { UnlockManagerProvider } from './UnlockManagerProvider';
import { AnswerProcessorProvider } from './AnswerProcessorProvider';
import { ActivityIndicator } from 'react-native';

import { initializeAllQuizzes } from '@/src/core/initialization/quizInitialization';
import '@/src/animals/quizzes/animalQuizzes';

const QuizContext = createContext<ReturnType<typeof useQuizManager> | null>(null);

// Der QuizProvider orchestriert die Reihenfolge der anderen Provider
export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    console.log('Initializing quizzes...');
    initializeAllQuizzes();
    setInitialized(true);
    console.log('Quizzes initialized');
  }, []);

  // Wichtig: Zeige einen Loading-Indikator, während die Initialisierung läuft
  if (!initialized) {
    return <ActivityIndicator />;
  }

  return (
    <QuizRegistryProvider>
      <QuizStateProvider>
        <ProgressTrackerProvider>
          <AnswerProcessorProvider>
            <UnlockManagerProvider>
              <QuizProviderInner>{children}</QuizProviderInner>
            </UnlockManagerProvider>
          </AnswerProcessorProvider>
        </ProgressTrackerProvider>
      </QuizStateProvider>
    </QuizRegistryProvider>
  );
}

// Innerer Provider
function QuizProviderInner({ children }: { children: React.ReactNode }) {
  const quizManager = useQuizManager();

  return (
    <QuizContext.Provider value={quizManager}>{children}</QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}