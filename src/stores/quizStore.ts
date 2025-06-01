// src/stores/quizStore.ts - Test-optimierte Version
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Quiz, QuizState } from '@/src/quiz/types';
import { 
  createQuizState, 
  calculateAnswerResult, 
  isCompleted,
  calculateQuizProgress,
  createProgressString,
  getNextActiveQuestionId
} from '@/src/quiz/utils';
import { isAnswerCorrect } from '@/src/quiz/utils/answerComparison';

interface QuizStore {
  // Quiz Content State
  quizzes: Record<string, Quiz>;
  
  // Quiz Runtime State
  quizStates: Record<string, QuizState>;
  currentQuizId: string | null;
  
  // UI State
  isLoading: boolean;
  loadingOperations: Set<string>;
  
  // Quiz Content Actions
  registerQuiz: (quiz: Quiz) => void;
  setCurrentQuiz: (quizId: string | null) => void;
  
  // Quiz State Actions
  initializeQuizState: (quizId: string) => QuizState | null;
  updateQuizState: (quizId: string, newState: QuizState) => void;
  resetQuizState: (quizId: string) => QuizState | null;
  getQuizState: (quizId: string) => QuizState | undefined;
  
  // Answer Processing
  submitAnswer: (quizId: string, questionId: number, answer: string) => {
    isCorrect: boolean;
    newState?: QuizState;
    nextQuestionId?: number;
    wasCompleted?: boolean;
  };
  
  // Progress & Status
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  // Loading State
  setLoading: (operation: string, loading: boolean) => void;
  isOperationLoading: (operation: string) => boolean;
  
  // Selectors
  getAllQuizzes: () => Quiz[];
  getQuizById: (id: string) => Quiz | undefined;
  getCurrentQuiz: () => Quiz | null;
  getCurrentQuizState: () => QuizState | null;
  
  // Statistics
  getCompletedQuizzesCount: () => number;
  getTotalQuestionsCount: () => number;
  getCompletedQuestionsCount: () => number;
  
  // Debug Helper
  getDebugInfo: () => {
    quizzesCount: number;
    statesCount: number;
    currentQuiz: string | null;
    allQuizIds: string[];
    completedQuizzes: number;
    totalQuestions: number;
    completedQuestions: number;
  };
}

// Test Environment Detection
const isTestEnvironment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
const isJestEnvironment = typeof jest !== 'undefined';

// Mock Storage für Tests
const createMockStorage = (): any => {
  let storage: Record<string, string> = {};
  
  return {
    getItem: (key: string): string | null => {
      return storage[key] || null;
    },
    setItem: (key: string, value: string): void => {
      storage[key] = value;
    },
    removeItem: (key: string): void => {
      delete storage[key];
    },
    clear: (): void => {
      storage = {};
    }
  };
};

// Persistence Configuration
const createPersistConfig = (): any => {
  // Für Tests: Mock Storage oder deaktiviert
  if (isTestEnvironment || isJestEnvironment) {
    return {
      name: 'quiz-storage-v3-test',
      storage: createMockStorage(),
      partialize: (state: QuizStore) => ({
        currentQuizId: state.currentQuizId,
        quizStates: state.quizStates
      }),
      version: 1,
      skipHydration: true, // Verhindert automatisches Laden in Tests
    };
  }

  // Für Production/Development: Normale AsyncStorage
  return {
    name: 'quiz-storage-v3',
    partialize: (state: QuizStore) => ({
      currentQuizId: state.currentQuizId,
      quizStates: state.quizStates
    }),
    version: 1,
    migrate: (persistedState: any, version: number) => {
      if (version < 1) {
        return {
          currentQuizId: null,
          quizStates: {}
        };
      }
      return persistedState;
    }
  };
};

// Store Creation
const createStore = () => {
  const baseStore: any = (set: any, get: any): QuizStore => ({
    // Initial State
    quizzes: {},
    quizStates: {},
    currentQuizId: null,
    isLoading: false,
    loadingOperations: new Set<string>(),

    // Quiz Content Actions
    registerQuiz: (quiz: Quiz) => {
      if (__DEV__) {
        console.log('[QuizStore] Registering quiz:', quiz.id);
      }
      set(
        (state: QuizStore) => ({
          quizzes: { ...state.quizzes, [quiz.id]: quiz }
        }),
        false,
        'registerQuiz'
      );
    },

    setCurrentQuiz: (quizId: string | null) => {
      if (__DEV__ && !isTestEnvironment) {
        console.log('[QuizStore] Setting current quiz:', quizId);
      }
      set(
        { currentQuizId: quizId },
        false,
        'setCurrentQuiz'
      );
    },

    // Quiz State Actions
    getQuizState: (quizId: string) => {
      return get().quizStates[quizId];
    },

    initializeQuizState: (quizId: string) => {
      const state = get();
      const quiz = state.quizzes[quizId];
      
      if (!quiz) {
        if (__DEV__ && !isTestEnvironment) {
          console.warn('[QuizStore] Cannot initialize state - quiz not found:', quizId);
        }
        return null;
      }
      
      // Prüfe ob State bereits existiert
      const existingState = state.quizStates[quizId];
      if (existingState) {
        return existingState;
      }
      
      // Erstelle neuen State
      const newQuizState = createQuizState(quiz, { initialUnlockedQuestions: 2 });
      
      set(
        (state: QuizStore) => ({
          quizStates: { ...state.quizStates, [quizId]: newQuizState }
        }),
        false,
        'initializeQuizState'
      );
      
      if (__DEV__ && !isTestEnvironment) {
        console.log('[QuizStore] Initialized quiz state:', quizId, newQuizState);
      }
      
      return newQuizState;
    },

    updateQuizState: (quizId: string, newState: QuizState) => {
      set(
        (state: QuizStore) => ({
          quizStates: { ...state.quizStates, [quizId]: newState }
        }),
        false,
        'updateQuizState'
      );
      
      if (__DEV__ && !isTestEnvironment) {
        console.log('[QuizStore] Updated quiz state:', quizId, newState);
      }
    },

    resetQuizState: (quizId: string) => {
      const state = get();
      const quiz = state.quizzes[quizId];
      
      if (!quiz) {
        if (__DEV__ && !isTestEnvironment) {
          console.warn('[QuizStore] Cannot reset - quiz not found:', quizId);
        }
        return null;
      }
      
      const newState = createQuizState(quiz, { initialUnlockedQuestions: 2 });
      
      set(
        (state: QuizStore) => ({
          quizStates: { ...state.quizStates, [quizId]: newState }
        }),
        false,
        'resetQuizState'
      );
      
      if (__DEV__ && !isTestEnvironment) {
        console.log('[QuizStore] Reset quiz state:', quizId);
      }
      
      return newState;
    },

    // Answer Processing
    submitAnswer: (quizId: string, questionId: number, answer: string) => {
      const state = get();
      const quizState = state.quizStates[quizId];
      
      if (!quizState) {
        if (__DEV__ && !isTestEnvironment) {
          console.warn('[QuizStore] Cannot submit answer - quiz state not found:', quizId);
        }
        return { isCorrect: false };
      }
      
      // Finde die Frage
      const question = quizState.questions.find((q: any) => q.id === questionId);
      if (!question) {
        if (__DEV__ && !isTestEnvironment) {
          console.warn('[QuizStore] Question not found:', questionId);
        }
        return { isCorrect: false };
      }
      
      // Prüfe Antwort
      const isCorrect = isAnswerCorrect(answer, question.answer, question.alternativeAnswers);
      
      if (!isCorrect) {
        return { isCorrect: false };
      }
      
      // Berechne neuen State
      const result = calculateAnswerResult(quizState, questionId, answer);
      
      // Update Store
      get().updateQuizState(quizId, result.newState);
      
      // Berechne nächste Frage
      const nextQuestionId = getNextActiveQuestionId(result.newState);
      
      // Prüfe ob Quiz komplett
      const wasCompleted = isCompleted(result.newState);
      
      if (__DEV__ && !isTestEnvironment) {
        console.log('[QuizStore] Answer submitted:', {
          quizId,
          questionId,
          isCorrect,
          nextQuestionId,
          wasCompleted
        });
      }
      
      return {
        isCorrect: true,
        newState: result.newState,
        nextQuestionId: nextQuestionId || undefined,
        wasCompleted
      };
    },

    // Progress & Status
    getQuizProgress: (quizId: string) => {
      const state = get();
      const quizState = state.quizStates[quizId];
      return quizState ? calculateQuizProgress(quizState) : 0;
    },

    getQuizProgressString: (quizId: string) => {
      const state = get();
      const quizState = state.quizStates[quizId];
      return quizState ? createProgressString(quizState) : null;
    },

    isQuizCompleted: (quizId: string) => {
      const state = get();
      const quizState = state.quizStates[quizId];
      return quizState ? isCompleted(quizState) : false;
    },

    getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => {
      const state = get();
      const quizState = state.quizStates[quizId];
      return quizState ? getNextActiveQuestionId(quizState, currentQuestionId) : null;
    },

    // Loading State
    setLoading: (operation: string, loading: boolean) => {
      set((state: QuizStore) => {
        const newOperations = new Set(state.loadingOperations);
        if (loading) {
          newOperations.add(operation);
        } else {
          newOperations.delete(operation);
        }
        
        return {
          loadingOperations: newOperations,
          isLoading: newOperations.size > 0
        };
      }, false, 'setLoading');
    },

    isOperationLoading: (operation: string) => {
      return get().loadingOperations.has(operation);
    },

    // Selectors
    getAllQuizzes: () => {
      return Object.values(get().quizzes) as Quiz[];
    },

    getQuizById: (id: string) => {
      return get().quizzes[id];
    },

    getCurrentQuiz: () => {
      const state = get();
      return state.currentQuizId ? state.quizzes[state.currentQuizId] || null : null;
    },

    getCurrentQuizState: () => {
      const state = get();
      return state.currentQuizId ? state.quizStates[state.currentQuizId] || null : null;
    },

    // Statistics
    getCompletedQuizzesCount: () => {
      const state = get();
      const quizStates = Object.values(state.quizStates) as QuizState[];
      return quizStates.filter((s: QuizState) => isCompleted(s)).length;
    },

    getTotalQuestionsCount: () => {
      const state = get();
      const quizStates = Object.values(state.quizStates) as QuizState[];
      return quizStates.reduce((sum: number, s: QuizState) => sum + s.questions.length, 0);
    },

    getCompletedQuestionsCount: () => {
      const state = get();
      const quizStates = Object.values(state.quizStates) as QuizState[];
      return quizStates.reduce((sum: number, s: QuizState) => sum + s.completedQuestions, 0);
    },

    // Debug Helper
    getDebugInfo: () => {
      const state = get();
      const allStates = Object.values(state.quizStates) as QuizState[];
      
      return {
        quizzesCount: Object.keys(state.quizzes).length,
        statesCount: Object.keys(state.quizStates).length,
        currentQuiz: state.currentQuizId,
        allQuizIds: Object.keys(state.quizzes),
        completedQuizzes: allStates.filter((s: QuizState) => isCompleted(s)).length,
        totalQuestions: allStates.reduce((sum: number, s: QuizState) => sum + s.questions.length, 0),
        completedQuestions: allStates.reduce((sum: number, s: QuizState) => sum + s.completedQuestions, 0)
      };
    }
  });

  // Conditional Store Creation
  if (isTestEnvironment || isJestEnvironment) {
    // Test Environment: Minimaler Store ohne Persistence/DevTools
    return create<QuizStore>()(baseStore);
  }

  // Production/Development Environment: Full Store
  return create<QuizStore>()(
    devtools(
      persist(baseStore as any, createPersistConfig()),
      {
        name: 'Quiz Store Enhanced',
        trace: __DEV__,
        traceLimit: 25,
        enabled: __DEV__
      }
    )
  );
};

export const useQuizStore = createStore();

// Export der Store-Interfaces
export type { QuizStore };
export type QuizStoreApi = ReturnType<typeof useQuizStore>;