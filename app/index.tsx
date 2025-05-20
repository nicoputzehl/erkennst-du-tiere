import { useMemo } from 'react';
import QuizStartScreen from '@/src/quiz/screens/QuizStart/QuizStart';
import { useQuizRegistry } from '@/src/quiz/contexts/QuizRegistryProvider';

export default function QuizScreen() {
	const { getAllQuizzes } = useQuizRegistry();

	const quizzes = useMemo(() => {
		return getAllQuizzes();
	}, [getAllQuizzes]);

	return <QuizStartScreen quizzes={quizzes} />;
}
