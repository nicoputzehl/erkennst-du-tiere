import { useCallback, useMemo } from 'react';
import { useQuizStore } from '../Quiz.store';
import { ContextualHint } from '../../types/hint';


export const useHints = (quizId: string, questionId: number) => {
  // Store-Zugriff über Selektoren (wie in useQuiz.ts)
  const quizState = useQuizStore((state) => state.quizStates[quizId]);
  const globalPointsBalance = useQuizStore((state) => state.getPointsBalance());
  
  // Store-Aktionen
  const applyHint = useQuizStore((state) => state.applyHint);
  const recordWrongAnswer = useQuizStore((state) => state.recordWrongAnswer);
  const getAvailableHints = useQuizStore((state) => state.getAvailableHints);
  
  // Abgeleitete Werte
  const question = quizState?.questions.find((q) => q.id === questionId);
  const hintState = quizState?.hintStates[questionId];
  
  const availableHints = useMemo(() => {
    if (!question || !hintState) return [];
    return getAvailableHints(quizId, questionId);
  }, [quizId, questionId, hintState, getAvailableHints, question]);
  
  const handleUseHint = useCallback(async (hintId: string) => {
    return await applyHint(quizId, questionId, hintId);
  }, [quizId, questionId, applyHint]);
  
  const handleWrongAnswer = useCallback((userAnswer: string): ContextualHint[] => {
    return recordWrongAnswer(quizId, questionId, userAnswer);
  }, [quizId, questionId, recordWrongAnswer]);
  
  return {
    availableHints,
    pointsBalance: globalPointsBalance,
    wrongAttempts: hintState?.wrongAttempts || 0,
    handleUseHint,
    recordWrongAnswer: handleWrongAnswer
  };
};