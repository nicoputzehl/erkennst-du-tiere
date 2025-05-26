import { useQuiz } from '@/src/quiz/contexts/QuizProvider';
import { QuestionStatus, QuizQuestion, QuizState } from '@/src/quiz/types';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

export const useQuestion = (
  quizId: string,
  question: QuizQuestion
) => {
  const isSolved = question.status === QuestionStatus.SOLVED;
  const { getQuizState, updateQuizState, answerQuizQuestion } = useQuiz();

  const [showResult, setShowResult] = useState(isSolved);
  const [isCorrect, setIsCorrect] = useState(isSolved);
  const [initialQuestionStatus] = useState<QuestionStatus>(question.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const quizState = getQuizState(quizId);


  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showUnsolvedImages = useMemo(() => question.status !== 'solved' && question.images.unsolvedImageUrl || question.images.unsolvedThumbnailUrl, [question]);

  const processCorrectAnswer = useCallback(async (
    newState: QuizState
  ) => {
    setIsCorrect(true);
    setShowResult(true);
    setIsUpdating(true);
    setStatusChanged(true);

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

  const handleBack = useCallback(() => {
    router.back();
  }, []);

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
    handleBack,
    handleTryAgain,
    handleSubmit,
    setAnswer,
    answer,
    isSubmitting,
    statusChanged,
    showUnsolvedImages
  };
};