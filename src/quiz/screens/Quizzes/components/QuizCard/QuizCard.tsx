import { Quiz } from '@/src/quiz/types';
import { useQuizzes } from '../../hooks/useQuizzes';
import { QuizCardView } from './QuizCardView';

export const QuizCard = ({ quiz }: { quiz: Quiz }) => {
  const {
    getUnlockInfo,
    isLoading,
    navigateToQuiz,
    getQuizProgress,
    getQuizProgressString,
  } = useQuizzes();

  const unlockInfo = quiz.initiallyLocked ? getUnlockInfo(quiz.id) : undefined;
  const isLocked = !!(quiz.initiallyLocked && !unlockInfo?.isMet);

  return (
    <QuizCardView
      quiz={quiz}
      variant={isLocked ? 'locked' : 'active'}
      // Active props
      onPress={!isLocked ? navigateToQuiz : undefined}
      isLoading={!isLocked ? isLoading : false}
      quizCardProgress={!isLocked ? getQuizProgress(quiz.id) : null}
      quizCardProgressString={!isLocked ? getQuizProgressString(quiz.id) : null}
      // Locked props
      unlockProgress={isLocked ? unlockInfo : undefined}
    />
  );
};