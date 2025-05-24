import { Quiz } from '@/src/quiz/types';
import { useQuizzes } from '../../hooks/useQuizzes';
import { ActiveQuizCard } from './ActiveQuizCard';
import { LockedQuizCard } from './LockedQuizCard';

// Factory-Funktion, die die richtige Komponente basierend auf dem Quiz-Status zurückgibt
export const QuizCard = ({ quiz }: { quiz: Quiz }) => {
	const {
		getUnlockInfo,
		isLoading,
		navigateToQuiz,
		getQuizProgress,
		getQuizProgressString,
	} = useQuizzes();
	const unlockInfo = quiz.initiallyLocked ? getUnlockInfo(quiz.id) : null;
	const isLocked = quiz.initiallyLocked && !unlockInfo?.isMet;

	if (isLocked) {
		return <LockedQuizCard quiz={quiz} unlockProgress={unlockInfo} />;
	}

	return (
		<ActiveQuizCard
			quiz={quiz}
			isLoading={isLoading}
			onPress={navigateToQuiz}
			quizCardProgress={getQuizProgress(quiz.id)}
			quizCardProgressString={getQuizProgressString(quiz.id)}
		/>
	);
};
