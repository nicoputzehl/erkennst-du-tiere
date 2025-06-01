// src/stores/quizStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Quiz, QuizState, QuestionStatus, QuizQuestion } from '@/src/quiz/types';
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
  
  // Quiz Runtime State - NEU
  quizStates: Record<string, QuizState>;
  currentQuizId: string | null;
  
  // UI State - NEU 
  isLoading: boolean;
  loadingOperations: Set<string>;
  
  // Quiz Content Actions
  registerQuiz: (quiz: Quiz) => void;
  setCurrentQuiz: (quizId: string | null) => void;
  
  // Quiz State Actions - NEU
  initializeQuizState: (quizId: string) => QuizState | null;
  updateQuizState: (quizId: string, newState: QuizState) => void;
  resetQuizState: (quizId: string) => QuizState | null;
  
  // Answer Processing - NEU
  submitAnswer: (quizId: string, questionId: number, answer: string) => {
    isCorrect: boolean;
    newState?: QuizState;
    nextQuestionId?: number;
    wasCompleted?: boolean;
  };
  
  // Progress & Status - NEU
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  // Loading State - NEU
  setLoading: (operation: string, loading: boolean) => void;
  isOperationLoading: (operation: string) => boolean;
  
  // Selectors - NEU
  getAllQuizzes: () => Quiz[];
  getQuizById: (id: string) => Quiz | undefined;
  getCurrentQuiz: () => Quiz | null;
  getCurrentQuizState: () => QuizState | null;
  
  // Debug Helper (erweitert)
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

export const useQuizStore = create<QuizStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        quizzes: {},
        quizStates: {},
        currentQuizId: null,
        isLoading: false,
        loadingOperations: new Set(),

        // Quiz Content Actions
        registerQuiz: (quiz) => {
          if (__DEV__) {
            console.log('[QuizStore] Registering quiz:', quiz.id);
          }
          set(
            (state) => ({
              quizzes: { ...state.quizzes, [quiz.id]: quiz }
            }),
            false,
            'registerQuiz'
          );
        },

        setCurrentQuiz: (quizId) => {
          if (__DEV__) {
            console.log('[QuizStore] Setting current quiz:', quizId);
          }
          set(
            { currentQuizId: quizId },
            false,
            'setCurrentQuiz'
          );
        },

        // Quiz State Actions - NEU
        initializeQuizState: (quizId) => {
          const state = get();
          const quiz = state.quizzes[quizId];
          
          if (!quiz) {
            if (__DEV__) {
              console.warn('[QuizStore] Cannot initialize state - quiz not found:', quizId);
            }
            return null;
          }
          
          // Prüfe ob State bereits existiert
          if (state.quizStates[quizId]) {
            return state.quizStates[quizId];
          }
          
          // Erstelle neuen State
          const newQuizState = createQuizState(quiz, { initialUnlockedQuestions: 2 });
          
          set(
            (state) => ({
              quizStates: { ...state.quizStates, [quizId]: newQuizState }
            }),
            false,
            'initializeQuizState'
          );
          
          if (__DEV__) {
            console.log('[QuizStore] Initialized quiz state:', quizId, newQuizState);
          }
          
          return newQuizState;
        },

        updateQuizState: (quizId, newState) => {
          set(
            (state) => ({
              quizStates: { ...state.quizStates, [quizId]: newState }
            }),
            false,
            'updateQuizState'
          );
          
          if (__DEV__) {
            console.log('[QuizStore] Updated quiz state:', quizId, newState);
          }
        },

        resetQuizState: (quizId) => {
          const state = get();
          const quiz = state.quizzes[quizId];
          
          if (!quiz) return null;
          
          const newState = createQuizState(quiz, { initialUnlockedQuestions: 2 });
          
          set(
            (state) => ({
              quizStates: { ...state.quizStates, [quizId]: newState }
            }),
            false,
            'resetQuizState'
          );
          
          if (__DEV__) {
            console.log('[QuizStore] Reset quiz state:', quizId);
          }
          
          return newState;
        },

        // Answer Processing - NEU
        submitAnswer: (quizId, questionId, answer) => {
          const state = get();
          const quizState = state.quizStates[quizId];
          
          if (!quizState) {
            if (__DEV__) {
              console.warn('[QuizStore] Cannot submit answer - quiz state not found:', quizId);
            }
            return { isCorrect: false };
          }
          
          // Finde die Frage
          const question = quizState.questions.find(q => q.id === questionId);
          if (!question) {
            if (__DEV__) {
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
          
          if (__DEV__) {
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

        // Progress & Status - NEU
        getQuizProgress: (quizId) => {
          const state = get();
          const quizState = state.quizStates[quizId];
          return quizState ? calculateQuizProgress(quizState) : 0;
        },

        getQuizProgressString: (quizId) => {
          const state = get();
          const quizState = state.quizStates[quizId];
          return quizState ? createProgressString(quizState) : null;
        },

        isQuizCompleted: (quizId) => {
          const state = get();
          const quizState = state.quizStates[quizId];
          return quizState ? isCompleted(quizState) : false;
        },

        getNextActiveQuestion: (quizId, currentQuestionId) => {
          const state = get();
          const quizState = state.quizStates[quizId];
          return quizState ? getNextActiveQuestionId(quizState, currentQuestionId) : null;
        },

        // Loading State - NEU
        setLoading: (operation, loading) => {
          set((state) => {
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

        isOperationLoading: (operation) => {
          return get().loadingOperations.has(operation);
        },

        // Selectors - NEU
        getAllQuizzes: () => {
          return Object.values(get().quizzes);
        },

        getQuizById: (id) => {
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

        // Debug Helper (erweitert)
        getDebugInfo: () => {
          const state = get();
          const allStates = Object.values(state.quizStates);
          
          return {
            quizzesCount: Object.keys(state.quizzes).length,
            statesCount: Object.keys(state.quizStates).length,
            currentQuiz: state.currentQuizId,
            allQuizIds: Object.keys(state.quizzes),
            completedQuizzes: allStates.filter(s => isCompleted(s)).length,
            totalQuestions: allStates.reduce((sum, s) => sum + s.questions.length, 0),
            completedQuestions: allStates.reduce((sum, s) => sum + s.completedQuestions, 0)
          };
        }
      }),
      {
        name: 'quiz-storage-v2', // Version erhöht
        // Erweiterte Persistence - jetzt auch Quiz-States
        partialize: (state) => ({
          currentQuizId: state.currentQuizId,
          quizStates: state.quizStates // NEU - persistiere Quiz-States
        })
      }
    ),
    {
      name: 'Quiz Store',
      trace: true,
      traceLimit: 25,
      enabled: __DEV__
    }
  )
);

// Export der Store-Interfaces
export type { QuizStore };
export type QuizStoreApi = ReturnType<typeof useQuizStore>;