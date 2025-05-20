// src/quiz/hooks/useActiveQuiz.ts
import { useState, useCallback } from 'react';

import { useQuizRegistry } from '@/src/quiz/contexts/QuizRegistryProvider';
import { useQuizState } from '@/src/quiz/contexts/QuizStateProvider';
import { useProgressTracker } from '@/src/quiz/contexts/ProgressTrackerProvider';

export function useActiveQuiz(initialQuizId?: string | null) {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(initialQuizId || null);
  
  const { getQuizById } = useQuizRegistry();
  const { getQuizState, initializeQuizState, resetQuizState } = useQuizState();
  const { getNextActiveQuestion, getQuizProgress, isQuizCompleted } = useProgressTracker();
  
  // Aktives Quiz abrufen
  const activeQuiz = activeQuizId ? getQuizById(activeQuizId) : null;
  
  // Aktiven Quiz-Zustand abrufen
  const quizState = activeQuizId ? getQuizState(activeQuizId) : null;
  
  // Quiz laden oder initialisieren
  const loadQuiz = useCallback((quizId: string) => {
    const state = initializeQuizState(quizId);
    if (state) {
      setActiveQuizId(quizId);
    }
    return state;
  }, [initializeQuizState]);
  
  // Quiz zurücksetzen
  const resetQuiz = useCallback(() => {
    if (!activeQuizId) return null;
    return resetQuizState(activeQuizId);
  }, [activeQuizId, resetQuizState]);
  
  // Nächste aktive Frage abrufen
  const getNextQuestion = useCallback(() => {
    if (!activeQuizId) return null;
    return getNextActiveQuestion(activeQuizId);
  }, [activeQuizId, getNextActiveQuestion]);
  
  // Fortschritt abrufen
  const getProgress = useCallback(() => {
    if (!activeQuizId) return 0;
    return getQuizProgress(activeQuizId);
  }, [activeQuizId, getQuizProgress]);
  
  // Quiz-Abschluss prüfen
  const checkCompletion = useCallback(() => {
    if (!activeQuizId) return false;
    return isQuizCompleted(activeQuizId);
  }, [activeQuizId, isQuizCompleted]);
  
  return {
    activeQuizId,
    setActiveQuizId,
    activeQuiz,
    quizState,
    loadQuiz,
    resetQuiz,
    getNextQuestion,
    getProgress,
    checkCompletion
  };
}