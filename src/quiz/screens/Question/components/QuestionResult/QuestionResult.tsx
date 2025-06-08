import { View, StyleSheet } from 'react-native';
import WrongAnswer, { type WrongAnswerProps } from './WrongAnswer';
import RightAnswer, { type RightAnswerProps } from './RightAnswer';

export interface QuestionResultProps
	extends WrongAnswerProps,
		RightAnswerProps {
	isCorrect: boolean;
	
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