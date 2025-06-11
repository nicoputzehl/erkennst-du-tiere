import { useUI } from "@/src/quiz/store";
import { useHints } from "@/src/quiz/store/hooks/useHints";
import { useQuiz } from "@/src/quiz/store/hooks/useQuiz";
import type { Question } from "@/src/quiz/types";
import { useCallback } from "react";
import type { WrongAnswerHint } from "../Question.types";

interface UseQuestionBusinessLogicProps {
  quizId: string;
  questionId: string;
  question: Question | undefined;
  answerState: {
    answer: string;
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
    setSubmittedAnswer: (value: boolean) => void;
  };
  resultState: {
    handleShowHint: (hint: WrongAnswerHint) => void;
    setIsCorrect: (value: boolean) => void;
    setShowResult: (value: boolean) => void;
    setStatusChanged: (value: boolean) => void;
  };
}

export const useQuestionBusinessLogic = ({
  quizId,
  questionId,
  question,
  answerState,
  resultState,
}: UseQuestionBusinessLogicProps) => {
  const { answerQuestion } = useQuiz();
  const { showSuccess } = useUI();
  const { recordWrongAnswer, markHintAsUsed } = useHints(
    quizId,
    Number.parseInt(questionId),
  );

  const handleCorrectAnswer = useCallback(async (result: any) => {
    resultState.setIsCorrect(true);
    resultState.setShowResult(true);

    setTimeout(() => {
      resultState.setStatusChanged(true);
    }, 500);

    // Handle unlock notifications
    if (result.unlockedQuizzes.length > 0) {
      result.unlockedQuizzes.forEach((unlockedQuiz: any, index: number) => {
        setTimeout(() => {
          showSuccess(`🎉 "${unlockedQuiz.title}" freigeschaltet!`, 4000);
        }, (index + 1) * 500);
      });
    }
  }, [resultState, showSuccess]);

const handleIncorrectAnswer = useCallback(async (userAnswer: string) => {
  const { contextualHints, autoFreeHints } = recordWrongAnswer(userAnswer);

  console.log("[handleIncorrectAnswer] User answer:", userAnswer);
  console.log("[handleIncorrectAnswer] Contextual hints:", contextualHints);
  console.log("[handleIncorrectAnswer] Auto free hints:", autoFreeHints);

  let hintShown = false; // Flag to track if a hint was shown

  if (contextualHints.length > 0) {
    const contextualHint = contextualHints[0];
    markHintAsUsed(quizId, Number.parseInt(questionId), contextualHint.id);
    resultState.handleShowHint({ ...contextualHint });
    hintShown = true;
  } else if (autoFreeHints.length > 0) {
    const autoFreeHint = autoFreeHints[0];
    markHintAsUsed(quizId, Number.parseInt(questionId), autoFreeHint.id);
    resultState.handleShowHint({ ...autoFreeHint });
    hintShown = true;
  }

  resultState.setIsCorrect(false);

  // Only set setShowResult to true if no hint was shown
  if (!hintShown) {
    resultState.setShowResult(true);
  }
}, [recordWrongAnswer, markHintAsUsed, quizId, questionId, resultState]);


  const handleSubmit = useCallback(async () => {
    if (answerState.isSubmitting || !answerState.answer.trim() || !question) return;

    answerState.setIsSubmitting(true);

    try {
      const result = await answerQuestion(quizId, question.id, answerState.answer.trim());

      if (result.isCorrect) {
        await handleCorrectAnswer(result);
      } else {
        await handleIncorrectAnswer(answerState.answer.trim());
      }
    } catch (error) {
      console.error("[useQuestionBusinessLogic] Error submitting answer:", error);
      resultState.setIsCorrect(false);
      resultState.setShowResult(true);
    } finally {
      answerState.setIsSubmitting(false);
      answerState.setSubmittedAnswer(true)
    }
  }, [
    answerState,
    question,
    answerQuestion,
    quizId,
    resultState,
    handleCorrectAnswer,
    handleIncorrectAnswer,
  ]);

  return { handleSubmit };
};