import { HintsScreen } from "@/src/quiz/screens/Hints/HintsScreen";
import { useLocalSearchParams } from "expo-router";

export default function HintsRoute() {
	const { quizId, questionId } = useLocalSearchParams<{
		quizId: string;
		questionId: string;
	}>();

	return (
		<HintsScreen quizId={quizId || null} questionId={questionId || null} />
	);
}
