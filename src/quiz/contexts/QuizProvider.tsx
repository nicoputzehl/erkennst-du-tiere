import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuizManager } from '../hooks/useQuizManager';
import { QuizRegistryProvider } from './QuizRegistryProvider';
import { QuizStateProvider } from './QuizStateProvider';
import { ProgressTrackerProvider } from './ProgressTrackerProvider';
import { UnlockManagerProvider } from './UnlockManagerProvider';
import { AnswerProcessorProvider } from './AnswerProcessorProvider';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { initializeAllQuizzes } from '@/src/core/initialization/quizInitialization';
import '@/src/animals/quizzes/animalQuizzes';

const QuizContext = createContext<ReturnType<typeof useQuizManager> | null>(null);

// Der QuizProvider orchestriert die Reihenfolge der anderen Provider
export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    const initialize = async () => {
      setIsInitializing(true);
      try {
        console.log('[QuizProvider] Initializing quizzes...');
        await initializeAllQuizzes();
        setInitialized(true);
        console.log('[QuizProvider] Quizzes initialized');
      } catch (error) {
        console.error('[QuizProvider] Error initializing quizzes:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initialize();
  }, []);

  // Wichtig: Zeige einen Loading-Indikator, während die Initialisierung läuft
  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  if (!initialized) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="small" color="#dc3545" />
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
  },
});