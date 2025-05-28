import { StyleSheet, Text, View } from 'react-native';
import { sharedStyles } from './styles';
import { QuizCardLockedProps } from './types';
import { FontAwesome6 } from '@expo/vector-icons';

export const QuizCardLockedLong = ({
	quiz,
	unlockProgress,
}: QuizCardLockedProps) => {
	console.log('[LockedQuizCardLong] Rendering locked quiz card', {
		unlockProgress,
	});
	return (
		<View style={[sharedStyles.quizCardLongOuter, styles.locked]}>
			<View style={sharedStyles.quizCardLongInner}>
				<View style={sharedStyles.quizCardLongStartItem}>
					<FontAwesome6 name='question' size={48} color='blue' />
				</View>
				<View style={[sharedStyles.quizCardLongcontent]}>
					<Text style={[sharedStyles.quizTitle]}>{quiz.title}</Text>

					{unlockProgress?.condition && (
						<View>
							<Text style={styles.unlockDescription}>
								{unlockProgress.condition.description}
							</Text>
							<Text style={styles.unlockProgress}>
								Fortschritt: {unlockProgress.progress.toFixed(0)}%
							</Text>
						</View>
					)}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	locked: {
		backgroundColor: '#e0e0e0',

	},
	unlockDescription: {
		fontSize: 12,
	},
	unlockProgress: {
		fontSize: 12,
		fontWeight: '500',
		textAlign: 'right',
	},
});
