import { ErrorComponent } from '@/src/common/components/ErrorComponent';
import { LoadingComponent } from '@/src/common/components/LoadingComponent';
import { ThemedView } from '@/src/common/components/ThemedView';
import { QuizProgress } from '@/src/quiz/screens/Quiz/components/QuizProgress';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { QuestionGrid } from './components/QuestionGrid';
import { QUIZ_LAYOUT } from './constants/constants';
import { useQuizScreen } from './hooks/useQuizScreen';
import { calculateItemWidth } from './utils/utils';
import Header from '@/src/common/components/Header';

interface QuizScreenProps {
	quizId: string | null;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ quizId }) => {
	const {
		quizState,
		isLoading,
		error,
		handleQuestionClick,
		getQuizProgress,
		navigateBack,
	} = useQuizScreen(quizId);
	const itemWidth = calculateItemWidth();

	const renderLoadingState = () => (
		<LoadingComponent message='Quiz wird geladen...' />
	);

	const renderErrorState = () => (
		<ErrorComponent message={error || 'Quiz nicht gefunden'} />
	);

	const renderQuizContent = () => (
		<ThemedView
			style={styles.container}
			gradientType='primary'
		>
			<Header
				showBackButton
				onBackPress={navigateBack}
				title={quizState!.title}
			/>
			<View style={styles.scrollContent}>
				<QuestionGrid
					questions={quizState!.questions}
					itemWidth={itemWidth}
					onQuestionClick={handleQuestionClick}
				/>
			</View>
			<QuizProgress
				completed={quizState!.completedQuestions}
				total={quizState!.questions.length}
				progress={getQuizProgress(quizState!.id)}
			/>
		</ThemedView>
	);

	if (isLoading) return renderLoadingState();
	if (error || !quizState) return renderErrorState();

	return renderQuizContent();
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: QUIZ_LAYOUT.padding,
	},
	scrollContent: {
		flex: 1,
		padding: QUIZ_LAYOUT.padding,
		justifyContent: 'center',
	},
});
