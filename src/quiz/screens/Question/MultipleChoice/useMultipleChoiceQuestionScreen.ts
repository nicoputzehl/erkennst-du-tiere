import { useCallback, useState } from 'react';
import { useAnswerProcessor } from '@/src/quiz/contexts/AnswerProcessorProvider';
import { useBaseQuestionScreen } from '../hooks/useBaseQuestionScreen';
import { QuizMultipleChoiceQuestion } from '@/src/quiz/types';

export const useMultipleChoiceQuestionScreen = (
  quizId: string,
  questionId: string,
  question: QuizMultipleChoiceQuestion
) => {
  const { answerQuizQuestion } = useAnswerProcessor();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const baseHook = useBaseQuestionScreen(quizId, questionId, question);
  
  const handleChoiceSelect = useCallback(async (choice: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await answerQuizQuestion(
        quizId,
        question.id,
        choice
      );
      
      if (result.isCorrect && result.newState) {
        baseHook.processCorrectAnswer(result.newState);
      } else {
        baseHook.processIncorrectAnswer();
      }
    } catch (error) {
      console.error(`[useMultipleChoiceQuestionScreen] Error submitting choice:`, error);
      baseHook.processIncorrectAnswer();
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, question.id, answerQuizQuestion, baseHook, isSubmitting]);
  
  return {
    ...baseHook,
    choices: question.choices || [],
    handleChoiceSelect,
    isSubmitting
  };
};