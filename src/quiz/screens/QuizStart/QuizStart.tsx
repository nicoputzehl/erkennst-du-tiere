import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native';
import { ThemedView } from '@/src/common/components/ThemedView';
import { Quiz } from '../../types';
import { QuizGrid } from './components/QuizGrid';
import { useState, useEffect } from 'react';
import { useQuizState } from '@/src/quiz/contexts/QuizStateProvider';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

type QuizStarterScreenProps = {
	quizzes: Quiz[];
};

export default function QuizStartScreen({ quizzes }: QuizStarterScreenProps) {
	const handleNavigateToSettings = () => {
		router.push('/settings');
	};
	const { initializeQuizState } = useQuizState();
	const [isLoading, setIsLoading] = useState(true);

	// Initialisiere alle Quiz-Zustände beim Start
	useEffect(() => {
		const loadQuizStates = async () => {
			setIsLoading(true);
			try {
				console.log('[QuizStartScreen] Initializing quiz states...');

				// Initialisiere die Zustände aller Quizzes
				for (const quiz of quizzes) {
					await initializeQuizState(quiz.id);
				}

				console.log('[QuizStartScreen] All quiz states initialized');
			} catch (error) {
				console.error(
					'[QuizStartScreen] Error initializing quiz states:',
					error
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadQuizStates();
	}, [quizzes, initializeQuizState]);

	return (
		<ThemedView>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Erkennst du: Tiere</Text>
				<TouchableOpacity
					onPress={handleNavigateToSettings}
					style={styles.settingsButton}
				>
					<FontAwesome6 name='gear' size={24} color='#0a7ea4' />
				</TouchableOpacity>
			</View>

			{isLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size='large' color='#0a7ea4' />
					<Text style={styles.loadingText}>Quizzes werden geladen...</Text>
				</View>
			) : (
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
				>
					<QuizGrid quizzes={quizzes} />
				</ScrollView>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	settingsButton: {
		padding: 8,
	},
	scrollContent: {
		padding: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: '#0a7ea4',
	},
});
