import { useState, useCallback } from 'react';
import { useAnswerProcessor } from '@/src/quiz/contexts/AnswerProcessorProvider';
import { useBaseQuestionScreen } from '../hooks/useBaseQuestionScreen';
import { QuizQuestion } from '@/src/quiz/types';

export const useTextQuestionScreen = (
  quizId: string,
  questionId: string,
  question: QuizQuestion
) => {
  const { answerQuizQuestion } = useAnswerProcessor();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const baseHook = useBaseQuestionScreen(quizId, questionId, question);
  
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
        baseHook.processCorrectAnswer(result.newState);
      } else {
        baseHook.processIncorrectAnswer();
      }
    } catch (error) {
      console.error(`[useTextQuestionScreen] Error submitting answer:`, error);
      baseHook.processIncorrectAnswer();
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, question.id, answer, answerQuizQuestion, baseHook, isSubmitting]);
  
  return {
    ...baseHook,
    answer,
    setAnswer,
    handleSubmit,
    isSubmitting
  };
};