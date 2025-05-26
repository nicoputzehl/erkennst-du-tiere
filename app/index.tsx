
import { useQuiz } from '@/src/quiz/contexts/QuizProvider';
import QuizzesScreen from '@/src/quiz/screens/Quizzes/Quizzes';
import { useMemo } from 'react';

export default function QuizzesRoute() {
	const { getAllQuizzes } = useQuiz();

	const quizzes = useMemo(() => {
		return getAllQuizzes();
	}, [getAllQuizzes]);

	return <QuizzesScreen quizzes={quizzes} />;
}
