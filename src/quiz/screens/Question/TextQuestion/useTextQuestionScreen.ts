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
  
  const baseHook = useBaseQuestionScreen(quizId, questionId, question);
  
  const handleSubmit = useCallback(() => {
    const result = answerQuizQuestion(
      quizId,
      question.id,
      answer.trim()
    );
    
    if (result.isCorrect && result.newState) {
      baseHook.processCorrectAnswer(result.newState);
    } else {
      baseHook.processIncorrectAnswer();
    }
  }, [quizId, question.id, answer, answerQuizQuestion, baseHook]);
  
  return {
    ...baseHook,
    answer,
    setAnswer,
    handleSubmit
  };
};