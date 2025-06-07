// src/quiz/screens/Question/components/QuestionResult/QuestionResult.tsx - ENHANCED VERSION
import type React from "react";
import { View, StyleSheet } from "react-native";
import WrongAnswer, { type WrongAnswerProps } from "./WrongAnswer";
import RightAnswer, { type RightAnswerProps } from "./RightAnswer";

export interface QuestionResultProps
	extends WrongAnswerProps,
		RightAnswerProps {
	isCorrect: boolean;

	// NEUE PROPS für purchased hints (dauerhaft)
	purchasedHints?: string[];
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
					// NEUE PROPS explizit für WrongAnswer (dauerhaft)
					purchasedHints={props.purchasedHints}
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
