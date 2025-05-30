import { useQuiz } from '@/src/quiz/contexts/QuizProvider';

import { QuizState } from '@/src/quiz/types';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

export const useQuizScreen = (quizId: string | null) => {
  const { loadQuiz, getQuizState, getQuizProgress } = useQuiz();


  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize quiz when component mounts
  useEffect(() => {
    const initializeQuiz = async () => {
      if (!quizId) {
        setError('Keine Quiz-ID angegeben');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log(`[useQuizScreen] Loading quiz: ${quizId}`);
        const state = await loadQuiz(quizId);
        if (state) {
          setQuizState(state);
          setError(null);
        } else {
          setError(`Quiz mit ID ${quizId} nicht gefunden`);
        }
      } catch (err) {
        console.error(`[useQuizScreen] Error loading quiz ${quizId}:`, err);
        setError(`Fehler beim Laden des Quiz: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuiz();
  }, [quizId, loadQuiz]);

  // Refresh quiz state when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (quizId) {
        const state = getQuizState(quizId);
        if (state) {
          setQuizState(state);
        }
      }
    }, [quizId, getQuizState])
  );


  // Handle question selection
  const handleQuestionClick = useCallback(
    (questionId: string) => {
      if (quizId) {
        router.navigate(`/quiz/${quizId}/${questionId}`);
      }
    },
    [quizId]
  );

  const navigateToQuizzes = useCallback(() => {
    router.back();
  }, []);


  return {
    quizState,
    isLoading,
    error,
    handleQuestionClick,
    getQuizProgress,
    navigateToQuizzes,
  };
};