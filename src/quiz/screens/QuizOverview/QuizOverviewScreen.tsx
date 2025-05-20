import { ProgressBar } from '@/src/quiz/screens/QuizOverview/components/ProgressBar';
import { ThemedView } from '@/src/common/components/ThemedView';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { QuestionGrid } from './components/QuestionGrid';
import { QUIZ_LAYOUT } from './constants/constants';
import { useQuizOverview } from './hooks/useQuizOverview';
import { calculateItemWidth } from './utils/utils';

interface QuizOverviewScreenProps {
  quizId: string | null;
}

export const QuizOverviewScreen: React.FC<QuizOverviewScreenProps> = ({ quizId }) => {
  const { quizState, handleQuestionClick, getQuizProgress } = useQuizOverview(quizId);
  const itemWidth = calculateItemWidth();

  if (!quizState) {
    return (
      <ThemedView style={styles.container}>
        <Text>Quiz not found</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ProgressBar
        completed={quizState.completedQuestions}
        total={quizState.questions.length}
        progress={getQuizProgress(quizState.id)}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QuestionGrid
          questions={quizState.questions}
          itemWidth={itemWidth}
          onQuestionClick={handleQuestionClick}
        />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: QUIZ_LAYOUT.padding,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: QUIZ_LAYOUT.padding,
  },
});