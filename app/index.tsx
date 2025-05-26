// app/index.tsx - Korrigierte Version
import { useQuiz } from '@/src/quiz/contexts/QuizProvider';
import QuizzesScreen from '@/src/quiz/screens/Quizzes/Quizzes';
import { LoadingComponent } from '@/src/common/components/LoadingComponent';
import { ErrorComponent } from '@/src/common/components/ErrorComponent';
import { useMemo } from 'react';

export default function QuizzesRoute() {
	const { getAllQuizzes, isLoading, isInitializing, initialized } = useQuiz();

	const quizzes = useMemo(() => {
		if (!initialized) {
			console.log('[QuizzesRoute] Not yet initialized, returning empty array');
			return [];
		}
		
		const allQuizzes = getAllQuizzes();
		console.log(`[QuizzesRoute] Got ${allQuizzes.length} quizzes`);
		return allQuizzes;
	}, [getAllQuizzes, initialized]);

	// Zeige Loading während der Initialisierung
	if (isInitializing) {
		return <LoadingComponent message="App wird initialisiert..." />;
	}

	// Wenn initialisiert aber keine Quizzes gefunden
	if (initialized && quizzes.length === 0) {
		return <ErrorComponent message="Keine Quizzes gefunden. Bitte App neu starten." />;
	}

	// Zeige Loading für andere Ladevorgänge
	if (isLoading) {
		return <LoadingComponent message="Quizzes werden geladen..." />;
	}

	return <QuizzesScreen quizzes={quizzes} />;
}