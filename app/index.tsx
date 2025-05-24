import { useQuizRegistry } from '@/src/quiz/contexts/QuizRegistryProvider';
import QuizzesScreen from '@/src/quiz/screens/Quizzes/Quizzes';
import { useMemo } from 'react';

export default function QuizzesRoute() {
	const { getAllQuizzes } = useQuizRegistry();

	const quizzes = useMemo(() => {
		return getAllQuizzes();
	}, [getAllQuizzes]);

	return <QuizzesScreen quizzes={quizzes} />;
}
