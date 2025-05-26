// src/quiz/contexts/QuizProvider.tsx - Ohne Service-Layer
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ContentKey } from '@/src/core/content/types';
import { Quiz, QuizState, UnlockCondition, QuizMode } from '../types';
import { initializeAllQuizzes } from '@/src/core/initialization/quizInitialization';
import { Toast, ToastProps } from '../components/Toast';
import { getStorageService } from '@/src/core/storage';
import { normalizeString } from '@/utils/helper';

// Domain Logic Imports (die behalten wir)
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
  isInitializing: boolean; // Neu hinzugefügt
  initialized: boolean;    // Neu hinzugefügt
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
  
  // Direkte State-Verwaltung statt Services
  const [quizzes, setQuizzes] = useState<Map<string, Quiz>>(new Map());
  const [quizStates, setQuizStates] = useState<Map<string, QuizState>>(new Map());
  const [unlockListeners, setUnlockListeners] = useState<((quiz: Quiz) => void)[]>([]);
  
  // Quiz Manager State
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [currentQuizState, setCurrentQuizState] = useState<QuizState<ContentKey> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast State
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  
  const storage = getStorageService();

  // Persistence-Funktionen außerhalb von useEffect definieren
  const loadSavedQuizStates = useCallback(async () => {
    try {
      const savedStates = await storage.load<Record<string, any>>('quiz_states');
      if (savedStates) {
        console.log(`[QuizProvider] Found saved states for:`, Object.keys(savedStates));
        // Wir speichern die saved states nicht direkt, sondern verwenden sie nur beim initializeQuizState
        console.log(`[QuizProvider] Loaded ${Object.keys(savedStates).length} saved quiz states`);
      }
    } catch (error) {
      console.error('[QuizProvider] Error loading saved states:', error);
    }
  }, [storage]);

  const saveQuizState = useCallback(async <T extends ContentKey = ContentKey>(quizState: QuizState<T>) => {
    try {
      const allStates = await storage.load<Record<string, any>>('quiz_states') || {};
      allStates[quizState.id] = {
        id: quizState.id,
        completedQuestions: quizState.completedQuestions,
        questionStatuses: quizState.questions.map(q => ({
          id: q.id,
          status: q.status
        }))
      };
      await storage.save('quiz_states', allStates);
      console.log(`[QuizProvider] Saved state for quiz: ${quizState.id}`);
    } catch (error) {
      console.error(`[QuizProvider] Error saving quiz state ${quizState.id}:`, error);
    }
  }, [storage]);

  // Direkte Implementierungen statt Service-Delegation

  // === QUIZ REGISTRY ===
  const registerQuiz = useCallback(<T extends ContentKey = ContentKey>(
    id: string, 
    quiz: Quiz<T>
  ) => {
    console.log(`[QuizProvider] Registering quiz: ${id}`);
    setQuizzes(prev => new Map(prev).set(id, quiz));
  }, []);

  const getQuizById = useCallback(<T extends ContentKey = ContentKey>(id: string): Quiz<T> | undefined => {
    return quizzes.get(id) as Quiz<T> | undefined;
  }, [quizzes]);

  const getAllQuizzes = useCallback(<T extends ContentKey = ContentKey>(): Quiz<T>[] => {
    const allQuizzes = Array.from(quizzes.values()) as Quiz<T>[];
    console.log(`[QuizProvider] getAllQuizzes called, returning ${allQuizzes.length} quizzes`);
    return allQuizzes;
  }, [quizzes]);

  useEffect(() => {
    const initialize = async () => {
      setIsInitializing(true);
      try {
        console.log('[QuizProvider] Initializing quizzes...');
        
        // Registriere die globale Funktion BEVOR wir die Initialisierung starten
        (globalThis as any).registerQuizInProvider = registerQuiz;
        
        await initializeAllQuizzes();
        
        // Lade gespeicherte Quiz-Zustände
        await loadSavedQuizStates();
        
        setInitialized(true);
        console.log('[QuizProvider] Quizzes initialized successfully');
        console.log(`[QuizProvider] Total registered quizzes: ${quizzes.size}`);
      } catch (error) {
        console.error('[QuizProvider] Error initializing quizzes:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initialize();
    
    return () => {
      // Cleanup
      delete (globalThis as any).registerQuizInProvider;
    };
  }, [loadSavedQuizStates, registerQuiz, quizzes.size]);

  // === QUIZ STATE MANAGEMENT ===
  const getQuizState = useCallback(<T extends ContentKey = ContentKey>(quizId: string): QuizState<T> | undefined => {
    console.log(`[QuizProvider] Getting quiz state for: ${quizId}`);
    const state = quizStates.get(quizId) as QuizState<T> | undefined;
    console.log(`[QuizProvider] Found state for ${quizId}:`, state ? {
      id: state.id,
      questionsCount: state.questions?.length,
      completedQuestions: state.completedQuestions
    } : 'undefined');
    return state;
  }, [quizStates]);

  const applyPersistentStateToQuiz = useCallback(<T extends ContentKey = ContentKey>(
    quiz: Quiz<T>, 
    persistentState: any
  ): QuizState<T> => {
    console.log(`[QuizProvider] Applying persistent state for quiz ${quiz.id}`, persistentState);
    
    const baseState = createQuizState(
      quiz.questions,
      quiz.id,
      quiz.title,
      quiz.quizMode || QuizMode.SEQUENTIAL,
      quiz.initialUnlockedQuestions || 2
    );

    if (!persistentState) {
      console.log(`[QuizProvider] No persistent state, returning fresh state for ${quiz.id}`);
      return baseState;
    }

    // Apply saved question statuses
    const updatedQuestions = baseState.questions.map(question => {
      const savedStatus = persistentState.questionStatuses?.find((qs: any) => qs.id === question.id);
      if (savedStatus) {
        return {
          ...question,
          status: savedStatus.status
        };
      }
      return question;
    });

    const finalState = {
      ...baseState,
      questions: updatedQuestions,
      completedQuestions: persistentState.completedQuestions || 0
    };

    console.log(`[QuizProvider] Applied persistent state for ${quiz.id}:`, {
      id: finalState.id,
      questionsCount: finalState.questions.length,
      completedQuestions: finalState.completedQuestions
    });

    return finalState;
  }, []);

  const initializeQuizState = useCallback(async <T extends ContentKey = ContentKey>(quizId: string): Promise<QuizState<T> | null> => {
    console.log(`[QuizProvider] Initializing state for quiz: ${quizId}`);
    const quiz = getQuizById(quizId);
    if (!quiz) {
      console.log(`[QuizProvider] Quiz not found: ${quizId}`);
      return null;
    }

    console.log(`[QuizProvider] Found quiz definition for ${quizId}:`, quiz);

    if (!quizStates.has(quizId)) {
      try {
        // Try to load saved state first
        const savedStates = await storage.load<Record<string, any>>('quiz_states');
        const savedState = savedStates?.[quizId];
        
        console.log(`[QuizProvider] Saved state for ${quizId}:`, savedState);
        
        const state = applyPersistentStateToQuiz(quiz, savedState);
        
        console.log(`[QuizProvider] Created state for ${quizId}:`, {
          id: state.id,
          title: state.title,
          questionsCount: state.questions?.length,
          completedQuestions: state.completedQuestions
        });
        
        setQuizStates(prev => {
          const newMap = new Map(prev);
          newMap.set(quizId, state);
          console.log(`[QuizProvider] Updated quizStates map, now has ${newMap.size} entries`);
          return newMap;
        });
        
        // Return the state immediately since setQuizStates is async
        return state as QuizState<T>;
        
      } catch (error) {
        console.error(`[QuizProvider] Error loading saved state for ${quizId}:`, error);
        // Fallback to fresh state
        const state = createQuizState(
          quiz.questions,
          quiz.id,
          quiz.title,
          quiz.quizMode || QuizMode.SEQUENTIAL,
          quiz.initialUnlockedQuestions || 2
        );
        
        setQuizStates(prev => {
          const newMap = new Map(prev);
          newMap.set(quizId, state);
          return newMap;
        });
        
        return state as QuizState<T>;
      }
    } else {
      console.log(`[QuizProvider] Using existing state for quiz: ${quizId}`);
      const existingState = quizStates.get(quizId) as QuizState<T>;
      console.log(`[QuizProvider] Existing state:`, {
        id: existingState?.id,
        questionsCount: existingState?.questions?.length,
        completedQuestions: existingState?.completedQuestions
      });
      return existingState;
    }
  }, [getQuizById, storage, applyPersistentStateToQuiz, quizStates]);

  const updateQuizState = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string, 
    newState: QuizState<T>
  ): Promise<void> => {
    console.log(`[QuizProvider] Updating state for quiz: ${quizId}`);
    setQuizStates(prev => new Map(prev).set(quizId, newState));
    await saveQuizState(newState);
  }, [saveQuizState]);

  const resetQuizState = useCallback(async <T extends ContentKey = ContentKey>(quizId: string): Promise<QuizState<T> | null> => {
    console.log(`[QuizProvider] Resetting state for quiz: ${quizId}`);
    const quiz = getQuizById(quizId);
    if (!quiz) return null;

    const newState = createQuizState(
      quiz.questions,
      quiz.id,
      quiz.title,
      quiz.quizMode || QuizMode.SEQUENTIAL,
      quiz.initialUnlockedQuestions || 2
    );

    setQuizStates(prev => new Map(prev).set(quizId, newState));
    await saveQuizState(newState);
    
    return newState as QuizState<T>;
  }, [getQuizById, saveQuizState]);

  // === PROGRESS TRACKING ===
  const getQuizProgress = useCallback((quizId: string): number => {
    console.log(`[QuizProvider] Getting progress for quiz: ${quizId}`);
    let state = getQuizState(quizId);
    
    // Falls State nicht existiert, versuche ihn zu erstellen
    if (!state) {
      console.log(`[QuizProvider] No state found for quiz ${quizId}, trying to create it...`);
      const quiz = getQuizById(quizId);
      if (quiz) {
        state = createQuizState(
          quiz.questions,
          quiz.id,
          quiz.title,
          quiz.quizMode || QuizMode.SEQUENTIAL,
          quiz.initialUnlockedQuestions || 2
        );
        setQuizStates(prev => new Map(prev).set(quizId, state!));
        console.log(`[QuizProvider] Created fresh state for quiz ${quizId}`);
      } else {
        console.error(`[QuizProvider] Quiz definition not found for ${quizId}`);
        return 0;
      }
    }
    
    // ZUSÄTZLICHE PRÜFUNG: Wenn questions undefined ist, state neu erstellen
    if (!state.questions || !Array.isArray(state.questions)) {
      console.warn(`[QuizProvider] Quiz ${quizId} has invalid questions, recreating state...`);
      const quiz = getQuizById(quizId);
      if (quiz) {
        state = createQuizState(
          quiz.questions,
          quiz.id,
          quiz.title,
          quiz.quizMode || QuizMode.SEQUENTIAL,
          quiz.initialUnlockedQuestions || 2
        );
        setQuizStates(prev => new Map(prev).set(quizId, state!));
        console.log(`[QuizProvider] Recreated fresh state for quiz ${quizId}`);
      } else {
        console.error(`[QuizProvider] Quiz definition not found for ${quizId}`);
        return 0;
      }
    }
    
    const progress = (state.completedQuestions / state.questions.length) * 100;
    console.log(`[QuizProvider] Quiz ${quizId} progress: ${state.completedQuestions}/${state.questions.length} = ${progress}%`);
    return progress;
  }, [getQuizState, getQuizById]);

  const getQuizProgressString = useCallback((quizId: string): string | null => {
    console.log(`[QuizProvider] Getting progress string for quiz: ${quizId}`);
    let state = getQuizState(quizId);
    
    // Falls State nicht existiert, versuche ihn zu erstellen
    if (!state) {
      console.log(`[QuizProvider] No state found for quiz ${quizId}, trying to create it...`);
      const quiz = getQuizById(quizId);
      if (quiz) {
        state = createQuizState(
          quiz.questions,
          quiz.id,
          quiz.title,
          quiz.quizMode || QuizMode.SEQUENTIAL,
          quiz.initialUnlockedQuestions || 2
        );
        setQuizStates(prev => new Map(prev).set(quizId, state!));
        console.log(`[QuizProvider] Created fresh state for quiz ${quizId}`);
      } else {
        console.error(`[QuizProvider] Quiz definition not found for ${quizId}`);
        return null;
      }
    }
    
    // ZUSÄTZLICHE PRÜFUNG: Wenn questions undefined ist, state neu erstellen
    if (!state.questions || !Array.isArray(state.questions)) {
      console.warn(`[QuizProvider] Quiz ${quizId} has invalid questions, recreating state...`);
      const quiz = getQuizById(quizId);
      if (quiz) {
        state = createQuizState(
          quiz.questions,
          quiz.id,
          quiz.title,
          quiz.quizMode || QuizMode.SEQUENTIAL,
          quiz.initialUnlockedQuestions || 2
        );
        setQuizStates(prev => new Map(prev).set(quizId, state!));
        console.log(`[QuizProvider] Recreated fresh state for quiz ${quizId}`);
      } else {
        console.error(`[QuizProvider] Quiz definition not found for ${quizId}`);
        return null;
      }
    }
    
    const progressString = `${state.completedQuestions} von ${state.questions.length} gelöst`;
    console.log(`[QuizProvider] Quiz ${quizId} progress string: ${progressString}`);
    return progressString;
  }, [getQuizState, getQuizById]);

  const isQuizCompleted = useCallback((quizId: string): boolean => {
    const state = getQuizState(quizId);
    return state ? isCompleted(state) : false;
  }, [getQuizState]);

  const getNextActiveQuestion = useCallback((quizId: string, currentQuestionId?: number): number | null => {
    const state = getQuizState(quizId);
    return state ? getNextActiveQuestionId(state, currentQuestionId) : null;
  }, [getQuizState]);

  // === UNLOCK MANAGEMENT ===
  const getUnlockProgress = useCallback((quizId: string) => {
    const quiz = getQuizById(quizId);
    if (!quiz || !quiz.unlockCondition) {
      return { condition: null, progress: 0, isMet: true };
    }

    const allQuizzes = getAllQuizzes();
    const { isMet, progress } = calculateUnlockProgress(
      quiz.unlockCondition,
      allQuizzes,
      quizStates
    );

    return {
      condition: quiz.unlockCondition,
      progress,
      isMet
    };
  }, [getQuizById, getAllQuizzes, quizStates]);

  const unlockNextQuiz = useCallback((): Quiz | null => {
    const allQuizzes = getAllQuizzes();
    const nextUnlockable = getNextUnlockableQuiz(allQuizzes, quizStates);

    if (nextUnlockable) {
      const updatedQuiz = { ...nextUnlockable, initiallyLocked: false };
      setQuizzes(prev => new Map(prev).set(nextUnlockable.id, updatedQuiz));
      
      // Notify listeners
      unlockListeners.forEach(listener => listener(updatedQuiz));
      
      return updatedQuiz;
    }

    return null;
  }, [getAllQuizzes, quizStates, unlockListeners]);

  const checkForUnlocks = useCallback((): Quiz[] => {
    const unlockedQuizzes: Quiz[] = [];
    let nextUnlockable = unlockNextQuiz();
    
    while (nextUnlockable) {
      unlockedQuizzes.push(nextUnlockable);
      nextUnlockable = unlockNextQuiz();
    }
    
    return unlockedQuizzes;
  }, [unlockNextQuiz]);

  // === ANSWER PROCESSING ===
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
    console.log(`[QuizProvider] Processing answer for quiz ${quizId}, question ${questionId}`);
    const currentState = getQuizState<T>(quizId);

    if (!currentState) {
      throw new Error(`Quiz with ID ${quizId} not found`);
    }

    const processedAnswer = normalizeString(answer);
    const result = calculateAnswerResult(currentState, questionId, processedAnswer);

    if (result.isCorrect) {
      await updateQuizState(quizId, result.newState);
      const nextQuestionId = getNextActiveQuestionId(result.newState);
      const unlockedQuiz = unlockNextQuiz();

      return {
        isCorrect: true,
        newState: result.newState,
        nextQuestionId: nextQuestionId || undefined,
        unlockedQuiz: unlockedQuiz || undefined
      };
    }

    return { isCorrect: false };
  }, [getQuizState, updateQuizState, unlockNextQuiz]);

  // === TOAST FUNCTIONS ===
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

  // === QUIZ MANAGER ===
  const startQuiz = useCallback(async (quizId: string) => {
    setIsLoading(true);
    try {
      const quiz = await initializeQuizState(quizId);
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
  }, [initializeQuizState, showErrorToast]);

  const loadQuiz = useCallback(async (quizId: string) => {
    setIsLoading(true);
    try {
      const quiz = await initializeQuizState(quizId);
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
  }, [initializeQuizState, showErrorToast]);

  const resetQuiz = useCallback(async (quizId: string) => {
    setIsLoading(true);
    try {
      const newState = await resetQuizState(quizId);
      if (newState && quizId === currentQuizId) {
        setCurrentQuizState(newState);
      }
      
      checkForUnlocks();
      
      return newState;
    } catch (error) {
      console.error(`[QuizProvider] Error resetting quiz ${quizId}:`, error);
      showErrorToast(`Fehler beim Zurücksetzen des Quiz: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [resetQuizState, currentQuizId, checkForUnlocks, showErrorToast]);

  // Setup unlock listener für Toasts
  useEffect(() => {
    const unlockHandler = (unlockedQuiz: Quiz) => {
      showSuccessToast(
        `🎉 Neues Quiz "${unlockedQuiz.title}" wurde freigeschaltet!`,
        4000
      );
    };
    
    setUnlockListeners(prev => [...prev, unlockHandler]);
    
    return () => {
      setUnlockListeners(prev => prev.filter(l => l !== unlockHandler));
    };
  }, [showSuccessToast]);

  // Expose registerQuiz for initialization - entfernt da jetzt im useEffect
  // useEffect(() => {
  //   (globalThis as any).registerQuizInProvider = registerQuiz;
  //   return () => {
  //     delete (globalThis as any).registerQuizInProvider;
  //   };
  // }, [registerQuiz]);

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
    currentQuizId,
    currentQuizState,
    isLoading,
    isInitializing,
    initialized,
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