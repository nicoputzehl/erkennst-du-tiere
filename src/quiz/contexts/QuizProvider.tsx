import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentKey } from '@/src/core/content/types';
import { Quiz, QuizState, UnlockCondition, QuizMode } from '../types';
import { initializeAllQuizzes } from '@/src/core/initialization/quizInitialization';
import { Toast, ToastProps } from '../components/Toast';
import { normalizeString } from '@/utils/helper';

// Domain Logic Imports
import { 
  createQuizState, 
  calculateAnswerResult, 
  getNextActiveQuestionId, 
  isCompleted 
} from '../domain/quizLogic';
import { 
  getNextUnlockableQuiz, 
  calculateUnlockProgress 
} from '../domain/unlockLogic';

import '@/src/animals/quizzes';

// =============================================================================
// ZENTRALER APP-STATE - Alles in einem Object!
// =============================================================================

interface AppState {
  // Core Data
  quizzes: Record<string, Quiz>;              // Map → Object
  quizStates: Record<string, QuizState>;      // Map → Object
  
  // UI State  
  currentQuizId: string | null;
  currentQuizState: QuizState<ContentKey> | null;  // FEHLTE!
  isLoading: boolean;
  isInitializing: boolean;
  initialized: boolean;
  
  // Toast State
  toastVisible: boolean;
  toastData: Omit<ToastProps, 'visible' | 'onHide'> | null;
}

const initialAppState: AppState = {
  quizzes: {},
  quizStates: {},
  currentQuizId: null,
  currentQuizState: null,  // FEHLTE!
  isLoading: false,
  isInitializing: true,
  initialized: false,
  toastVisible: false,
  toastData: null,
};

// =============================================================================
// EINFACHE STORAGE-FUNKTIONEN - Direkter AsyncStorage statt Service
// =============================================================================

const STORAGE_KEY = 'quiz_app_state';

// Direkte Storage-Funktionen - keine Service-Layer Komplexität
const saveAppState = async (appState: AppState) => {
  try {
    // Nur relevante Daten speichern
    const persistentData = {
      quizStates: appState.quizStates,
      currentQuizId: appState.currentQuizId,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persistentData));
    console.log('[QuizProvider] App state saved');
  } catch (error) {
    console.error('[QuizProvider] Error saving app state:', error);
  }
};

// Storage komplett leeren
const clearAppState = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('[QuizProvider] App state cleared');
  } catch (error) {
    console.error('[QuizProvider] Error clearing app state:', error);
    throw error;
  }
};

const loadAppState = async (): Promise<Partial<AppState> | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      console.log('[QuizProvider] App state loaded');
      return parsed;
    }
  } catch (error) {
    console.error('[QuizProvider] Error loading app state:', error);
  }
  return null;
};

// =============================================================================
// CONTEXT INTERFACE - Bleibt gleich für API-Kompatibilität  
// =============================================================================

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
  isInitializing: boolean;
  initialized: boolean;
  startQuiz: (quizId: string) => Promise<QuizState | null>;
  loadQuiz: (quizId: string) => Promise<QuizState | null>;
  resetQuiz: (quizId: string) => Promise<QuizState | null>;
  setCurrentQuizId: (id: string | null) => void;
  
  // Toast Integration
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
  
  // Data Management
  clearAllData: () => Promise<void>; // ✅ NEU HINZUGEFÜGT
}

const QuizContext = createContext<QuizContextValue | null>(null);

// =============================================================================
// VEREINFACHTER QUIZ-PROVIDER
// =============================================================================

export function QuizProvider({ children }: { children: ReactNode }) {
  // 🎯 NUR NOCH EIN STATE statt 6+ separate States!
  const [appState, setAppState] = useState<AppState>(initialAppState);
  
  // =============================================================================
  // EINFACHE STATE-UPDATE-FUNKTIONEN
  // =============================================================================
  
  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setAppState(prev => {
      const newState = updater(prev);
      // Auto-save bei jeder State-Änderung
      if (newState.initialized) {
        saveAppState(newState);
      }
      return newState;
    });
  }, []);
  
  // Quiz registrieren - viel einfacher
  const registerQuiz = useCallback(<T extends ContentKey = ContentKey>(
    id: string, 
    quiz: Quiz<T>
  ) => {
    console.log(`[QuizProvider] Registering quiz: ${id}`);
    updateState(prev => ({
      ...prev,
      quizzes: { ...prev.quizzes, [id]: quiz }
    }));
  }, [updateState]);
  
  // =============================================================================
  // EINFACHE QUIZ-FUNKTIONEN
  // =============================================================================
  
  const getQuizById = useCallback(<T extends ContentKey = ContentKey>(id: string): Quiz<T> | undefined => {
    return appState.quizzes[id] as Quiz<T> | undefined;
  }, [appState.quizzes]);

  const getAllQuizzes = useCallback(<T extends ContentKey = ContentKey>(): Quiz<T>[] => {
    const allQuizzes = Object.values(appState.quizzes) as Quiz<T>[];
    console.log(`[QuizProvider] getAllQuizzes called, returning ${allQuizzes.length} quizzes`);
    return allQuizzes;
  }, [appState.quizzes]);

  const getQuizState = useCallback(<T extends ContentKey = ContentKey>(quizId: string): QuizState<T> | undefined => {
    return appState.quizStates[quizId] as QuizState<T> | undefined;
  }, [appState.quizStates]);

  // =============================================================================
  // VEREINFACHTE QUIZ-STATE-MANAGEMENT
  // =============================================================================
  
  const initializeQuizState = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string
  ): Promise<QuizState<T> | null> => {
    const quiz = getQuizById(quizId);
    if (!quiz) return null;

    // Schon initialisiert?
    const existingState = appState.quizStates[quizId];
    if (existingState) {
      return existingState as QuizState<T>;
    }

    // Neuen State erstellen
    const newState = createQuizState(
      quiz.questions,
      quiz.id,
      quiz.title,
      quiz.quizMode || QuizMode.SEQUENTIAL,
      quiz.initialUnlockedQuestions || 2
    );

    // State updaten - synchron!
    updateState(prev => ({
      ...prev,
      quizStates: { ...prev.quizStates, [quizId]: newState }
    }));

    return newState as QuizState<T>;
  }, [getQuizById, appState.quizStates, updateState]);

  const updateQuizState = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string, 
    newState: QuizState<T>
  ): Promise<void> => {
    updateState(prev => ({
      ...prev,
      quizStates: { ...prev.quizStates, [quizId]: newState }
    }));
  }, [updateState]);

  const resetQuizState = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string
  ): Promise<QuizState<T> | null> => {
    const quiz = getQuizById(quizId);
    if (!quiz) return null;

    const newState = createQuizState(
      quiz.questions,
      quiz.id,
      quiz.title,
      quiz.quizMode || QuizMode.SEQUENTIAL,
      quiz.initialUnlockedQuestions || 2
    );

    updateState(prev => ({
      ...prev,
      quizStates: { ...prev.quizStates, [quizId]: newState }
    }));

    return newState as QuizState<T>;
  }, [getQuizById, updateState]);

  // =============================================================================
  // PROGRESS-FUNKTIONEN - Vereinfacht
  // =============================================================================
  
  const getQuizProgress = useCallback((quizId: string): number => {
    const state = appState.quizStates[quizId];
    if (!state || !state.questions?.length) return 0;
    return (state.completedQuestions / state.questions.length) * 100;
  }, [appState.quizStates]);

  const getQuizProgressString = useCallback((quizId: string): string | null => {
    const state = appState.quizStates[quizId];
    if (!state || !state.questions?.length) return null;
    return `${state.completedQuestions} von ${state.questions.length} gelöst`;
  }, [appState.quizStates]);

  const isQuizCompleted = useCallback((quizId: string): boolean => {
    const state = appState.quizStates[quizId];
    return state ? isCompleted(state) : false;
  }, [appState.quizStates]);

  const getNextActiveQuestion = useCallback((quizId: string, currentQuestionId?: number): number | null => {
    const state = appState.quizStates[quizId];
    return state ? getNextActiveQuestionId(state, currentQuestionId) : null;
  }, [appState.quizStates]);

  // =============================================================================
  // TOAST-FUNKTIONEN - Vereinfacht (FRÜHER DEFINIERT)
  // =============================================================================
  
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration?: number) => {
    updateState(prev => ({
      ...prev,
      toastVisible: true,
      toastData: { message, type, duration }
    }));
  }, [updateState]);

  const hideToast = useCallback(() => {
    updateState(prev => ({
      ...prev,
      toastVisible: false,
      toastData: null
    }));
  }, [updateState]);

  const showSuccessToast = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showErrorToast = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showInfoToast = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const showWarningToast = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  // =============================================================================
  // UNLOCK-MANAGEMENT - Vereinfacht (JETZT NACH TOAST-FUNKTIONEN)
  // =============================================================================
  
  const getUnlockProgress = useCallback((quizId: string) => {
    const quiz = appState.quizzes[quizId];
    if (!quiz || !quiz.unlockCondition) {
      return { condition: null, progress: 0, isMet: true };
    }

    const allQuizzes = Object.values(appState.quizzes);
    const quizStatesMap = new Map(Object.entries(appState.quizStates));
    const { isMet, progress } = calculateUnlockProgress(quiz.unlockCondition, allQuizzes, quizStatesMap);

    return { condition: quiz.unlockCondition, progress, isMet };
  }, [appState.quizzes, appState.quizStates]);

  const checkForUnlocks = useCallback((): Quiz[] => {
    const allQuizzes = Object.values(appState.quizzes);
    const quizStatesMap = new Map(Object.entries(appState.quizStates));
    const unlockedQuizzes: Quiz[] = [];
    
    let nextUnlockable = getNextUnlockableQuiz(allQuizzes, quizStatesMap);
    while (nextUnlockable) {
      const updatedQuiz = { ...nextUnlockable, initiallyLocked: false };
      
      // Quiz freischalten
      updateState(prev => ({
        ...prev,
        quizzes: { ...prev.quizzes, [nextUnlockable!.id]: updatedQuiz }
      }));
      
      unlockedQuizzes.push(updatedQuiz);
      
      // 🎉 TOAST FÜR FREIGESCHALTETES QUIZ ANZEIGEN (JETZT VERFÜGBAR!)
      showSuccessToast(
        `🎉 Neues Quiz "${updatedQuiz.title}" wurde freigeschaltet!`,
        4000
      );
      
      nextUnlockable = getNextUnlockableQuiz(Object.values(appState.quizzes), quizStatesMap);
    }
    
    return unlockedQuizzes;
  }, [appState.quizzes, appState.quizStates, updateState, showSuccessToast]);

  // =============================================================================
  // ANSWER-PROCESSING - Vereinfacht
  // =============================================================================
  
  const answerQuizQuestion = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string,
    questionId: number,
    answer: string
  ): Promise<{
    isCorrect: boolean;
    newState?: QuizState<T>;
    nextQuestionId?: number;
    unlockedQuiz?: Quiz;
  }> => {
    const currentState = appState.quizStates[quizId] as QuizState<T>;
    if (!currentState) {
      throw new Error(`Quiz with ID ${quizId} not found`);
    }

    const processedAnswer = normalizeString(answer);
    const result = calculateAnswerResult(currentState, questionId, processedAnswer);

    if (result.isCorrect) {
      // State updaten
      updateState(prev => ({
        ...prev,
        quizStates: { ...prev.quizStates, [quizId]: result.newState }
      }));
      
      const nextQuestionId = getNextActiveQuestionId(result.newState);
      const unlockedQuizzes = checkForUnlocks();

      return {
        isCorrect: true,
        newState: result.newState,
        nextQuestionId: nextQuestionId || undefined,
        unlockedQuiz: unlockedQuizzes[0] || undefined
      };
    }

    return { isCorrect: false };
  }, [appState.quizStates, updateState, checkForUnlocks]);



  // =============================================================================
  // QUIZ-MANAGER-FUNKTIONEN - Vereinfacht
  // =============================================================================
  
  const startQuiz = useCallback(async (quizId: string) => {
    updateState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const quiz = await initializeQuizState(quizId);
      if (quiz) {
        updateState(prev => ({
          ...prev,
          currentQuizId: quizId,
          currentQuizState: quiz,
          isLoading: false
        }));
      }
      return quiz;
    } catch (error) {
      showErrorToast(`Fehler beim Starten des Quiz: ${error}`);
      updateState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, [initializeQuizState, showErrorToast, updateState]);

  const loadQuiz = useCallback(async (quizId: string) => {
    return startQuiz(quizId); // Gleiche Logik
  }, [startQuiz]);

  const resetQuiz = useCallback(async (quizId: string) => {
    updateState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const newState = await resetQuizState(quizId);
      if (newState && quizId === appState.currentQuizId) {
        updateState(prev => ({
          ...prev,
          currentQuizState: newState,
          isLoading: false
        }));
      }
      checkForUnlocks();
      return newState;
    } catch (error) {
      showErrorToast(`Fehler beim Zurücksetzen des Quiz: ${error}`);
      updateState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, [resetQuizState, appState.currentQuizId, checkForUnlocks, showErrorToast, updateState]);

  const setCurrentQuizId = useCallback((id: string | null) => {
    updateState(prev => ({ ...prev, currentQuizId: id }));
  }, [updateState]);

  // =============================================================================
  // ALLE DATEN ZURÜCKSETZEN - Für SettingsScreen
  // =============================================================================
  
  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      // Storage leeren
      await clearAppState();
      
      // AppState zurücksetzen auf Initial-Zustand (aber Quizzes behalten)
      updateState(prev => ({
        ...initialAppState,
        quizzes: prev.quizzes, // Behalte geladene Quiz-Definitionen
        initialized: true,
        isInitializing: false,
      }));
      
      console.log('[QuizProvider] All data cleared successfully');
    } catch (error) {
      console.error('[QuizProvider] Error clearing all data:', error);
      throw error;
    }
  }, [updateState]);

  // =============================================================================
  // INITIALIZATION - Vereinfacht
  // =============================================================================
  
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('[QuizProvider] Initializing...');
        
        // Registriere globale Funktion
        (globalThis as any).registerQuizInProvider = registerQuiz;
        
        // Lade gespeicherten State
        const savedState = await loadAppState();
        if (savedState) {
          updateState(prev => ({ ...prev, ...savedState }));
        }
        
        // Initialisiere Quizzes
        await initializeAllQuizzes();
        
        updateState(prev => ({
          ...prev,
          initialized: true,
          isInitializing: false
        }));
        
        console.log('[QuizProvider] Initialization complete');
      } catch (error) {
        console.error('[QuizProvider] Initialization error:', error);
        updateState(prev => ({
          ...prev,
          isInitializing: false
        }));
      }
    };
    
    initialize();
    
    return () => {
      delete (globalThis as any).registerQuizInProvider;
    };
  }, [registerQuiz, updateState]);

  // =============================================================================
  // RENDER
  // =============================================================================
  
  if (appState.isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  if (!appState.initialized) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="small" color="#dc3545" />
      </View>
    );
  }

  const contextValue: QuizContextValue = {
    // Quiz Registry
    getQuizById,
    getAllQuizzes,
    
    // Quiz State Management
    getQuizState,
    initializeQuizState,
    updateQuizState,
    resetQuizState,
    
    // Progress Tracking
    getQuizProgress,
    getQuizProgressString,
    isQuizCompleted,
    getNextActiveQuestion,
    
    // Answer Processing
    answerQuizQuestion,
    
    // Unlock Management
    getUnlockProgress,
    checkForUnlocks,
    
    // Quiz Manager
    currentQuizId: appState.currentQuizId,
    currentQuizState: appState.currentQuizState,
    isLoading: appState.isLoading,
    isInitializing: appState.isInitializing,
    initialized: appState.initialized,
    startQuiz,
    loadQuiz,
    resetQuiz,
    setCurrentQuizId,
    
    // Toast Integration
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    
    // Data Management
    clearAllData, // ✅ NEU HINZUGEFÜGT
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
      {appState.toastData && (
        <Toast
          visible={appState.toastVisible}
          onHide={hideToast}
          {...appState.toastData}
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
