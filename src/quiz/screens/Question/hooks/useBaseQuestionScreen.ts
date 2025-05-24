import { useCallback, useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
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

  // Refs for cleanup
  const preloadingTimeouts = useRef<(NodeJS.Timeout | number)[]>([]);
  const isMounted = useRef(true);

  const quizState = getQuizState(quizId);
  const isQuizFinished = isQuizCompleted(quizId);


  // Memory Management
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;

      // Clear preloading timeouts
      preloadingTimeouts.current.forEach(timeout => {
        if (typeof timeout === 'number') {
          clearTimeout(timeout);
        } else {
          clearTimeout(timeout);
        }
      });
      preloadingTimeouts.current = [];

      // Optional: Clear memory cache if we have many images
      // Only clear if we have processed many questions to avoid clearing needed images
      const currentIndex = quizState?.questions.findIndex(q => q.id === Number(questionId)) ?? 0;
      if (currentIndex > 10) { // After 10 questions, start memory management
        setTimeout(() => {
          // Use a timeout to avoid interfering with navigation
          if (Image.clearMemoryCache) {
            console.log('[Memory Management] Clearing image memory cache');
            Image.clearMemoryCache();
          }
        }, 2000);
      }
    };
  }, [quizState, questionId]);

  const processCorrectAnswer = useCallback(async (
    newState: QuizState
  ) => {
    if (!isMounted.current) return;

    setIsCorrect(true);
    setShowResult(true);
    setIsUpdating(true);

    try {
      await updateQuizState(quizId, newState);
    } catch (error) {
      console.error(`[useBaseQuestionScreen] Error updating quiz state:`, error);
    } finally {
      if (isMounted.current) {
        setIsUpdating(false);
      }
    }
  }, [quizId, updateQuizState]);

  const processIncorrectAnswer = useCallback(() => {
    if (!isMounted.current) return;

    setIsCorrect(false);
    setShowResult(true);
  }, []);

  const handleNext = useCallback(() => {
    if (!quizState || !isMounted.current) return;

    const nextQuestionId = getNextActiveQuestionId(quizState.id, Number(questionId));

    if (nextQuestionId) {
      router.replace(`/quiz/${quizId}/${nextQuestionId}`);
    } else {
      router.navigate(`/quiz/${quizId}`);
    }
  }, [quizState, quizId, getNextActiveQuestionId, questionId]);

  const handleBack = useCallback(() => {
    if (!isMounted.current) return;

    router.navigate(`/quiz/${quizId}`);
  }, [quizId]);

  const handleTryAgain = useCallback(() => {
    if (!isMounted.current) return;

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