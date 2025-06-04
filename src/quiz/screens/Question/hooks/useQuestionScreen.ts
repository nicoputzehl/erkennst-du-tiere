import { useUI } from '@/src/quiz/store';
import { useQuiz } from '@/src/quiz/store/hooks/useQuiz';
import { QuestionStatus } from '@/src/quiz/types';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';

export function useQuestionScreen(quizId: string, questionId: string) {
  const { getQuizState, answerQuestion } = useQuiz();
  const { showSuccess } = useUI();
  
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const quizState = getQuizState(quizId);
  const question = quizState?.questions.find(q => q.id === parseInt(questionId));
  
  const isSolved = question?.status === QuestionStatus.SOLVED;
  
  // Initialize state based on question status
  useState(() => {
    if (isSolved) {
      setShowResult(true);
      setIsCorrect(true);
    }
  });

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !answer.trim() || !question) return;

    setIsSubmitting(true);
    
    try {
      const result = await answerQuestion(quizId, question.id, answer.trim());
      
      setIsCorrect(result.isCorrect);
      setShowResult(true);
      
      if (result.isCorrect) {
        setStatusChanged(true);
        
        // Show toasts for unlocked quizzes
        if (result.unlockedQuizzes.length > 0) {
          result.unlockedQuizzes.forEach((unlockedQuiz, index) => {
            setTimeout(() => {
              showSuccess(`🎉 "${unlockedQuiz.title}" freigeschaltet!`, 4000);
            }, index * 500);
          });
        }
      }
    } catch (error) {
      console.error('[useQuestionScreen] Error submitting answer:', error);
      setIsCorrect(false);
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, question, answer, answerQuestion, isSubmitting, showSuccess]);

  const handleTryAgain = useCallback(() => {
    setShowResult(false);
    setAnswer('');
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return {
    // State
    quizState,
    question,
    answer,
    setAnswer,
    isSubmitting,
    showResult,
    isCorrect,
    statusChanged,
    isSolved,
    
    // Actions
    handleSubmit,
    handleTryAgain,
    handleBack
  };
}