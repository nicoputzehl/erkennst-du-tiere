import { useLocalSearchParams } from "expo-router";
import { QuestionScreen } from "@/src/quiz/screens/Question/QuestionScreen";

export default function QuestionRoute() {
	const { quizId, questionId } = useLocalSearchParams<{
		quizId: string;
		questionId: string;
	}>();

	return (
		<QuestionScreen quizId={quizId || null} questionId={questionId || null} />
	);
}
