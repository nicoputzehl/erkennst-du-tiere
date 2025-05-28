import { Quiz } from '@/src/quiz/types'; // Vereinfachte Types ohne Generics
import { useQuizzes } from '../../hooks/useQuizzes';
import { QuizCardActiveLong } from './QuizCardActiveLong';
import { QuizCardLockedLong } from './QuizCardLockedLong';

export const QuizCard = ({ quiz }: { quiz: Quiz }) => {
	const {
		getUnlockInfo,
		isLoading,
		navigateToQuiz,
		getQuizProgress,
		getQuizProgressString,
	} = useQuizzes();
	console.log(`[QuizCard] Rendering card for ${quiz.id} - ${quiz.title}`);
	console.debug('[QuizCard] unlockInfo:', getUnlockInfo(quiz.id));
	const unlockInfo = quiz.initiallyLocked ? getUnlockInfo(quiz.id) : null;
	const isLocked = quiz.initiallyLocked && !unlockInfo?.isMet;

	if (isLocked) {
		return <QuizCardLockedLong quiz={quiz} unlockProgress={unlockInfo} />;
	}

	return (
		<QuizCardActiveLong
			quiz={quiz}
			isLoading={isLoading}
			onPress={navigateToQuiz}
			quizCardProgress={getQuizProgress(quiz.id)}
			quizCardProgressString={getQuizProgressString(quiz.id)}
		/>
	);
};