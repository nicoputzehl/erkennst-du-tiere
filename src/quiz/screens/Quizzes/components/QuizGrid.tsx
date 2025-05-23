import { Quiz } from '@/src/quiz/types';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { QuizCard } from './QuizCard/QuizCard';

type QuizGridProps = {
  quizzes: Quiz[];
};

export const QuizGrid = ({ quizzes }: QuizGridProps) => {
  // Debug-Logging
  useEffect(() => {
    console.log(`[QuizGrid] Rendering ${quizzes.length} quizzes`);
    quizzes.forEach(quiz => {
      console.log(`[QuizGrid] Quiz: ${quiz.id} - ${quiz.title}`);
    });
  }, [quizzes]);

  return (
      <View style={styles.grid}>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});