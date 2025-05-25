import { useAnswerProcessor } from '@/src/quiz/contexts/AnswerProcessorProvider';
import { useProgressTracker } from '@/src/quiz/contexts/ProgressTrackerProvider';
import { useQuizState } from '@/src/quiz/contexts/QuizStateProvider';
import { QuizQuestion, QuizState } from '@/src/quiz/types';
import { router } from 'expo-router';
import {  useCallback, useState } from 'react';

export const useQuestion = (
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

  const { answerQuizQuestion } = useAnswerProcessor();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      router.navigate(`/quiz/${quizId}`);
    }
  }, [quizState, quizId, getNextActiveQuestionId, questionId]);

  const handleBack = useCallback(() => {
    router.navigate(`/quiz/${quizId}`);
  }, [quizId]);

  const handleTryAgain = useCallback(() => {

    setShowResult(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !answer.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await answerQuizQuestion(
        quizId,
        question.id,
        answer.trim()
      );

      if (result.isCorrect && result.newState) {
        processCorrectAnswer(result.newState);
      } else {
        processIncorrectAnswer();
      }
    } catch (error) {
      console.error(`[useTextQuestionScreen] Error submitting answer:`, error);
      processIncorrectAnswer();
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, question.id, answer, answerQuizQuestion, isSubmitting, processCorrectAnswer, processIncorrectAnswer]);


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
    handleSubmit,
    setAnswer,
    isQuizCompleted: isQuizFinished,
    answer,
    isSubmitting,
  };
};