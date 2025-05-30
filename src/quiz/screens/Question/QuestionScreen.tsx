import { Question } from './components/Question';
import { useQuestionState } from './hooks/useQuestionState';
import { ErrorComponent } from '@/src/common/components/ErrorComponent';
import { LoadingComponent } from '@/src/common/components/LoadingComponent';

export interface QuestionScreenProps {
	quizId: string | null;
	questionId: string | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
	quizId,
	questionId,
}) => {
  const {quizState, question, isLoading} = useQuestionState({quizId, questionId});



	if (isLoading) {
		return (
			<LoadingComponent message='Frage wird geladen...' />
		);
	}

	if (!quizId || !questionId) {
		return <ErrorComponent message='Quiz oder Frage-ID fehlt' />;
	}

	if (!quizState) {
		return <ErrorComponent message='Quiz nicht gefunden' />;
	}

	if (!question) {
		return <ErrorComponent message='Frage nicht gefunden' />;
	}

	return (
		<Question
			quizId={quizId}
			questionId={questionId}
			question={question}
		/>
	);
};
