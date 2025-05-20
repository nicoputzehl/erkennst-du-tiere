import { QuestionListTile } from '@/src/quiz/screens/QuizOverview/components/QuestionListTile';
import { QuizQuestion } from '@/src/quiz/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
	return (
		<View style={styles.gridContainer}>
			{questions.map((item) => (
				<QuestionListTile
					key={item.id}
					item={item}
					itemWidth={itemWidth}
					onClick={onQuestionClick}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	gridContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: QUIZ_LAYOUT.gap,
	},
});
