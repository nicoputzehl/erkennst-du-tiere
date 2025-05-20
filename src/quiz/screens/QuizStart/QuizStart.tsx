// src/quiz/screens/QuizStart/QuizStart.tsx
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ThemedView } from '@/src/common/components/ThemedView';
import { Quiz } from '../../types';
import { QuizGrid } from './components/QuizGrid';

type QuizStarterScreenProps = {
  quizzes: Quiz[]
}

export default function QuizStartScreen({ quizzes }: QuizStarterScreenProps) {
  return (
    <ThemedView>
      <Text style={styles.headerTitle}>Erkennst du: Tiere</Text>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <QuizGrid quizzes={quizzes} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
  },
});