import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { QuizMode, QuizState } from '../types';
import { usePersistence } from './PersistenceProvider';
import { useQuizData } from './QuizDataProvider';
import { 
  createQuizState, 
  getNextActiveQuestionId, 
  isCompleted,
  calculateQuizProgress,
  createProgressString
} from '../utils';


export const stateOperations = {
  initializeState: (
    quizId: string,
    existingStates: Record<string, QuizState>,
    getQuizById: (id: string) => any
  ): QuizState | null => {
    const existingState = existingStates[quizId];
    if (existingState) {
      return existingState;
    }

    const quiz = getQuizById(quizId);
    if (!quiz) {
      return null;
    }

    return createQuizState(
      quiz.questions,
      quiz.id,
      quiz.title,
      quiz.quizMode || QuizMode.SEQUENTIAL,
      quiz.initialUnlockedQuestions || 2
    );
  },

  calculateStateUpdate: (
    quizId: string,
    newState: QuizState,
    currentStates: Record<string, QuizState>,
    currentQuizId: string | null
  ) => {
    const updatedStates = { ...currentStates, [quizId]: newState };
    const updatedCurrentState = currentQuizId === quizId ? newState : null;
    
    return {
      quizStates: updatedStates,
      currentQuizState: updatedCurrentState,
    };
  },

  calculateResetState: (
    quizId: string,
    currentStates: Record<string, QuizState>,
    currentQuizId: string | null,
    getQuizById: (id: string) => any
  ) => {
    const quiz = getQuizById(quizId);
    if (!quiz) {
      return null;
    }

    const newState = createQuizState(
      quiz.questions,
      quiz.id,
      quiz.title,
      quiz.quizMode || QuizMode.SEQUENTIAL,
      quiz.initialUnlockedQuestions || 2
    );

    const updatedStates = { ...currentStates, [quizId]: newState };
    const updatedCurrentState = currentQuizId === quizId ? newState : null;
    
    return {
      newState,
      quizStates: updatedStates,
      currentQuizState: updatedCurrentState,
    };
  },

  calculateStatistics: (quizStates: Record<string, QuizState>) => ({
    completedCount: Object.values(quizStates).filter(state => isCompleted(state)).length,
    totalQuestions: Object.values(quizStates).reduce((total, state) => total + (state.questions?.length || 0), 0),
    completedQuestions: Object.values(quizStates).reduce((total, state) => total + (state.completedQuestions || 0), 0),
  }),
};


interface QuizStateData {
  quizStates: Record<string, QuizState>;
  currentQuizId: string | null;
  currentQuizState: QuizState | null;
  initialized: boolean;
  isLoading: boolean;
}

interface QuizStateContextValue {
  quizStates: Record<string, QuizState>;
  currentQuizId: string | null;
  currentQuizState: QuizState | null;
  initialized: boolean;
  isLoading: boolean;
  
  getQuizState: (quizId: string) => QuizState | undefined;
  initializeQuizState: (quizId: string) => Promise<QuizState | null>;
  updateQuizState: (quizId: string, newState: QuizState) => Promise<void>;
  resetQuizState: (quizId: string) => Promise<QuizState | null>;
  
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

  
  const initializationRef = useRef(false);
  const saveInProgressRef = useRef(false);


  const saveStatesIfInitialized = useCallback(async (quizStates: Record<string, QuizState>) => {
    if (saveInProgressRef.current) {
      return;
    }

    if (stateData.initialized && quizDataInitialized) {
      saveInProgressRef.current = true;
      try {
        await saveQuizStates(quizStates);
      } catch (error) {
        console.error('[QuizStateProvider] Error auto-saving quiz states:', error);
      } finally {
        saveInProgressRef.current = false;
      }
    }
  }, [saveQuizStates, stateData.initialized, quizDataInitialized]);

  const updateStateData = useCallback((updater: (prev: QuizStateData) => QuizStateData) => {
    setStateData(prev => {
      const newState = updater(prev);
      
      if (newState.quizStates !== prev.quizStates && Object.keys(newState.quizStates).length > 0) {
        saveStatesIfInitialized(newState.quizStates);
      }
      
      return newState;
    });
  }, [saveStatesIfInitialized]);


  const getQuizState = useCallback((quizId: string): QuizState | undefined => {
    return stateData.quizStates[quizId];
  }, [stateData.quizStates]);

  const initializeQuizState = useCallback(async (quizId: string): Promise<QuizState | null> => {
    const newState = stateOperations.initializeState(
      quizId,
      stateData.quizStates,
      getQuizById
    );

    if (newState && !stateData.quizStates[quizId]) {
      updateStateData(prev => ({
        ...prev,
        quizStates: { ...prev.quizStates, [quizId]: newState }
      }));
    }

    return newState;
  }, [stateData.quizStates, getQuizById, updateStateData]);

  const updateQuizState = useCallback(async (quizId: string, newState: QuizState): Promise<void> => {
    const update = stateOperations.calculateStateUpdate(
      quizId,
      newState,
      stateData.quizStates,
      stateData.currentQuizId
    );
    
    updateStateData(prev => ({
      ...prev,
      ...update,
    }));
  }, [stateData.quizStates, stateData.currentQuizId, updateStateData]);

  const resetQuizState = useCallback(async (quizId: string): Promise<QuizState | null> => {
    const resetResult = stateOperations.calculateResetState(
      quizId,
      stateData.quizStates,
      stateData.currentQuizId,
      getQuizById
    );

    if (resetResult) {
      updateStateData(prev => ({
        ...prev,
        quizStates: resetResult.quizStates,
        currentQuizState: resetResult.currentQuizState,
      }));
      
      return resetResult.newState;
    }

    return null;
  }, [stateData.quizStates, stateData.currentQuizId, getQuizById, updateStateData]);

  const getQuizProgress = useCallback((quizId: string): number => {
    const state = stateData.quizStates[quizId];
    return state ? calculateQuizProgress(state) : 0;
  }, [stateData.quizStates]);

  const getQuizProgressString = useCallback((quizId: string): string | null => {
    const state = stateData.quizStates[quizId];
    return state ? createProgressString(state) : null;
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
    updateStateData(prev => ({
      ...prev,
      currentQuizId: quizId,
      currentQuizState: quizState || (quizId ? prev.quizStates[quizId] : null) || null,
    }));
  }, [updateStateData]);

  const resetAllQuizStates = useCallback(async (): Promise<void> => {
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
    const stats = stateOperations.calculateStatistics(stateData.quizStates);
    return stats.completedCount;
  }, [stateData.quizStates]);

  const getTotalQuestionsCount = useCallback((): number => {
    const stats = stateOperations.calculateStatistics(stateData.quizStates);
    return stats.totalQuestions;
  }, [stateData.quizStates]);

  const getCompletedQuestionsCount = useCallback((): number => {
    const stats = stateOperations.calculateStatistics(stateData.quizStates);
    return stats.completedQuestions;
  }, [stateData.quizStates]);


  useEffect(() => {
    if (initializationRef.current || !quizDataInitialized) {
      return;
    }

    const initializeQuizStates = async () => {
      initializationRef.current = true;
      
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

export const createTestableQuizStateProvider = (mockDependencies: {
  getQuizById: (id: string) => any;
  saveQuizStates: (states: Record<string, QuizState>) => Promise<void>;
  loadQuizStates: () => Promise<Record<string, QuizState> | null>;
  clearQuizStates: () => Promise<void>;
}) => {
  const TestableProvider = ({ children }: { children: ReactNode }) => {
    const [stateData, setStateData] = useState<QuizStateData>({
      quizStates: {},
      currentQuizId: null,
      currentQuizState: null,
      initialized: true,
      isLoading: false,
    });

    const contextValue: QuizStateContextValue = {
      ...stateData,
      getQuizState: (quizId: string) => stateData.quizStates[quizId],
      initializeQuizState: async (quizId: string) => {
        const newState = stateOperations.initializeState(
          quizId,
          stateData.quizStates,
          mockDependencies.getQuizById
        );
        if (newState) {
          setStateData(prev => ({
            ...prev,
            quizStates: { ...prev.quizStates, [quizId]: newState }
          }));
        }
        return newState;
      },
      updateQuizState: async (quizId: string, newState: QuizState) => {
        const update = stateOperations.calculateStateUpdate(
          quizId,
          newState,
          stateData.quizStates,
          stateData.currentQuizId
        );
        setStateData(prev => ({ ...prev, ...update }));
      },
      resetQuizState: async (quizId: string) => {
        const resetResult = stateOperations.calculateResetState(
          quizId,
          stateData.quizStates,
          stateData.currentQuizId,
          mockDependencies.getQuizById
        );
        if (resetResult) {
          setStateData(prev => ({
            ...prev,
            quizStates: resetResult.quizStates,
            currentQuizState: resetResult.currentQuizState,
          }));
          return resetResult.newState;
        }
        return null;
      },
      getQuizProgress: (quizId: string) => {
        const state = stateData.quizStates[quizId];
        return state ? calculateQuizProgress(state) : 0;
      },
      getQuizProgressString: (quizId: string) => {
        const state = stateData.quizStates[quizId];
        return state ? createProgressString(state) : null;
      },
      isQuizCompleted: (quizId: string) => {
        const state = stateData.quizStates[quizId];
        return state ? isCompleted(state) : false;
      },
      getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => {
        const state = stateData.quizStates[quizId];
        return state ? getNextActiveQuestionId(state, currentQuestionId) : null;
      },
      setCurrentQuiz: (quizId: string | null, quizState?: QuizState | null) => {
        setStateData(prev => ({
          ...prev,
          currentQuizId: quizId,
          currentQuizState: quizState || (quizId ? prev.quizStates[quizId] : null) || null,
        }));
      },
      resetAllQuizStates: async () => {
        await mockDependencies.clearQuizStates();
        setStateData(prev => ({
          ...prev,
          quizStates: {},
          currentQuizId: null,
          currentQuizState: null,
        }));
      },
      getCompletedQuizzesCount: () => {
        const stats = stateOperations.calculateStatistics(stateData.quizStates);
        return stats.completedCount;
      },
      getTotalQuestionsCount: () => {
        const stats = stateOperations.calculateStatistics(stateData.quizStates);
        return stats.totalQuestions;
      },
      getCompletedQuestionsCount: () => {
        const stats = stateOperations.calculateStatistics(stateData.quizStates);
        return stats.completedQuestions;
      },
    };

    return (
      <QuizStateContext.Provider value={contextValue}>
        {children}
      </QuizStateContext.Provider>
    );
  };
  
  TestableProvider.displayName = 'TestableQuizStateProvider';
  return TestableProvider;
};

export type { QuizStateContextValue };