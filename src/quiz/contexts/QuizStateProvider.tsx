import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { QuizState, QuizMode } from '../types';
import { createQuizState, isCompleted, getNextActiveQuestionId } from '../domain/quizLogic';
import { useQuizData } from './QuizDataProvider';
import { usePersistence } from './PersistenceProvider';

interface QuizStateData {
  quizStates: Record<string, QuizState>;
  currentQuizId: string | null;
  currentQuizState: QuizState<ContentKey> | null;
  initialized: boolean;
  isLoading: boolean;
}

interface QuizStateContextValue {
  quizStates: Record<string, QuizState>;
  currentQuizId: string | null;
  currentQuizState: QuizState<ContentKey> | null;
  initialized: boolean;
  isLoading: boolean;
  
  getQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | undefined;
  initializeQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  updateQuizState: <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>) => Promise<void>;
  resetQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  setCurrentQuiz: (quizId: string | null, quizState?: QuizState | null) => void;
  
  resetAllQuizStates: () => Promise<void>;
  getCompletedQuizzesCount: () => number;
  getTotalQuestionsCount: () => number;
  getCompletedQuestionsCount: () => number;
}

const QuizStateContext = createContext<QuizStateContextValue | null>(null);

export function QuizStateProvider({ children }: { children: ReactNode }) {
  const { getQuizById, initialized: quizDataInitialized } = useQuizData();
  const { saveQuizStates, loadQuizStates, clearQuizStates } = usePersistence();
  
  const [stateData, setStateData] = useState<QuizStateData>({
    quizStates: {},
    currentQuizId: null,
    currentQuizState: null,
    initialized: false,
    isLoading: false,
  });

  // Auto-save whenever quiz states change
  const saveStatesIfInitialized = useCallback(async (quizStates: Record<string, QuizState>) => {
    if (stateData.initialized && quizDataInitialized) {
      try {
        await saveQuizStates(quizStates);
      } catch (error) {
        console.error('[QuizStateProvider] Error auto-saving quiz states:', error);
      }
    }
  }, [saveQuizStates, stateData.initialized, quizDataInitialized]);

  const updateStateData = useCallback((updater: (prev: QuizStateData) => QuizStateData) => {
    setStateData(prev => {
      const newState = updater(prev);
      
      // Auto-save wenn Zustände sich geändert haben
      if (newState.quizStates !== prev.quizStates) {
        saveStatesIfInitialized(newState.quizStates);
      }
      
      return newState;
    });
  }, [saveStatesIfInitialized]);

  const getQuizState = useCallback(<T extends ContentKey = ContentKey>(quizId: string): QuizState<T> | undefined => {
    return stateData.quizStates[quizId] as QuizState<T> | undefined;
  }, [stateData.quizStates]);

  const initializeQuizState = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string
  ): Promise<QuizState<T> | null> => {
    const quiz = getQuizById(quizId);
    if (!quiz) {
      console.warn(`[QuizStateProvider] Quiz with ID ${quizId} not found`);
      return null;
    }

    const existingState = stateData.quizStates[quizId];
    if (existingState) {
      console.log(`[QuizStateProvider] Quiz state ${quizId} already exists`);
      return existingState as QuizState<T>;
    }

    console.log(`[QuizStateProvider] Creating new quiz state for ${quizId}`);
    const newState = createQuizState(
      quiz.questions,
      quiz.id,
      quiz.title,
      quiz.quizMode || QuizMode.SEQUENTIAL,
      quiz.initialUnlockedQuestions || 2
    );

    updateStateData(prev => ({
      ...prev,
      quizStates: { ...prev.quizStates, [quizId]: newState }
    }));

    return newState as QuizState<T>;
  }, [getQuizById, stateData.quizStates, updateStateData]);

  const updateQuizState = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string, 
    newState: QuizState<T>
  ): Promise<void> => {
    console.log(`[QuizStateProvider] Updating quiz state for ${quizId}`);
    
    updateStateData(prev => {
      const updatedStates = { ...prev.quizStates, [quizId]: newState };
      const updatedCurrentState = prev.currentQuizId === quizId ? newState : prev.currentQuizState;
      
      return {
        ...prev,
        quizStates: updatedStates,
        currentQuizState: updatedCurrentState,
      };
    });
  }, [updateStateData]);

  const resetQuizState = useCallback(async <T extends ContentKey = ContentKey>(
    quizId: string
  ): Promise<QuizState<T> | null> => {
    const quiz = getQuizById(quizId);
    if (!quiz) {
      console.warn(`[QuizStateProvider] Cannot reset - Quiz with ID ${quizId} not found`);
      return null;
    }

    console.log(`[QuizStateProvider] Resetting quiz state for ${quizId}`);
    const newState = createQuizState(
      quiz.questions,
      quiz.id,
      quiz.title,
      quiz.quizMode || QuizMode.SEQUENTIAL,
      quiz.initialUnlockedQuestions || 2
    );

    updateStateData(prev => {
      const updatedStates = { ...prev.quizStates, [quizId]: newState };
      const updatedCurrentState = prev.currentQuizId === quizId ? newState : prev.currentQuizState;
      
      return {
        ...prev,
        quizStates: updatedStates,
        currentQuizState: updatedCurrentState,
      };
    });

    return newState as QuizState<T>;
  }, [getQuizById, updateStateData]);

  const getQuizProgress = useCallback((quizId: string): number => {
    const state = stateData.quizStates[quizId];
    if (!state || !state.questions?.length) return 0;
    return Math.round((state.completedQuestions / state.questions.length) * 100);
  }, [stateData.quizStates]);

  const getQuizProgressString = useCallback((quizId: string): string | null => {
    const state = stateData.quizStates[quizId];
    if (!state || !state.questions?.length) return null;
    return `${state.completedQuestions} von ${state.questions.length} gelöst`;
  }, [stateData.quizStates]);

  const isQuizCompleted = useCallback((quizId: string): boolean => {
    const state = stateData.quizStates[quizId];
    return state ? isCompleted(state) : false;
  }, [stateData.quizStates]);

  const getNextActiveQuestion = useCallback((quizId: string, currentQuestionId?: number): number | null => {
    const state = stateData.quizStates[quizId];
    return state ? getNextActiveQuestionId(state, currentQuestionId) : null;
  }, [stateData.quizStates]);

  const setCurrentQuiz = useCallback((quizId: string | null, quizState?: QuizState | null) => {
    console.log(`[QuizStateProvider] Setting current quiz to ${quizId}`);
    
    updateStateData(prev => ({
      ...prev,
      currentQuizId: quizId,
      currentQuizState: quizState || (quizId ? prev.quizStates[quizId] : null) || null,
    }));
  }, [updateStateData]);

  const resetAllQuizStates = useCallback(async (): Promise<void> => {
    console.log('[QuizStateProvider] Resetting all quiz states');
    
    try {
      await clearQuizStates();
      
      updateStateData(prev => ({
        ...prev,
        quizStates: {},
        currentQuizId: null,
        currentQuizState: null,
      }));
    } catch (error) {
      console.error('[QuizStateProvider] Error resetting all quiz states:', error);
      throw error;
    }
  }, [clearQuizStates, updateStateData]);

  const getCompletedQuizzesCount = useCallback((): number => {
    return Object.values(stateData.quizStates).filter(state => isCompleted(state)).length;
  }, [stateData.quizStates]);

  const getTotalQuestionsCount = useCallback((): number => {
    return Object.values(stateData.quizStates).reduce((total, state) => {
      return total + (state.questions?.length || 0);
    }, 0);
  }, [stateData.quizStates]);

  const getCompletedQuestionsCount = useCallback((): number => {
    return Object.values(stateData.quizStates).reduce((total, state) => {
      return total + (state.completedQuestions || 0);
    }, 0);
  }, [stateData.quizStates]);

  // Load initial state from persistence
  useEffect(() => {
    const initializeQuizStates = async () => {
      if (!quizDataInitialized) {
        return;
      }

      try {
        console.log('[QuizStateProvider] Initializing quiz states from persistence...');
        
        const savedStates = await loadQuizStates();
        
        updateStateData(prev => ({
          ...prev,
          quizStates: savedStates || {},
          initialized: true,
        }));
        
        console.log(`[QuizStateProvider] Quiz states initialization complete - loaded ${Object.keys(savedStates || {}).length} states`);
      } catch (error) {
        console.error('[QuizStateProvider] Quiz states initialization error:', error);
        updateStateData(prev => ({
          ...prev,
          initialized: true,
        }));
      }
    };

    initializeQuizStates();
  }, [quizDataInitialized, loadQuizStates, updateStateData]);

  const contextValue: QuizStateContextValue = {
    quizStates: stateData.quizStates,
    currentQuizId: stateData.currentQuizId,
    currentQuizState: stateData.currentQuizState,
    initialized: stateData.initialized,
    isLoading: stateData.isLoading,
    
    getQuizState,
    initializeQuizState,
    updateQuizState,
    resetQuizState,
    
    getQuizProgress,
    getQuizProgressString,
    isQuizCompleted,
    getNextActiveQuestion,
    
    setCurrentQuiz,
    
    resetAllQuizStates,
    getCompletedQuizzesCount,
    getTotalQuestionsCount,
    getCompletedQuestionsCount,
  };

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

export type { QuizStateContextValue };