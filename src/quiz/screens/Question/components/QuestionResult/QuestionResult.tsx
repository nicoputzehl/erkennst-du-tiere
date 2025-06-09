import { StyleSheet, View } from "react-native";
import RightAnswer, { type RightAnswerProps } from "./RightAnswer";
import WrongAnswer, { type WrongAnswerProps } from "./WrongAnswer";

export interface QuestionResultProps
	extends WrongAnswerProps,
		RightAnswerProps {
	isCorrect: boolean;
	// TODO wenn falsch, aber AutoFreeHint gewonnen, dann den AutofreeHint nicht als Modal, sondern auf der Wrong Answer Seite anzeigen
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
