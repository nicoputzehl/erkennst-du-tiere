// src/quiz/screens/Quizzes/components/QuizCard/QuizCard.tsx - FINAL FIXED VERSION
import { Quiz } from '@/src/quiz/types';
import { useQuizzes } from '../../hooks/useQuizzes';
import { QuizCardView } from './QuizCardView';
import { useUnlockSystem } from '@/src/quiz/hooks/useUnlockSystem';

export const QuizCard = ({ quiz }: { quiz: Quiz }) => {
  const {
    isLoading,
    navigateToQuiz,
    getQuizProgress,
    getQuizProgressString,
  } = useQuizzes();

  const { getUnlockProgress, isQuizUnlocked } = useUnlockSystem();
  
  
  const isLocked = !isQuizUnlocked(quiz.id);
  
  const unlockInfo = isLocked ? getUnlockProgress(quiz.id) : undefined;

  return (
    <QuizCardView
      quiz={quiz}
      variant={isLocked ? 'locked' : 'active'}
      onPress={!isLocked ? navigateToQuiz : undefined}
      isLoading={!isLocked ? isLoading : false}
      quizCardProgress={!isLocked ? getQuizProgress(quiz.id) : null}
      quizCardProgressString={!isLocked ? getQuizProgressString(quiz.id) : null}
      unlockProgress={unlockInfo}
    />
  );
};