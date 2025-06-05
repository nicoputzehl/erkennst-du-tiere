// src/quiz/screens/Question/hooks/useQuestionScreen.ts - FIXED with proper hint timing

import { useUI } from '@/src/quiz/store';
import { useQuiz } from '@/src/quiz/store/hooks/useQuiz';
import { QuestionStatus } from '@/src/quiz/types';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useHints } from '../../../store/hooks/useHints';

export function useQuestionScreen(quizId: string, questionId: string) {
  const { getQuizState, answerQuestion } = useQuiz();
  const { showSuccess } = useUI();
  const { recordWrongAnswer } = useHints(quizId, parseInt(questionId));
  
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

    console.log('[useQuestionScreen] Submitting answer:', answer);
    setIsSubmitting(true);
    
    try {
      // WICHTIG: FIRST check if answer will be wrong and record for contextual hints
      // We need to do this BEFORE the actual answer processing
      const result = await answerQuestion(quizId, question.id, answer.trim());
      
      console.log('[useQuestionScreen] Answer result:', { isCorrect: result.isCorrect });
      
      if (!result.isCorrect) {
        // ONLY record wrong answer if it's actually wrong
        console.log('[useQuestionScreen] Recording wrong answer for contextual hints:', answer);
        const triggeredHints = recordWrongAnswer(answer.trim());
        console.log('[useQuestionScreen] Triggered contextual hints:', triggeredHints.length);
        
        if (triggeredHints.length > 0) {
          // Show a brief message about triggered hints
          setTimeout(() => {
            showSuccess(`💡 Neuer Tipp verfügbar!`, 2000);
          }, 1000);
        }
      }
      
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
      
      // Even on error, try to record wrong answer for hints
      if (answer.trim()) {
        console.log('[useQuestionScreen] Recording wrong answer on error for hints:', answer);
        recordWrongAnswer(answer.trim());
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, question, answer, answerQuestion, isSubmitting, showSuccess, recordWrongAnswer]);

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
    handleBack
  };
}