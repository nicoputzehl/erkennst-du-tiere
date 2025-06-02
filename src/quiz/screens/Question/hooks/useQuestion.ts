import { useQuiz } from '@/src/quiz/contexts/QuizProvider';
import { QuestionStatus, QuizQuestion, QuizState } from '@/src/quiz/types'; // Vereinfachte Types ohne Generics
import { useUIStoreBridge } from '../../../../stores/useUIStoreBridge';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

export const useQuestion = (
  quizId: string,
  question: QuizQuestion
) => {
  const isSolved = question.status === QuestionStatus.SOLVED;
  const { getQuizState, updateQuizState, answerQuizQuestion } = useQuiz();
const uiStoreBridge = useUIStoreBridge();
  const [showResult, setShowResult] = useState(isSolved);
  const [isCorrect, setIsCorrect] = useState(isSolved);
  const [initialQuestionStatus] = useState<QuestionStatus>(question.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const quizState = getQuizState(quizId);
  const quizTitle = useMemo(() => quizState?.title, [quizState]);

  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showUnsolvedImages = useMemo(() =>
    question.status !== 'solved' && (question.images.unsolvedImageUrl || question.images.unsolvedThumbnailUrl),
    [question]
  );

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
      console.error(`[useQuestion] Error updating quiz state:`, error);
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
      console.log(`[useQuestion] Submitting answer for quiz ${quizId}, question ${question.id}`);

      const result = await answerQuizQuestion(
        quizId,
        question.id,
        answer.trim()
      );

      console.log(`[useQuestion] Answer result:`, {
        isCorrect: result.isCorrect,
        hasUnlocks: result.unlockedQuizzes?.length || 0
      });

      if (result.isCorrect && result.newState) {
        processCorrectAnswer(result.newState);

        // TOAST FÜR FREIGESCHALTETE QUIZZES IN QUESTION-ANSICHT
        if (result.unlockedQuizzes && result.unlockedQuizzes.length > 0) {
          console.log(`[useQuestion] Showing toasts for ${result.unlockedQuizzes.length} unlocked quiz(zes)`);

          // Zeige Toast für jedes freigeschaltete Quiz
          result.unlockedQuizzes.forEach((unlockedQuiz, index) => {
            console.log(`[useQuestion] Scheduling toast for "${unlockedQuiz.title}" with delay ${index * 500}ms`);

            // Delay für mehrere Toasts, damit sie nacheinander erscheinen
            setTimeout(() => {
              console.log(`[useQuestion] Showing toast for "${unlockedQuiz.title}"`);
              uiStoreBridge.showSuccessToast(
                `🎉 Neues Quiz "${unlockedQuiz.title}" wurde freigeschaltet!`,
                4000
              );
            }, index * 500); // 500ms Delay zwischen mehreren Toasts
          });
        } else {
          console.log(`[useQuestion] No quizzes were unlocked by this answer`);
        }
      } else {
        processIncorrectAnswer();
      }
    } catch (error) {
      console.error(`[useQuestion] Error submitting answer:`, error);
      processIncorrectAnswer();
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, question.id, answer, answerQuizQuestion, isSubmitting, processCorrectAnswer, processIncorrectAnswer, uiStoreBridge]);

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
    showUnsolvedImages,
    quizTitle
  };
};