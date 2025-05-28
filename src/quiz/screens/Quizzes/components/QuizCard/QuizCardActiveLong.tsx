import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { getProgressColor } from './quizCardUtils';
import { sharedStyles } from './styles';
import { QuizCardActiveProps } from './types';

export const QuizCardActiveLong = ({
	quiz,
	onPress,
	isLoading,
	quizCardProgress,
	quizCardProgressString,
}: QuizCardActiveProps) => {
	useEffect(() => {
		console.log(
			`[ActiveQuizCard] Quiz ${quiz.id} progress: ${quizCardProgress}%`
		);
	}, [quizCardProgress, quiz.id]);

	return (
		<TouchableOpacity
			key={quiz.id}
			style={[
				sharedStyles.quizCardLongOuter,
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
					{/* <LinearGradient
						colors={[
							getProgressColor(quizCardProgress),
							getProgressColor(quizCardProgress),
							'transparent',
						]}
						style={styles.progressGradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						locations={[0, quizCardProgress / 100, quizCardProgress / 100]}
					/> */}

					<View style={sharedStyles.quizCardLongInner}>
						<View style={sharedStyles.quizCardLongStartItem}>
							<Image
								source={require('@/assets/images/test-title.jpg')}
								contentFit='cover'
								cachePolicy='memory-disk'
								priority='high'
								placeholder={require('@/assets/images/placeholder.jpg')}
								placeholderContentFit='cover'
								onError={(error) => {
									console.warn(`Failed to load question image:`, error);
								}}
								allowDownscaling={true}
								style={styles.image}
							/>
						</View>
							<View style={sharedStyles.quizCardLongcontent}>
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

							<Text style={sharedStyles.quizTitle}>{quiz.title}</Text>

							{quizCardProgressString ? (
								<Text style={styles.progressText}>
									{quizCardProgressString}
								</Text>
							) : (
								<Text style={styles.newText}>Neu</Text>
							)}
						</View>
					</View>
				</>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: '100%',
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
		textAlign: 'right',
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
