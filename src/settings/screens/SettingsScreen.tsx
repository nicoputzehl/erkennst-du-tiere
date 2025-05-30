// src/settings/screens/SettingsScreen.tsx - Korrigierte Version
import Header from '@/src/common/components/Header';
import { ThemedView } from '@/src/common/components/ThemedView';
import { useQuiz } from '@/src/quiz/contexts/QuizProvider';
import React, { useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { router } from 'expo-router';

export function SettingsScreen() {
	const {
		resetQuiz,
		getAllQuizzes,
		clearAllData,
		showSuccessToast,
		showErrorToast,
	} = useQuiz();

	const [isResetting, setIsResetting] = useState<Record<string, boolean>>({});
	const [isResettingAll, setIsResettingAll] = useState(false);

	const quizzes = getAllQuizzes();

	const handleResetQuiz = async (quizId: string) => {
		setIsResetting(prev => ({ ...prev, [quizId]: true }));

		try {
			await resetQuiz(quizId);
			showSuccessToast(
				`Quiz "${
					quizzes.find(q => q.id === quizId)?.title || quizId
				}" zurückgesetzt!`
			);
		} catch (error) {
			console.error(`[SettingsScreen] Error resetting quiz ${quizId}:`, error);
			showErrorToast(`Fehler beim Zurücksetzen: ${error}`);
		} finally {
			setIsResetting(prev => ({ ...prev, [quizId]: false }));
		}
	};

	const handleResetAllQuizzes = async () => {
		Alert.alert(
			'Alle Quizzes zurücksetzen?',
			'Möchtest du wirklich alle Quiz-Fortschritte zurücksetzen?',
			[
				{ text: 'Abbrechen', style: 'cancel' },
				{
					text: 'Zurücksetzen',
					style: 'destructive',
					onPress: async () => {
						setIsResettingAll(true);
						try {
							await clearAllData();
							showSuccessToast('Alle Quizzes wurden zurückgesetzt!');
						} catch (error) {
							showErrorToast(`Fehler: ${error}`);
						} finally {
							setIsResettingAll(false);
						}
					},
				},
			]
		);
	};

	return (
		<ThemedView style={styles.container}>
			<Header
				title='Einstellungen'
				showBackButton
				onBackPress={() => router.back()}
			/>
			<ScrollView style={styles.scrollView}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Quiz-Fortschritte zurücksetzen
					</Text>

					<TouchableOpacity
						style={[
							styles.resetAllButton,
							isResettingAll && styles.disabledButton,
						]}
						onPress={handleResetAllQuizzes}
						disabled={isResettingAll}
					>
						{isResettingAll ? (
							<ActivityIndicator
								size='small'
								color='#fff'
							/>
						) : (
							<Text style={styles.resetAllButtonText}>
								Alle Quizzes zurücksetzen
							</Text>
						)}
					</TouchableOpacity>

					{quizzes.map(quiz => (
						<TouchableOpacity
							key={quiz.id}
							style={[
								styles.quizResetButton,
								isResetting[quiz.id] && styles.disabledButton,
							]}
							onPress={() => handleResetQuiz(quiz.id)}
							disabled={isResetting[quiz.id]}
						>
							{isResetting[quiz.id] ? (
								<ActivityIndicator
									size='small'
									color='#fff'
								/>
							) : (
								<Text style={styles.quizResetButtonText}>
									{quiz.title} zurücksetzen
								</Text>
							)}
						</TouchableOpacity>
					))}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>App-Informationen</Text>
					<Text style={styles.infoText}>Version: 1.0.0</Text>
					<Text style={styles.infoText}>© 2025 Erkennst du: Tiere?</Text>
				</View>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	scrollView: {
		flex: 1,
	},
	section: {
		marginBottom: 24,
		padding: 16,
		backgroundColor: '#f8f9fa',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e9ecef',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	resetAllButton: {
		backgroundColor: '#dc3545',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 16,
	},
	resetAllButtonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 16,
	},
	quizResetButton: {
		backgroundColor: '#6c757d',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 8,
	},
	quizResetButtonText: {
		color: 'white',
		fontWeight: '500',
	},
	disabledButton: {
		opacity: 0.6,
	},
	infoText: {
		fontSize: 14,
		color: '#6c757d',
		marginBottom: 8,
	},
	backButton: {
		fontSize: 16,
		color: '#0a7ea4',
	},
});
