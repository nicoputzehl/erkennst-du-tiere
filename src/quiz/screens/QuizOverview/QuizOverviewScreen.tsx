import { ProgressBar } from '@/src/quiz/screens/QuizOverview/components/ProgressBar';
import { ThemedView } from '@/src/common/components/ThemedView';
import React from 'react';
import { StyleSheet, Text, ActivityIndicator, View
} from 'react-native';
import { QuestionGrid } from './components/QuestionGrid';
import { QUIZ_LAYOUT } from './constants/constants';
import { useQuizOverview } from './hooks/useQuizOverview';
import { calculateItemWidth } from './utils/utils';

interface QuizOverviewScreenProps {
	quizId: string | null;
}

export const QuizOverviewScreen: React.FC<QuizOverviewScreenProps> = ({
	quizId,
}) => {
	const { quizState, isLoading, error, handleQuestionClick, getQuizProgress } =
		useQuizOverview(quizId);
	const itemWidth = calculateItemWidth();

	// Loading-Zustand anzeigen
	if (isLoading) {
		return (
			<ThemedView style={styles.centeredContainer}>
				<ActivityIndicator size='large' color='#0a7ea4' />
				<Text style={styles.loadingText}>Quiz wird geladen...</Text>
			</ThemedView>
		);
	}

	// Fehler-Zustand anzeigen
	if (error) {
		return (
			<ThemedView style={styles.centeredContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</ThemedView>
		);
	}

	// Fehlende Quiz-Zustand behandeln
	if (!quizState) {
		return (
			<ThemedView style={styles.centeredContainer}>
				<Text style={styles.errorText}>Quiz nicht gefunden</Text>
			</ThemedView>
		);
	}
	return (
		<ThemedView style={styles.container}>
			<ProgressBar
				completed={quizState.completedQuestions}
				total={quizState.questions.length}
				progress={getQuizProgress(quizState.id)}
			/>
			<View
				style={styles.scrollContent}
			>
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
	scrollView: {
	},
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
