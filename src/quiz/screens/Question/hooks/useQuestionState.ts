import { useQuiz } from "@/src/quiz/contexts/QuizProvider";
import { useMemo } from "react";
import { QuestionScreenProps } from "../QuestionScreen";

export const useQuestionState = ({quizId, questionId}:QuestionScreenProps) => {
  const { getQuizState } = useQuiz();
  const { quizState, question, isLoading } = useMemo(() => {
    if (!quizId || !questionId) {
      return { quizState: null, question: null, isLoading: false };
    }

    const state = getQuizState(quizId);
    const questionNumber = parseInt(questionId);

    if (isNaN(questionNumber)) {
      return { quizState: state, question: null, isLoading: false };
    }

    const foundQuestion = state?.questions.find((q) => q.id === questionNumber);

    return {
      quizState: state,
      question: foundQuestion,
      isLoading: false,
    };
  }, [quizId, questionId, getQuizState]);

  return { quizState, question, isLoading };
};