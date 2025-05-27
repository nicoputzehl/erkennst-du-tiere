// src/quiz/contexts/QuizProvider.tsx - Vereinfachte Version (nur Business-Logic)
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { ContentKey } from '@/src/core/content/types';
import { Quiz, QuizState, UnlockCondition } from '../types';
import { normalizeString } from '@/utils/helper';

import { calculateAnswerResult, getNextActiveQuestionId } from '../domain/quizLogic';
import { getNextUnlockableQuiz, calculateUnlockProgress } from '../domain/unlockLogic';

import { useQuizData } from './QuizDataProvider';
import { useQuizState } from './QuizStateProvider';
import { useUIState } from './UIStateProvider';

interface QuizContextValue {
  getQuizById: <T extends ContentKey = ContentKey>(id: string) => Quiz<T> | undefined;
  getAllQuizzes: <T extends ContentKey = ContentKey>() => Quiz<T>[];
  
  getQuizState: <T extends ContentKey = ContentKey>(quizId: string) => QuizState<T> | undefined;
  initializeQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  updateQuizState: <T extends ContentKey = ContentKey>(quizId: string, newState: QuizState<T>) => Promise<void>;
  resetQuizState: <T extends ContentKey = ContentKey>(quizId: string) => Promise<QuizState<T> | null>;
  
  getQuizProgress: (quizId: string) => number;
  getQuizProgressString: (quizId: string) => string | null;
  isQuizCompleted: (quizId: string) => boolean;
  getNextActiveQuestion: (quizId: string, currentQuestionId?: number) => number | null;
  
  currentQuizId: string | null;
  currentQuizState: QuizState<ContentKey> | null;
  isLoading: boolean;
  initialized: boolean;
  isInitializing: boolean;
  
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
  
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
  
  getUnlockProgress: (quizId: string) => {
    condition: UnlockCondition | null;
    progress: number;
    isMet: boolean;
  };
  checkForUnlocks: () => Quiz[];
  
  startQuiz: (quizId: string) => Promise<QuizState | null>;
  loadQuiz: (quizId: string) => Promise<QuizState | null>;
  resetQuiz: (quizId: string) => Promise<QuizState | null>;
  setCurrentQuizId: (id: string | null) => void;
  
  clearAllData: () => Promise<void>;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const {
    getQuizById,
    getAllQuizzes,
    initialized: dataInitialized
  } = useQuizData();
  
  const {
    quizStates,
    currentQuizId,
    currentQuizState,
    initialized: stateInitialized,
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
  } = useQuizState();
  
  const {
    isGlobalLoading,
    startLoading,
    stopLoading,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    trackNavigation,
  } = useUIState();

  const initialized = dataInitialized && stateInitialized;
  const isInitializing = !initialized;

  const checkForUnlocks = useCallback((): Quiz[] => {
    const allQuizzes = getAllQuizzes();
    const quizStatesMap = new Map(Object.entries(quizStates));
    const unlockedQuizzes: Quiz[] = [];
    
    let nextUnlockable = getNextUnlockableQuiz(allQuizzes, quizStatesMap);
    while (nextUnlockable) {
      const updatedQuiz = { ...nextUnlockable, initiallyLocked: false };
      
      unlockedQuizzes.push(updatedQuiz);
      
      showSuccessToast(
        `🎉 Neues Quiz "${updatedQuiz.title}" wurde freigeschaltet!`,
        4000
      );
      
      nextUnlockable = getNextUnlockableQuiz(allQuizzes, quizStatesMap);
    }
    
    return unlockedQuizzes;
  }, [getAllQuizzes, quizStates, showSuccessToast]);

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
    const currentState = getQuizState(quizId) as QuizState<T>;
    if (!currentState) {
      throw new Error(`Quiz with ID ${quizId} not found`);
    }

    const processedAnswer = normalizeString(answer);
    const result = calculateAnswerResult(currentState, questionId, processedAnswer);

    if (result.isCorrect) {
      await updateQuizState(quizId, result.newState);
      
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
  }, [getQuizState, updateQuizState, checkForUnlocks]);

  const getUnlockProgress = useCallback((quizId: string) => {
    const quiz = getQuizById(quizId);
    if (!quiz || !quiz.unlockCondition) {
      return { condition: null, progress: 0, isMet: true };
    }

    const allQuizzes = getAllQuizzes();
    const quizStatesMap = new Map(Object.entries(quizStates));
    const { isMet, progress } = calculateUnlockProgress(quiz.unlockCondition, allQuizzes, quizStatesMap);

    return { condition: quiz.unlockCondition, progress, isMet };
  }, [getQuizById, getAllQuizzes, quizStates]);


  const startQuiz = useCallback(async (quizId: string) => {
    startLoading('startQuiz');
    
    try {
      const quizState = await initializeQuizState(quizId);
      if (quizState) {
        setCurrentQuiz(quizId, quizState);
        trackNavigation(quizId);
      }
      return quizState;
    } catch (error) {
      showErrorToast(`Fehler beim Starten des Quiz: ${error}`);
      return null;
    } finally {
      stopLoading('startQuiz');
    }
  }, [initializeQuizState, setCurrentQuiz, trackNavigation, showErrorToast, startLoading, stopLoading]);

  const loadQuiz = useCallback(async (quizId: string) => {
    return startQuiz(quizId);
  }, [startQuiz]);

  const resetQuiz = useCallback(async (quizId: string) => {
    startLoading('resetQuiz');
    
    try {
      const newState = await resetQuizState(quizId);
      if (newState && quizId === currentQuizId) {
        setCurrentQuiz(quizId, newState);
      }
      
      checkForUnlocks();
      
      showSuccessToast('Quiz wurde zurückgesetzt!');
      return newState;
    } catch (error) {
      showErrorToast(`Fehler beim Zurücksetzen des Quiz: ${error}`);
      return null;
    } finally {
      stopLoading('resetQuiz');
    }
  }, [resetQuizState, currentQuizId, setCurrentQuiz, checkForUnlocks, showSuccessToast, showErrorToast, startLoading, stopLoading]);

  const setCurrentQuizId = useCallback((id: string | null) => {
    const quizState = id ? getQuizState(id) : null;
    setCurrentQuiz(id, quizState);
    if (id) {
      trackNavigation(id);
    }
  }, [getQuizState, setCurrentQuiz, trackNavigation]);

  const clearAllData = useCallback(async (): Promise<void> => {
    startLoading('clearAllData');
    
    try {
      await resetAllQuizStates();
      showSuccessToast('Alle Daten wurden gelöscht!');
      console.log('[QuizProvider] All data cleared successfully');
    } catch (error) {
      showErrorToast(`Fehler beim Löschen der Daten: ${error}`);
      console.error('[QuizProvider] Error clearing all data:', error);
      throw error;
    } finally {
      stopLoading('clearAllData');
    }
  }, [resetAllQuizStates, showSuccessToast, showErrorToast, startLoading, stopLoading]);

  const contextValue: QuizContextValue = {
    getQuizById,
    getAllQuizzes,
    
    getQuizState,
    initializeQuizState,
    updateQuizState,
    resetQuizState,
    
    getQuizProgress,
    getQuizProgressString,
    isQuizCompleted,
    getNextActiveQuestion,
    
    currentQuizId,
    currentQuizState,
    isLoading: isGlobalLoading,
    initialized,
    isInitializing,
    
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    
    answerQuizQuestion,
    
    getUnlockProgress,
    checkForUnlocks,
    
    startQuiz,
    loadQuiz,
    resetQuiz,
    setCurrentQuizId,
    
    clearAllData,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
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

export type { QuizContextValue };