import { QuestionListTile } from '@/src/quiz/screens/Quiz/components/QuestionListTile';
import { QuizQuestion } from '@/src/quiz/types'; // Vereinfachte Types ohne Generics
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

  const keyExtractor = useCallback(
    (item: QuizQuestion) => item.id.toString(),
    []
  );

  const flatListProps = useMemo(
    () => ({
      numColumns: QUIZ_LAYOUT.numColumns as 3,
      columnWrapperStyle: { 
        gap: QUIZ_LAYOUT.gap,
        justifyContent: 'center' as const,
      },
      contentContainerStyle: { 
        gap: QUIZ_LAYOUT.gap,
        justifyContent: 'flex-start' as const,
        alignItems: 'center' as const,
        flexGrow: 1,
      },
      showsVerticalScrollIndicator: false,
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