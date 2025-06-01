// src/quiz/contexts/QuizStateProvider.tsx - Store Bridge Integration
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { QuizState, Quiz, QuizConfig } from '../types';
import { usePersistence } from './PersistenceProvider';
import { useQuizData } from './QuizDataProvider';
import { useStoreBridge } from '@/src/stores/useStoreBridge';
import { 
  createQuizState, 
  getNextActiveQuestionId, 
  isCompleted,
  calculateQuizProgress,
  createProgressString
} from '../utils';

// Original operations bleiben für Kompatibilität
export const stateOperations = {
  initializeState: (
    quizId: string,
    existingStates: Record<string, QuizState>,
    getQuizById: (id: string) => Quiz | undefined,
    getQuizConfigById: (id: string) => QuizConfig | undefined
  ): QuizState | null => {
    const existingState = existingStates[quizId];
    if (existingState) {
      return existingState;
    }

    const quiz = getQuizById(quizId);
    const config = getQuizConfigById(quizId);
    
    if (!quiz || !config) {
      return null;
    }

    return createQuizState(quiz, {
      initialUnlockedQuestions: config.initialUnlockedQuestions || 2
    });
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
    getQuizById: (id: string) => Quiz | undefined,
    getQuizConfigById: (id: string) => QuizConfig | undefined
  ) => {
    const quiz = getQuizById(quizId);
    const config = getQuizConfigById(quizId);
    
    if (!quiz || !config) {
      return null;
    }

    const newState = createQuizState(quiz, {
      initialUnlockedQuestions: config.initialUnlockedQuestions || 2
    });

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

// Feature Flag für Store Integration
const USE_STORE_BRIDGE = true; // Kann später entfernt werden

export function QuizStateProvider({ children }: { children: ReactNode }) {
  const { getQuizById, getQuizConfigById, initialized: quizDataInitialized } = useQuizData();
  const { saveQuizStates, loadQuizStates, clearQuizStates } = usePersistence();
  const storeBridge = useStoreBridge();
  
  const [stateData, setStateData] = useState<QuizStateData>({
    quizStates: USE_STORE_BRIDGE ? storeBridge.quizStates : {},
    currentQuizId: USE_STORE_BRIDGE ? storeBridge.currentQuizId : null,
    currentQuizState: USE_STORE_BRIDGE ? storeBridge.currentQuizState : null,
    initialized: USE_STORE_BRIDGE ? storeBridge.initialized : false,
    isLoading: USE_STORE_BRIDGE ? storeBridge.isLoading : false,
  });

  const initializationRef = useRef(false);
  const saveInProgressRef = useRef(false);

  // Sync with Store Bridge wenn aktiviert
  useEffect(() => {
    if (!USE_STORE_BRIDGE) return;

    setStateData(prev => ({
      ...prev,
      quizStates: storeBridge.quizStates,
      currentQuizId: storeBridge.currentQuizId,
      currentQuizState: storeBridge.currentQuizState,
      initialized: storeBridge.initialized,
      isLoading: storeBridge.isLoading,
    }));
  }, [
    storeBridge.quizStates,
    storeBridge.currentQuizId,
    storeBridge.currentQuizState,
    storeBridge.initialized,
    storeBridge.isLoading
  ]);

  const saveStatesIfInitialized = useCallback(async (quizStates: Record<string, QuizState>) => {
    if (USE_STORE_BRIDGE) return; // Store übernimmt Persistence
    
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
    if (USE_STORE_BRIDGE) return; // Store übernimmt State Management
    
    setStateData(prev => {
      const newState = updater(prev);
      
      if (newState.quizStates !== prev.quizStates && Object.keys(newState.quizStates).length > 0) {
        saveStatesIfInitialized(newState.quizStates);
      }
      
      return newState;
    });
  }, [saveStatesIfInitialized]);

  const getQuizState = useCallback((quizId: string): QuizState | undefined => {
    if (USE_STORE_BRIDGE) {
      return storeBridge.getQuizState(quizId);
    }
    return stateData.quizStates[quizId];
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates]);

  const initializeQuizState = useCallback(async (quizId: string): Promise<QuizState | null> => {
    if (USE_STORE_BRIDGE) {
      return await storeBridge.initializeQuizState(quizId);
    }

    const newState = stateOperations.initializeState(
      quizId,
      stateData.quizStates,
      getQuizById,
      getQuizConfigById
    );

    if (newState && !stateData.quizStates[quizId]) {
      updateStateData(prev => ({
        ...prev,
        quizStates: { ...prev.quizStates, [quizId]: newState }
      }));
    }

    return newState;
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates, getQuizById, getQuizConfigById, updateStateData]);

  const updateQuizState = useCallback(async (quizId: string, newState: QuizState): Promise<void> => {
    if (USE_STORE_BRIDGE) {
      return await storeBridge.updateQuizState(quizId, newState);
    }

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
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates, stateData.currentQuizId, updateStateData]);

  const resetQuizState = useCallback(async (quizId: string): Promise<QuizState | null> => {
    if (USE_STORE_BRIDGE) {
      return await storeBridge.resetQuizState(quizId);
    }

    const resetResult = stateOperations.calculateResetState(
      quizId,
      stateData.quizStates,
      stateData.currentQuizId,
      getQuizById,
      getQuizConfigById
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
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates, stateData.currentQuizId, getQuizById, getQuizConfigById, updateStateData]);

  const getQuizProgress = useCallback((quizId: string): number => {
    if (USE_STORE_BRIDGE) {
      return storeBridge.getQuizProgress(quizId);
    }
    const state = stateData.quizStates[quizId];
    return state ? calculateQuizProgress(state) : 0;
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates]);

  const getQuizProgressString = useCallback((quizId: string): string | null => {
    if (USE_STORE_BRIDGE) {
      return storeBridge.getQuizProgressString(quizId);
    }
    const state = stateData.quizStates[quizId];
    return state ? createProgressString(state) : null;
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates]);

  const isQuizCompleted = useCallback((quizId: string): boolean => {
    if (USE_STORE_BRIDGE) {
      return storeBridge.isQuizCompleted(quizId);
    }
    const state = stateData.quizStates[quizId];
    return state ? isCompleted(state) : false;
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates]);

  const getNextActiveQuestion = useCallback((quizId: string, currentQuestionId?: number): number | null => {
    if (USE_STORE_BRIDGE) {
      return storeBridge.getNextActiveQuestion(quizId, currentQuestionId);
    }
    const state = stateData.quizStates[quizId];
    return state ? getNextActiveQuestionId(state, currentQuestionId) : null;
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates]);

  const setCurrentQuiz = useCallback((quizId: string | null, quizState?: QuizState | null) => {
    if (USE_STORE_BRIDGE) {
      storeBridge.setCurrentQuiz(quizId);
      return;
    }
    
    updateStateData(prev => ({
      ...prev,
      currentQuizId: quizId,
      currentQuizState: quizState || (quizId ? prev.quizStates[quizId] : null) || null,
    }));
  }, [USE_STORE_BRIDGE, storeBridge, updateStateData]);

  const resetAllQuizStates = useCallback(async (): Promise<void> => {
    if (USE_STORE_BRIDGE) {
      // TODO: Store Bridge erweitern um resetAll Funktionalität
      console.warn('[QuizStateProvider] resetAllQuizStates not yet implemented in Store Bridge');
      return;
    }

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
  }, [USE_STORE_BRIDGE, clearQuizStates, updateStateData]);

  const getCompletedQuizzesCount = useCallback((): number => {
    if (USE_STORE_BRIDGE) {
      return storeBridge.getCompletedQuizzesCount();
    }
    const stats = stateOperations.calculateStatistics(stateData.quizStates);
    return stats.completedCount;
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates]);

  const getTotalQuestionsCount = useCallback((): number => {
    if (USE_STORE_BRIDGE) {
      return storeBridge.getTotalQuestionsCount();
    }
    const stats = stateOperations.calculateStatistics(stateData.quizStates);
    return stats.totalQuestions;
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates]);

  const getCompletedQuestionsCount = useCallback((): number => {
    if (USE_STORE_BRIDGE) {
      return storeBridge.getCompletedQuestionsCount();
    }
    const stats = stateOperations.calculateStatistics(stateData.quizStates);
    return stats.completedQuestions;
  }, [USE_STORE_BRIDGE, storeBridge, stateData.quizStates]);

  // Original Initialization für Legacy System
  useEffect(() => {
    if (USE_STORE_BRIDGE || initializationRef.current || !quizDataInitialized) {
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
  }, [USE_STORE_BRIDGE, quizDataInitialized, loadQuizStates, updateStateData]);

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

// Export für Tests bleibt unverändert
export const createTestableQuizStateProvider = (mockDependencies: {
  getQuizById: (id: string) => Quiz | undefined;
  getQuizConfigById: (id: string) => QuizConfig | undefined;
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
          mockDependencies.getQuizById,
          mockDependencies.getQuizConfigById
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
          mockDependencies.getQuizById,
          mockDependencies.getQuizConfigById
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