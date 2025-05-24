import React, { useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/src/common/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import { useQuizState } from '@/src/quiz/contexts/QuizStateProvider';
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
  
  const { quizState, question, isLoading } = useMemo(() => {
    if (!quizId || !questionId) {
      return { quizState: null, question: null, isLoading: false };
    }

    const state = getQuizState(quizId);
    const questionNumber = parseInt(questionId);
    
    if (isNaN(questionNumber)) {
      return { quizState: state, question: null, isLoading: false };
    }

    const foundQuestion = state?.questions.find(q => q.id === questionNumber);
    
    return { 
      quizState: state, 
      question: foundQuestion, 
      isLoading: false
    };
  }, [quizId, questionId, getQuizState]);

  const navigationTitle = useMemo(() => {
    if (question?.status === 'solved') {
      return question.answer;
    }
    return 'Erkennst du das Tier?';
  }, [question?.status, question?.answer]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: quizState?.title || 'Zurück',
      title: "",
      headerBackTitleVisible: false,
    });
  }, [navigation, navigationTitle, quizState?.title]);

  const ErrorComponent = useCallback(({ message }: { message: string }) => (
    <ThemedView style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
    </ThemedView>
  ), []);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>Frage wird geladen...</Text>
      </ThemedView>
    );
  }

  if (!quizId || !questionId) {
    return <ErrorComponent message="Quiz oder Frage-ID fehlt" />;
  }

  if (!quizState) {
    return <ErrorComponent message="Quiz nicht gefunden" />;
  }

  if (!question) {
    return <ErrorComponent message="Frage nicht gefunden" />;
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