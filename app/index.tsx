// app/index.tsx - Corrected
import { ErrorComponent } from "@/src/common/components/ErrorComponent";
import { LoadingComponent } from "@/src/common/components/LoadingComponent";
import { log } from "@/src/common/helper/logging";
import QuizzesScreen from "@/src/quiz/screens/Quizzes/QuizzesScreen";
import { useLoading } from "@/src/quiz/store"; // Assuming this provides app-wide loading status
import { useQuiz } from "@/src/quiz/store/hooks/useQuiz";

export default function QuizzesRoute() {
	// These properties are now available directly from the store,
	// as QuizProvider ensures they are loaded before QuizzesRoute renders.
	const { quizzes } = useQuiz();
	const { isLoading } = useLoading("initialization"); // Still relevant for specific async ops

	// Logging for debugging the final state
	log(
		`[QuizzesRoute] Rendering. Quizzes count: ${quizzes.length}, IsLoading (from useLoading): ${isLoading}`,
	);

	// The main loading check now happens in QuizProvider.
	// This 'isLoading' here would be for *additional* loading states
	// that occur *after* initial app startup, e.g., fetching new quizzes from a server.
	if (isLoading) {
		return <LoadingComponent message="Zusätzliche Daten werden geladen..." />;
	}

	// Show error if no quizzes are found (this should ideally not happen if initial load is successful)
	if (quizzes.length === 0) {
		return (
			<ErrorComponent message="Keine Quizzes gefunden. Bitte App neu starten oder prüfen Sie Ihre Konfiguration." />
		);
	}

	return <QuizzesScreen quizzes={quizzes} />;
}
