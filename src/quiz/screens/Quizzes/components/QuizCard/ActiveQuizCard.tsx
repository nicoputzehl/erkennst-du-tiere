import { Quiz } from '@/src/quiz/types'; // Vereinfachte Types ohne Generics
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

type ActiveQuizCardProps = {
	quiz: Quiz; // Kein Generic!
	quizCardProgress: number;
	quizCardProgressString: string | null;
	onPress: (id: string) => void;
	isLoading: boolean;
};

export const ActiveQuizCard = ({
	quiz,
	onPress,
	isLoading,
	quizCardProgress,
	quizCardProgressString,
}: ActiveQuizCardProps) => {
	const getProgressColor = (percentage: number): string => {
		if (percentage <= 25) return '#ff5722';
		else if (percentage <= 50) return '#ff9800';
		else if (percentage <= 75) return '#ffc107';
		else if (percentage < 100) return '#8bc34a';
		else return '#4caf50';
	};

	useEffect(() => {
		console.log(
			`[ActiveQuizCard] Quiz ${quiz.id} progress: ${quizCardProgress}%`
		);
	}, [quizCardProgress, quiz.id]);

	return (
		<TouchableOpacity
			key={quiz.id}
			style={[
				styles.quizCard,
				!quizCardProgressString && styles.new,
				isLoading && styles.loadingCard,
			]}
			onPress={() => onPress(quiz.id)}
			disabled={isLoading}
		>
			{isLoading ? (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size='small' color='#fff' />
				</View>
			) : (
				<>
					<LinearGradient
						colors={[
							getProgressColor(quizCardProgress),
							getProgressColor(quizCardProgress),
							'transparent',
						]}
						style={styles.progressGradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						locations={[0, quizCardProgress / 100, quizCardProgress / 100]}
					/>

					<Text style={styles.quizTitle}>{quiz.title}</Text>

					{quizCardProgressString ? (
						<Text style={styles.progressText}>{quizCardProgressString}</Text>
					) : (
						<Text style={styles.newText}>Neu</Text>
					)}
				</>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
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