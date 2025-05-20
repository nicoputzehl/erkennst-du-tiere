import { useCallback, useEffect, useState } from 'react';
import { Quiz } from '../types';

import * as UnlockService from '../services/unlockManager';
import { useToast } from '../contexts/ToastProvider';
import { useQuizState } from '../contexts/QuizStateProvider';

/**
 * Hook, der die Quiz-Management-Funktionalitäten bereitstellt
 * Mit korrekter Quiz-Initialisierung
 */
export const useQuizManager = () => {
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const { showSuccessToast } = useToast();
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

  const startQuiz = useCallback((quizId: string) => {
    const quiz = initializeQuizState(quizId);
    if (quiz) {
      setCurrentQuizId(quizId);
    }
    return quiz;
  }, [initializeQuizState]);

  const loadQuiz = useCallback((quizId: string) => {
    const quiz = initializeQuizState(quizId);
    if (quiz) {
      setCurrentQuizId(quizId);
    }
    return quiz;
  }, [initializeQuizState]);

  const resetQuiz = useCallback((quizId: string) => {
    const newState = resetQuizState(quizId);
    UnlockService.checkForUnlocks();
    return newState;
  }, [resetQuizState]);


  return {
    currentQuizId,
    setCurrentQuizId,
    startQuiz,
    loadQuiz,
    resetQuiz,
  };
};