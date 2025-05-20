import { useCallback, useEffect, useState } from 'react';
import { Quiz, QuizState } from '../types';
import { ContentKey } from '@/src/core/content/types';

import * as UnlockService from '../services/unlockManager';
import { useToast } from '../contexts/ToastProvider';
import { useQuizState } from '../contexts/QuizStateProvider';

/**
 * Hook, der die Quiz-Management-Funktionalitäten bereitstellt
 * Mit korrekter Quiz-Initialisierung
 */
export const useQuizManager = () => {
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [currentQuizState, setCurrentQuizState] = useState<QuizState<ContentKey> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const {
    initializeQuizState,
    resetQuizState
  } = useQuizState();

  // Toast-Integration beim Hook-Start mit dem neuen Event-System
  useEffect(() => {
    const unlockHandler = (unlockedQuiz: Quiz) => {
      showSuccessToast(
        `🎉 Neues Quiz "${unlockedQuiz.title}" wurde freigeschaltet!`,
        4000
      );
    };

    UnlockService.addUnlockListener(unlockHandler);

    return () => {
      UnlockService.removeUnlockListener(unlockHandler);
    };
  }, [showSuccessToast]);

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
      console.error(`[useQuizManager] Error starting quiz ${quizId}:`, error);
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
      console.error(`[useQuizManager] Error loading quiz ${quizId}:`, error);
      showErrorToast(`Fehler beim Laden des Quiz: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [initializeQuizState, showErrorToast]);

  const resetQuizById = useCallback(async (quizId: string) => {
    setIsLoading(true);
    try {
      const newState = await resetQuizState(quizId);
      if (newState && quizId === currentQuizId) {
        setCurrentQuizState(newState);
      }
      
      // Prüfen auf neue Freischaltungen
      UnlockService.checkForUnlocks();
      
      return newState;
    } catch (error) {
      console.error(`[useQuizManager] Error resetting quiz ${quizId}:`, error);
      showErrorToast(`Fehler beim Zurücksetzen des Quiz: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [resetQuizState, currentQuizId, showErrorToast]);

  return {
    currentQuizId,
    currentQuizState,
    isLoading,
    setCurrentQuizId,
    startQuiz,
    loadQuiz,
    resetQuiz: resetQuizById,
  };
};