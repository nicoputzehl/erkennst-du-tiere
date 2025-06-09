import { useHints } from "@/src/quiz/store/hooks/useHints";
import { ScrollView, StyleSheet } from "react-native";
import { AvailableHints } from "./AvailableHints";
import ReceivedHints from "./ReceivedHints";

interface HintsContentProps {
	quizId: string;
	questionId: string;
}

export const HintsContent: React.FC<HintsContentProps> = ({
	quizId,
	questionId,
}) => {
	const { usedHints } = useHints(quizId, Number.parseInt(questionId));

	return (
		<ScrollView style={styles.container}>
			<ReceivedHints hints={usedHints} />
			<AvailableHints
				quizId={quizId}
				questionId={Number.parseInt(questionId)}
				onHintPurchased={() => {}}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
});
