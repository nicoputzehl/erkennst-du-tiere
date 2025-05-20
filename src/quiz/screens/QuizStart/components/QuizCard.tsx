import { useQuizDisplay } from '@/src/quiz/screens/QuizStart/context/QuizDisplayContex';
import { Quiz } from '@/src/quiz/types';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

// Komponente für aktive Quizzes
export const ActiveQuizCard = ({ quiz }: { quiz: Quiz }) => {
	const { getQuizProgress, getQuizProgressString, navigateToQuiz, isLoading } =
		useQuizDisplay();

	// Progress berechnen mit Fallback auf 0
	const progressPercentage = quiz ? getQuizProgress(quiz.id) : 0;
	const progressText = quiz ? getQuizProgressString(quiz.id) : null;

	// Stil basierend auf Fortschritt bestimmen
	const getProgressColor = (percentage: number): string => {
		if (percentage <= 25) return '#ff5722';
		else if (percentage <= 50) return '#ff9800';
		else if (percentage <= 75) return '#ffc107';
		else if (percentage < 100) return '#8bc34a';
		else return '#4caf50';
	};

	// Debug-Ausgabe
	useEffect(() => {
		console.log(
			`[ActiveQuizCard] Quiz ${quiz.id} progress: ${progressPercentage}%`
		);
	}, [quiz.id, progressPercentage]);

	return (
		<TouchableOpacity
			key={quiz.id}
			style={[
				styles.quizCard,
				!progressText && styles.new,
				isLoading && styles.loadingCard, // Stil für Ladevorgang
			]}
			onPress={() => navigateToQuiz(quiz.id)}
			disabled={isLoading} // Während des Ladens deaktivieren
		>
			{/* Loading-Indikator für Ladevorgang */}
			{isLoading ? (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size='small' color='#fff' />
				</View>
			) : (
				<>
					{/* Progress gradient */}
					<LinearGradient
						colors={[
							getProgressColor(progressPercentage),
							getProgressColor(progressPercentage),
							'transparent',
						]}
						style={styles.progressGradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						locations={[0, progressPercentage / 100, progressPercentage / 100]}
					/>

					<Text style={styles.quizTitle}>{quiz.title}</Text>

					{progressText ? (
						<Text style={styles.progressText}>{progressText}</Text>
					) : (
						<Text style={styles.newText}>Neu</Text>
					)}
				</>
			)}
		</TouchableOpacity>
	);
};
// Komponente für gesperrte Quizzes - behält das ursprüngliche Layout bei
export const LockedQuizCard = ({ quiz }: { quiz: Quiz }) => {
	const { getUnlockInfo } = useQuizDisplay();
	const unlockInfo = getUnlockInfo(quiz.id);

	return (
		<View style={styles.lockedContainer}>
			{/* Erste Karte mit Titel und Schloss */}
			<View style={[styles.quizCard, styles.locked]}>
				<Text style={[styles.quizTitle, styles.lockedText]}>
					{quiz.title} {'🔒'}
				</Text>
			</View>

			{/* Zweite Karte mit Bedingungen */}
			<View style={[styles.quizCard, styles.locked]}>
				{unlockInfo?.condition && (
					<View style={styles.unlockInfo}>
						<Text>{unlockInfo.condition.description}</Text>
						<Text style={styles.unlockProgress}>
							Fortschritt: {unlockInfo.progress.toFixed(0)}
							{unlockInfo.condition.type === 'percentage'
								? '%'
								: unlockInfo.condition.type === 'completionCount'
								? ` von ${unlockInfo.condition.requiredCount}`
								: ''}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
};

// Factory-Funktion, die die richtige Komponente basierend auf dem Quiz-Status zurückgibt
export const QuizCard = ({ quiz }: { quiz: Quiz }) => {
	const { getUnlockInfo } = useQuizDisplay();
	const unlockInfo = quiz.initiallyLocked ? getUnlockInfo(quiz.id) : null;
	const isLocked = quiz.initiallyLocked && !unlockInfo?.isMet;

	if (isLocked) {
		return <LockedQuizCard quiz={quiz} />;
	}

	return <ActiveQuizCard quiz={quiz} />;
};

const styles = StyleSheet.create({
	lockedContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
	},
	quizCard: {
		backgroundColor: '#f5f5f5',
		padding: 16,
		borderRadius: 8,
		flex: 1,
		height: 100,
		maxWidth: '47%',
		minWidth: '47%',
	},
	quizTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8,
		zIndex: 1,
	},
	progressGradient: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.3,
	},
	progressText: {
		fontSize: 14,
		color: '#666',
		zIndex: 1,
	},
	new: {
		borderStyle: 'dotted',
		borderColor: 'red',
		borderWidth: 2,
	},
	locked: {
		backgroundColor: '#e0e0e0',
		opacity: 0.6,
	},
	lockedText: {
		color: '#666',
	},
	unlockInfo: {
		marginTop: 8,
	},
	unlockDescription: {
		fontSize: 12,
		color: '#888',
		fontStyle: 'italic',
	},
	unlockProgress: {
		fontSize: 12,
		color: '#666',
		fontWeight: '500',
		marginTop: 4,
	},
	loadingCard: {
		opacity: 0.8,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	newText: {
		fontSize: 14,
		color: '#ff9800',
		fontWeight: '500',
	},
});
