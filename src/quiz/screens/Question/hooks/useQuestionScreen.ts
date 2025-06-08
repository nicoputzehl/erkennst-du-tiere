// src/quiz/screens/Question/hooks/useQuestionScreen.ts - ENHANCED VERSION
import { useUI } from "@/src/quiz/store";
import { useQuiz } from "@/src/quiz/store/hooks/useQuiz";
import { QuestionStatus } from "@/src/quiz/types";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useHints } from "../../../store/hooks/useHints";
import { useQuestionHints } from "./useQuestionHints";

export function useQuestionScreen(quizId: string, questionId: string) {
  const { getQuizState, answerQuestion } = useQuiz();
  const { showSuccess } = useUI();
  const {
    resetContextualHints,
    setContextualHintContent,
    setIsContextualHintVisible,
    setAutoFreeHintContent,
    setIsAutoFreeHintVisible,
    contextualHintContent,
    isContextualHintVisible,
    handleContextualHintClose,
    autoFreeHintContent,
    isAutoFreeHintVisible,
    handleAutoFreeHintClose,
    purchasedHints,
    handleHintPurchased,
  } = useQuestionHints();
  const { recordWrongAnswer, getAutoFreeHints, markAutoFreeHintAsUsed } =
    useHints(quizId, Number.parseInt(questionId));

  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const quizState = getQuizState(quizId);
  const question = quizState?.questions.find(
    (q) => q.id === Number.parseInt(questionId),
  );

  const isSolved = question?.status === QuestionStatus.SOLVED;

  useState(() => {
    if (isSolved) {
      setShowResult(true);
      setIsCorrect(true);
    }
  });



  const navigateToHints = useCallback(() => {
    router.push(`/quiz/${quizId}/${questionId}/hints`);
  }, [quizId, questionId]);


  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !answer.trim() || !question) return;
    resetContextualHints();
    console.log("[useQuestionScreen] Submitting answer:", answer);
    setIsSubmitting(true);

    try {
      const result = await answerQuestion(quizId, question.id, answer.trim());

      console.log("[useQuestionScreen] Answer result:", {
        isCorrect: result.isCorrect,
      });

      if (result.isCorrect) {
        setIsCorrect(true);
        setShowResult(true);
        setStatusChanged(true);

        // Show toasts for unlocked quizzes
        if (result.unlockedQuizzes.length > 0) {
          result.unlockedQuizzes.forEach((unlockedQuiz, index) => {
            setTimeout(() => {
              showSuccess(`🎉 "${unlockedQuiz.title}" freigeschaltet!`, 4000);
            }, index * 500);
          });
        }
      } else {
        console.log(
          "[useQuestionScreen] Wrong answer - checking for all hint types",
        );

        // ERWEITERTE LOGIK: Handle both contextual and auto-free hints
        const { contextualHints, autoFreeHints } = recordWrongAnswer(
          answer.trim(),
        );

        console.log("[useQuestionScreen] Triggered hints:", {
          contextual: contextualHints.length,
          autoFree: autoFreeHints.length,
        });

        // Handle contextual hints (existing logic)
        if (contextualHints.length > 0) {
          console.log("[useQuestionScreen] Showing contextual hint");
          setContextualHintContent(contextualHints[0].content);
          setIsContextualHintVisible(true);

          setTimeout(() => {
            showSuccess(
              `💡 ${contextualHints.length} neuer Tipp verfügbar!`,
              2000,
            );
          }, 500);

          setAnswer("");
        }
        // NEUE LOGIK: Handle auto-free hints
        else if (autoFreeHints.length > 0) {
          console.log("[useQuestionScreen] Showing auto-free hint");
          const autoFreeHint = autoFreeHints[0];

          // WICHTIG: Hint als verwendet markieren
          markAutoFreeHintAsUsed(quizId, Number.parseInt(questionId), autoFreeHint.id);

          setAutoFreeHintContent(autoFreeHint.content);
          setIsAutoFreeHintVisible(true);

          setTimeout(() => {
            showSuccess("🎁 Kostenloser Hinweis freigeschaltet!", 2000);
          }, 500);

          setAnswer("");
        }
        // No hints triggered - show wrong answer screen
        else {
          console.log(
            "[useQuestionScreen] No hints triggered - showing wrong answer screen",
          );
          setIsCorrect(false);
          setShowResult(true);
        }
      }
    } catch (error) {
      console.error("[useQuestionScreen] Error submitting answer:", error);
      setIsCorrect(false);
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    answer,
    question,
    resetContextualHints,
    answerQuestion,
    quizId,
    showSuccess,
    recordWrongAnswer,
    setContextualHintContent,
    setIsContextualHintVisible,
    markAutoFreeHintAsUsed,
    questionId,
    setAutoFreeHintContent,
    setIsAutoFreeHintVisible,
  ]);

  const handleTryAgain = useCallback(() => {
    console.log("[useQuestionScreen] Try again pressed");
    setShowResult(false);
    setAnswer("");
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
    navigateToHints,
    // Actions
    handleSubmit,
    handleTryAgain,
    handleBack,

    // EXISTING Contextual Hints
    contextualHintContent,
    isContextualHintVisible,
    handleContextualHintClose,

    // NEUE Auto-Free Hints
    autoFreeHintContent,
    isAutoFreeHintVisible,
    handleAutoFreeHintClose,

    // NEUE Purchased Hints (dauerhaft)
    purchasedHints,
    handleHintPurchased,
  };
}
