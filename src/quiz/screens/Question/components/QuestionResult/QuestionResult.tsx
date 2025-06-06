// src/quiz/screens/Question/components/QuestionResult/QuestionResult.tsx - ENHANCED VERSION
import React from 'react';
import { View, StyleSheet } from 'react-native';
import WrongAnswer, { WrongAnswerProps } from './WrongAnswer';
import RightAnswer, { RightAnswerProps } from './RightAnswer';

export interface QuestionResultProps
	extends WrongAnswerProps,
		RightAnswerProps {
	isCorrect: boolean;
	
	// NEUE PROPS für purchased hints
	purchasedHintContent?: string;
	onShowPurchasedHint?: boolean;
}

export const QuestionResult: React.FC<QuestionResultProps> = ({
	isCorrect,
	...props
}) => {

	return (
		<View style={styles.container}>
			{isCorrect ? (
				<RightAnswer {...props} />
			) : (
				<WrongAnswer 
					{...props}
					// NEUE PROPS explizit für WrongAnswer
					purchasedHintContent={props.purchasedHintContent}
					onShowPurchasedHint={props.onShowPurchasedHint}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
});