import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
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
  
  const quizState = quizId ? getQuizState(quizId) : null;
  const question = quizState?.questions.find(q => q.id === parseInt(questionId!));
  
  useEffect(() => {
    navigation.setOptions({
      title: question?.status === 'solved' ? question.answer : 'Erkennst du das Tier?',
      headerShown: true,
      headerBackTitle: quizState?.title,
    });
  }, [navigation, question, quizState]);

  
  if (!quizId || !questionId) {
    return (
      <ThemedView style={styles.container}>
        <Text>Quiz oder Frage-ID fehlt</Text>
      </ThemedView>
    );
  }

  if (!quizState) {
    return (
      <ThemedView style={styles.container}>
        <Text>Quiz nicht gefunden</Text>
      </ThemedView>
    );
  }

  if (!question) {
    return (
      <ThemedView style={styles.container}>
        <Text>Frage nicht gefunden</Text>
      </ThemedView>
    );
  }

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
  },
});