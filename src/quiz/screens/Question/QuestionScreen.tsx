import React, { useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/src/common/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import { useQuizState } from '@/src/quiz/contexts/QuizStateProvider';
import { isMultipleChoiceQuestion } from '@/src/quiz/domain/quizLogic';
import { MultipleChoiceQuestionScreen } from './MultipleChoice/MultipleChoiceQeustionScreen';
import { TextQuestionScreen } from './TextQuestion/TextQuestionScreen';

interface QuestionScreenProps {
  quizId: string | null;
  questionId: string | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  quizId,
  questionId,
}) => {
  const { getQuizState } = useQuizState();
  const navigation = useNavigation();
  
  // Memoize expensive calculations
  const { quizState, question, isLoading } = useMemo(() => {
    if (!quizId || !questionId) {
      return { quizState: null, question: null, isLoading: false };
    }

    const state = getQuizState(quizId);
    const questionNumber = parseInt(questionId);
    
    // Validate questionId is a valid number
    if (isNaN(questionNumber)) {
      return { quizState: state, question: null, isLoading: false };
    }

    const foundQuestion = state?.questions.find(q => q.id === questionNumber);
    
    return { 
      quizState: state, 
      question: foundQuestion, 
      isLoading: false // Could be true if quiz is still loading
    };
  }, [quizId, questionId, getQuizState]);

  // Memoize navigation title
  const navigationTitle = useMemo(() => {
    if (question?.status === 'solved') {
      return question.answer;
    }
    return 'Erkennst du das Tier?';
  }, [question?.status, question?.answer]);

  // Set navigation options
  useEffect(() => {
    navigation.setOptions({
      title: navigationTitle,
      headerShown: true,
      headerBackTitle: quizState?.title || 'Zurück',
      headerBackTitleVisible: false, // Cleaner look
    });
  }, [navigation, navigationTitle, quizState?.title]);

  // Memoize error component to prevent unnecessary re-renders
  const ErrorComponent = useCallback(({ message }: { message: string }) => (
    <ThemedView style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
    </ThemedView>
  ), []);

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>Frage wird geladen...</Text>
      </ThemedView>
    );
  }

  // Validation checks with memoized components
  if (!quizId || !questionId) {
    return <ErrorComponent message="Quiz oder Frage-ID fehlt" />;
  }

  if (!quizState) {
    return <ErrorComponent message="Quiz nicht gefunden" />;
  }

  if (!question) {
    return <ErrorComponent message="Frage nicht gefunden" />;
  }

  // Render appropriate question type
  if (isMultipleChoiceQuestion(question)) {
    return (
      <MultipleChoiceQuestionScreen
        quizId={quizId}
        questionId={questionId}
        question={question}
      />
    );
  }

  return (
    <TextQuestionScreen
      quizId={quizId}
      questionId={questionId}
      question={question}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#0a7ea4',
    textAlign: 'center',
  },
});