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

  
  const quizState = getQuizState(quizId);
  console.table(quizState);

  const isQuizFinished = isQuizCompleted(quizId);

  const processCorrectAnswer = useCallback((
    newState: QuizState
  ) => {
    setIsCorrect(true);
    setShowResult(true);
    updateQuizState(quizId, newState);
  }, [quizId, updateQuizState]);

  const processIncorrectAnswer = useCallback(() => {
    setIsCorrect(false);
    setShowResult(true);
  }, []);

  const handleNext = useCallback(() => {
    if (!quizState) return;
    
    const nextQuestionId = getNextActiveQuestionId(quizState.id,Number(questionId));
    
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
    processCorrectAnswer,
    processIncorrectAnswer,
    handleNext,
    handleBack,
    handleTryAgain,
    isQuizCompleted: isQuizFinished
  };
};