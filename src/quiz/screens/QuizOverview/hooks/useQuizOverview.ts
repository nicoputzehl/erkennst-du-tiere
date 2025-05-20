import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { QuizState } from '@/src/quiz/types';
import { useQuizState } from '@/src/quiz/contexts/QuizStateProvider';
import { useProgressTracker } from '@/src/quiz/contexts/ProgressTrackerProvider';
import { useQuiz } from '@/src/quiz/contexts/QuizProvider';

export const useQuizOverview = (quizId: string | null) => {
  const { startQuiz } = useQuiz();
  const { getQuizState, } = useQuizState();
  const { getQuizProgress, } = useProgressTracker();
  
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const navigation = useNavigation();

  // Initialize quiz when component mounts
  useEffect(() => {
    if (quizId) {
      const state = startQuiz(quizId);
      setQuizState(state);
    }
  }, [quizId, startQuiz]);

  // Refresh quiz state when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (quizId) {
        const state = getQuizState(quizId);
        if (state) setQuizState(state);
      }
    }, [quizId, getQuizState])
  );

  // Handle navigation options
  useEffect(() => {
    navigation.setOptions({
      title: quizState?.title,
      headerShown: true,
      headerBackTitle: 'Zurück',
      headerBackButtonDisplayMode: 'minimal',
    });
  }, [navigation, quizState]);

  // Handle question selection
  const handleQuestionClick = useCallback(
    (questionId: string) => {
      if (quizId) {
        router.navigate(`/quiz/${quizId}/${questionId}`);
      }
    },
    [quizId]
  );

  return {
    quizState,
    handleQuestionClick,
    getQuizProgress,
  };
};