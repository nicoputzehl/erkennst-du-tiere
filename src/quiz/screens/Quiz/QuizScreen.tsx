import { ErrorComponent } from '@/src/common/components/ErrorComponent';
import { LoadingComponent } from '@/src/common/components/LoadingComponent';
import { ThemedView } from '@/src/common/components/ThemedView';
import { ProgressBar } from '@/src/quiz/screens/Quiz/components/ProgressBar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { QuestionGrid } from './components/QuestionGrid';
import { QUIZ_LAYOUT } from './constants/constants';
import { useQuizScreen } from './hooks/useQuizScreen';
import { calculateItemWidth } from './utils/utils';

interface QuizScreenProps {
	quizId: string | null;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
	quizId,
}) => {
	const { quizState, isLoading, error, handleQuestionClick, getQuizProgress } =
		useQuizScreen(quizId);
	const itemWidth = calculateItemWidth();

	if (isLoading) {
		return <LoadingComponent message='Quiz wird geladen...' />;
	}

	if (error) {
		return <ErrorComponent message={error} />;
	}

	if (!quizState) {
		return <ErrorComponent message='Quiz nicht gefunden' />;
	}
	return (
		<ThemedView style={styles.container}>
			<ProgressBar
				completed={quizState.completedQuestions}
				total={quizState.questions.length}
				progress={getQuizProgress(quizState.id)}
			/>
			<View style={styles.scrollContent}>
				<QuestionGrid
					questions={quizState.questions}
					itemWidth={itemWidth}
					onQuestionClick={handleQuestionClick}
				/>
			</View>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: QUIZ_LAYOUT.padding,
	},
	centeredContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: QUIZ_LAYOUT.padding,
	},
	scrollView: {},
	scrollContent: {
		flex: 1,
		padding: QUIZ_LAYOUT.padding,
		justifyContent: 'center',
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: '#0a7ea4',
	},
	errorText: {
		fontSize: 16,
		color: '#dc3545',
		textAlign: 'center',
	},
});
