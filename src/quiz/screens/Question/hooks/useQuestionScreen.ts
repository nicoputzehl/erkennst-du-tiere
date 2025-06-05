// src/quiz/screens/Question/hooks/useQuestionScreen.ts - FIXED with proper hint integration

import { useUI } from '@/src/quiz/store';
import { useQuiz } from '@/src/quiz/store/hooks/useQuiz';
import { QuestionStatus } from '@/src/quiz/types';
import { router } from 'expo-router';
import {  useCallback, useState } from 'react';
import { useHints } from '../../../store/hooks/useHints';

export function useQuestionScreen(quizId: string, questionId: string) {
  const { getQuizState, answerQuestion } = useQuiz();
  const { showSuccess } = useUI();
  const { recordWrongAnswer, availableHints } = useHints(quizId, parseInt(questionId));

  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  const [isContextualHintVisible, setIsContextualHintVisible] = useState(false);
  const [contextualHintContent, setContextualHintContent] = useState<string>('');

  const handleContextualHintClose = useCallback(() => {
    setIsContextualHintVisible(false);
  }, []);


  const resetContextualHints = useCallback(() => {
    setContextualHintContent('');
  }, []);


  const quizState = getQuizState(quizId);
  const question = quizState?.questions.find(q => q.id === parseInt(questionId));

  const isSolved = question?.status === QuestionStatus.SOLVED;


  useState(() => {
    if (isSolved) {
      setShowResult(true);
      setIsCorrect(true);
    }
  });

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !answer.trim() || !question) return;
    resetContextualHints();
    console.log('[useQuestionScreen] Submitting answer:', answer);
    setIsSubmitting(true);

    try {
      const result = await answerQuestion(quizId, question.id, answer.trim());

      console.log('[useQuestionScreen] Answer result:', { isCorrect: result.isCorrect });

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
        console.log('[useQuestionScreen] Wrong answer - checking for contextual hints');
        const triggeredHints = recordWrongAnswer(answer.trim());
        console.log('[useQuestionScreen] Triggered contextual hints:', triggeredHints.length);

        if (triggeredHints.length > 0) {
          console.log('[useQuestionScreen] Hints triggered - not showing wrong answer screen');

          setContextualHintContent(triggeredHints[0].content);
          setIsContextualHintVisible(true);
          // Show hint notification and clear the input
          setTimeout(() => {
            showSuccess(`💡 ${triggeredHints.length} neuer Tipp verfügbar!`, 2000);
          }, 500);

          // Clear the answer so user can try again
          setAnswer('');
        } else {
          // No hints triggered - show wrong answer screen
          console.log('[useQuestionScreen] No hints triggered - showing wrong answer screen');
          setIsCorrect(false);
          setShowResult(true);
        }
      }
    } catch (error) {
      console.error('[useQuestionScreen] Error submitting answer:', error);
      setIsCorrect(false);
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, question, answer, answerQuestion, isSubmitting, showSuccess, recordWrongAnswer, setContextualHintContent, setIsContextualHintVisible, resetContextualHints]);

  const handleTryAgain = useCallback(() => {
    console.log('[useQuestionScreen] Try again pressed');
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
    handleBack,

    // HINTS
    contextualHintContent,
    isContextualHintVisible,
    handleContextualHintClose
  };
}