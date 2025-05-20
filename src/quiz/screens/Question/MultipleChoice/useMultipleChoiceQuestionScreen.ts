import { useCallback } from 'react';
import { useAnswerProcessor } from '@/src/quiz/contexts/AnswerProcessorProvider';
import { useBaseQuestionScreen } from '../hooks/useBaseQuestionScreen';
import { QuizMultipleChoiceQuestion } from '@/src/quiz/types';

export const useMultipleChoiceQuestionScreen = (
  quizId: string,
  questionId: string,
  question: QuizMultipleChoiceQuestion
) => {
  const { answerQuizQuestion } = useAnswerProcessor();
  
  const baseHook = useBaseQuestionScreen(quizId, questionId, question);
  
  const handleChoiceSelect = useCallback((choice: string) => {
    const result = answerQuizQuestion(
      quizId,
      question.id,
      choice
    );
    
    if (result.isCorrect && result.newState) {
      baseHook.processCorrectAnswer(result.newState);
    } else {
      baseHook.processIncorrectAnswer();
    }
  }, [quizId, question.id, answerQuizQuestion, baseHook]);
  
  return {
    ...baseHook,
    choices: question.choices || [],
    handleChoiceSelect
  };
};