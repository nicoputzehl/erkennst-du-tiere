// src/quiz/contexts/QuizProvider.tsx - Vollständige Implementation
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ContentKey } from '@/src/core/content/types';
import { Quiz, QuizState, UnlockCondition } from '../types';
import { initializeAllQuizzes } from '@/src/core/initialization/quizInitialization';
import { Toast, ToastProps } from '../components/Toast';

// Import aller bestehenden Services - werden schrittweise ersetzt
import { getQuizRegistryService } from '../services/quizRegistry';
import { getQuizStateManagerService } from '../services/quizStateManager';
import { getProgressTrackerService } from '../services/progressTracker';
import { getAnswerProcessorService } from '../services/answerProcessor';
import { getUnlockManagerService } from '../services/unlockManager';

import '@/src/animals/quizzes/animalQuizzes';

type ToastData = Omit<ToastProps, 'visible' | 'onHide'>;

interface QuizContextValue {
  // Quiz Registry
  getQuizById: <T extends ContentKey = ContentKey>(id: string) => Quiz<T> | undefined;
  getAllQuizzes: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  
  // Quiz State Management
  getQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | undefined;
  initializeQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  updateQuizState: <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>) => Promise<void>;
  resetQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  
  // Progress Tracking
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  // Answer Processing
  answerQuizQuestion: <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string
  ) => Promise<{
    isCorrect: boolean;
    newState?: QuizState<T>;
    nextQuestionId?: number;
    unlockedQuiz?: Quiz;
  }>;
  
  // Unlock Management
  getUnlockProgress: (quizId: string) => {
    condition: UnlockCondition | null;
    progress: number;
    isMet: boolean;
  };
  checkForUnlocks: () => Quiz[];
  
  // Quiz Manager
  currentQuizId: string | null;
  currentQuizState: QuizState<ContentKey> | null;
  isLoading: boolean;
  startQuiz: (quizId: string) => Promise<QuizState | null>;
  loadQuiz: (quizId: string) => Promise<QuizState | null>;
  resetQuiz: (quizId: string) => Promise<QuizState | null>;
  setCurrentQuizId: (id: string | null) => void;
  
  // Toast Integration
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Quiz Manager State
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [currentQuizState, setCurrentQuizState] = useState<QuizState<ContentKey> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast State
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  
  // Service Instances (werden später durch direkte Implementierungen ersetzt)
  const quizRegistryService = getQuizRegistryService();
  const quizStateManagerService = getQuizStateManagerService();
  const progressTrackerService = getProgressTrackerService();
  const answerProcessorService = getAnswerProcessorService();
  const unlockManagerService = getUnlockManagerService();
  
  useEffect(() => {
    const initialize = async () => {
      setIsInitializing(true);
      try {
        console.log('[QuizProvider] Initializing quizzes...');
        await initializeAllQuizzes();
        setInitialized(true);
        console.log('[QuizProvider] Quizzes initialized successfully');
      } catch (error) {
        console.error('[QuizProvider] Error initializing quizzes:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initialize();
  }, []);

  // Toast Functions
  const showToast = useCallback((data: ToastData) => {
    setToastData(data);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
    setTimeout(() => {
      setToastData(null);
    }, 300);
  }, []);

  const showSuccessToast = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'success', duration });
  }, [showToast]);

  const showErrorToast = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'error', duration });
  }, [showToast]);

  const showInfoToast = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'info', duration });
  }, [showToast]);

  const showWarningToast = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'warning', duration });
  }, [showToast]);

  // Quiz Manager Functions
  const startQuiz = useCallback(async (quizId: string) => {
    setIsLoading(true);
    try {
      const quiz = await quizStateManagerService.initializeQuizState(quizId);
      if (quiz) {
        setCurrentQuizId(quizId);
        setCurrentQuizState(quiz);
      }
      return quiz;
    } catch (error) {
      console.error(`[QuizProvider] Error starting quiz ${quizId}:`, error);
      showErrorToast(`Fehler beim Starten des Quiz: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [quizStateManagerService, showErrorToast]);

  const loadQuiz = useCallback(async (quizId: string) => {
    setIsLoading(true);
    try {
      const quiz = await quizStateManagerService.initializeQuizState(quizId);
      if (quiz) {
        setCurrentQuizId(quizId);
        setCurrentQuizState(quiz);
      }
      return quiz;
    } catch (error) {
      console.error(`[QuizProvider] Error loading quiz ${quizId}:`, error);
      showErrorToast(`Fehler beim Laden des Quiz: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [quizStateManagerService, showErrorToast]);

  const resetQuiz = useCallback(async (quizId: string) => {
    setIsLoading(true);
    try {
      const newState = await quizStateManagerService.resetQuizState(quizId);
      if (newState && quizId === currentQuizId) {
        setCurrentQuizState(newState);
      }
      
      // Check for unlocks
      unlockManagerService.checkForUnlocks();
      
      return newState;
    } catch (error) {
      console.error(`[QuizProvider] Error resetting quiz ${quizId}:`, error);
      showErrorToast(`Fehler beim Zurücksetzen des Quiz: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [quizStateManagerService, unlockManagerService, currentQuizId, showErrorToast]);

  // Setup unlock listener
  useEffect(() => {
    const unlockHandler = (unlockedQuiz: Quiz) => {
      showSuccessToast(
        `🎉 Neues Quiz "${unlockedQuiz.title}" wurde freigeschaltet!`,
        4000
      );
    };
    
    unlockManagerService.addUnlockListener(unlockHandler);
    
    return () => {
      unlockManagerService.removeUnlockListener(unlockHandler);
    };
  }, [unlockManagerService, showSuccessToast]);

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

  const contextValue: QuizContextValue = {
    // Quiz Registry
    getQuizById: quizRegistryService.getQuizById,
    getAllQuizzes: quizRegistryService.getAllQuizzes,
    
    // Quiz State Management
    getQuizState: quizStateManagerService.getQuizState,
    initializeQuizState: quizStateManagerService.initializeQuizState,
    updateQuizState: quizStateManagerService.updateQuizState,
    resetQuizState: quizStateManagerService.resetQuizState,
    
    // Progress Tracking
    getQuizProgress: progressTrackerService.getQuizProgress,
    getQuizProgressString: progressTrackerService.getQuizProgressString,
    isQuizCompleted: progressTrackerService.isQuizCompleted,
    getNextActiveQuestion: progressTrackerService.getNextActiveQuestion,
    
    // Answer Processing
    answerQuizQuestion: answerProcessorService.answerQuizQuestion,
    
    // Unlock Management
    getUnlockProgress: unlockManagerService.getUnlockProgress,
    checkForUnlocks: unlockManagerService.checkForUnlocks,
    
    // Quiz Manager
    currentQuizId,
    currentQuizState,
    isLoading,
    startQuiz,
    loadQuiz,
    resetQuiz,
    setCurrentQuizId,
    
    // Toast Integration
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
      {toastData && (
        <Toast
          visible={toastVisible}
          onHide={hideToast}
          {...toastData}
        />
      )}
    </QuizContext.Provider>
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