// src/quiz/screens/QuizStart/components/QuizGrid.tsx
import { QuizDisplayProvider } from '@/src/quiz/screens/QuizStart/context/QuizDisplayContex';
import { Quiz } from '@/src/quiz/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { QuizCard } from './QuizCard';


type QuizGridProps = {
  quizzes: Quiz[];
};

export const QuizGrid = ({ quizzes }: QuizGridProps) => {
  return (
    <QuizDisplayProvider>
      <View style={styles.grid}>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </View>
    </QuizDisplayProvider>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});