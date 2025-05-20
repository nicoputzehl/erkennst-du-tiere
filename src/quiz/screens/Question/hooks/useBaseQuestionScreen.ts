import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { useQuizState } from '@/src/quiz/contexts/QuizStateProvider';
import { useProgressTracker } from '@/src/quiz/contexts/ProgressTrackerProvider';
import { QuizQuestion, QuizState } from '@/src/quiz/types';

export const useBaseQuestionScreen = (
  quizId: string,
  questionId: string,
  question: QuizQuestion
) => {
  const { getQuizState, updateQuizState } = useQuizState();
  const { getNextActiveQuestion: getNextActiveQuestionId, isQuizCompleted } = useProgressTracker();

  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [initialQuestionStatus] = useState<string>(question.status);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const quizState = getQuizState(quizId);
  const isQuizFinished = isQuizCompleted(quizId);

  const processCorrectAnswer = useCallback(async (
    newState: QuizState
  ) => {
    setIsCorrect(true);
    setShowResult(true);
    setIsUpdating(true);
    
    try {
      await updateQuizState(quizId, newState);
    } catch (error) {
      console.error(`[useBaseQuestionScreen] Error updating quiz state:`, error);
    } finally {
      setIsUpdating(false);
    }
  }, [quizId, updateQuizState]);

  const processIncorrectAnswer = useCallback(() => {
    setIsCorrect(false);
    setShowResult(true);
  }, []);

  const handleNext = useCallback(() => {
    if (!quizState) return;
    
    const nextQuestionId = getNextActiveQuestionId(quizState.id, Number(questionId));
    
    if (nextQuestionId) {
      router.replace(`/quiz/${quizId}/${nextQuestionId}`);
    } else {
      router.push(`/quiz/${quizId}`);
    }
  }, [quizState, quizId, getNextActiveQuestionId, questionId]);

  const handleBack = useCallback(() => {
    router.push(`/quiz/${quizId}`);
  }, [quizId]);

  const handleTryAgain = useCallback(() => {
    setShowResult(false);
  }, []);

  return {
    quizState,
    showResult,
    isCorrect,
    initialQuestionStatus,
    isUpdating,
    processCorrectAnswer,
    processIncorrectAnswer,
    handleNext,
    handleBack,
    handleTryAgain,
    isQuizCompleted: isQuizFinished
  };
};