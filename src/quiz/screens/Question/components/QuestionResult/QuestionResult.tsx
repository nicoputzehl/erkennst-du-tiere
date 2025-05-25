// src/quiz/screens/Question/components/QuestionResult.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import WrongAnswer, { WrongAnswerProps } from './WrongAnswer';
import RightAnswer, { RightAnswerProps } from './RightAnswer';

export interface QuestionResultProps
	extends WrongAnswerProps,
		RightAnswerProps {
	isCorrect: boolean;
	
}

export const QuestionResult: React.FC<QuestionResultProps> = ({
	isCorrect,
	...props
}) => {

	return (
		<View style={styles.container}>
			{isCorrect ? <RightAnswer {...props} /> : <WrongAnswer {...props} />}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
});
