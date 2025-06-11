import { ErrorComponent } from "@/src/common/components/ErrorComponent";
import { HintsScreen } from "@/src/quiz/screens/Hints/HintsScreen";
import { useLocalSearchParams } from "expo-router";

export default function HintsModalRoute() {
	const { quizId, questionId } = useLocalSearchParams<{
		quizId: string;
		questionId: string;
	}>();

	if (!quizId || !questionId) {
		return <ErrorComponent message="Quiz oder Frage-ID fehlt" />;
	}

	return <HintsScreen quizId={quizId} questionId={questionId} />;
}
