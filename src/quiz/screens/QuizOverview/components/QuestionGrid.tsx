import { QuestionListTile } from '@/src/quiz/screens/QuizOverview/components/QuestionListTile';
import { QuizQuestion } from '@/src/quiz/types';
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { QUIZ_LAYOUT } from '../constants/constants';

interface QuestionGridProps {
  questions: QuizQuestion[];
  itemWidth: number;
  onQuestionClick: (questionId: string) => void;
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({
  questions,
  itemWidth,
  onQuestionClick,
}) => {
  // Memoize the render function to prevent unnecessary re-renders
  const renderItem: ListRenderItem<QuizQuestion> = useCallback(
    ({ item }) => (
      <QuestionListTile
        item={item}
        itemWidth={itemWidth}
        onClick={onQuestionClick}
      />
    ),
    [itemWidth, onQuestionClick]
  );

  // Key extractor for better performance
  const keyExtractor = useCallback(
    (item: QuizQuestion) => item.id.toString(),
    []
  );

  // Memoize FlatList props
  const flatListProps = useMemo(
    () => ({
      numColumns: QUIZ_LAYOUT.numColumns as 3, // Type assertion für numColumns
      columnWrapperStyle: { 
        gap: QUIZ_LAYOUT.gap,
        justifyContent: 'center' as const, // Type assertion für justifyContent
      },
      contentContainerStyle: { 
        gap: QUIZ_LAYOUT.gap,
        justifyContent: 'flex-start' as const, // Type assertion für justifyContent
        alignItems: 'center' as const, // Type assertion für alignItems
        flexGrow: 1,
      },
      showsVerticalScrollIndicator: false,
      // Performance-Optimierungen
      removeClippedSubviews: true,
      maxToRenderPerBatch: 10,
      updateCellsBatchingPeriod: 50,
      initialNumToRender: 20,
      windowSize: 5,
      lazy: true,
    }),
    []
  );

  return (
    <FlatList
      data={questions}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...flatListProps}
    />
  );
};