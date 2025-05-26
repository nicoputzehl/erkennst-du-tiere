import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { WikipediaLink } from '@/src/quiz/screens/Question/components/WikipediaLink';
import Button from '@/src/common/components/Button';
import { Lottie } from '../Lottie';

export type RightAnswerProps = {
	funFact?: string;
	onBack: () => void;
	wikipediaSlug: string;
	statusChanged: boolean;
	answer: string;
};

const RightAnswer = ({
	funFact,
	wikipediaSlug,
	onBack,
	statusChanged,
	answer,
}: RightAnswerProps) => {
	return (
		<View style={styles.container}>
			{statusChanged && <Lottie />}
			<View>
				<View style={styles.headlineWrapper}>
					{statusChanged ? (
						<Text style={[styles.resultText, { color: 'green' }]}>Richtig</Text>
					) : (
						<Text style={[styles.resultText]}>{answer}</Text>
					)}
					<WikipediaLink slug={wikipediaSlug} />
				</View>
				{funFact && (
					<>
						<Text style={styles.funFactHeader}>Wußtest du das ... </Text>
						<Text style={styles.funFact}>{funFact}</Text>
					</>
				)}
			</View>
			<View style={styles.buttonRow}>
				<Button
					text={'Zur Übersicht'}
					onPress={onBack}
					style={styles.nextQuestionButton}
				/>
			</View>
		</View>
	);
};

export default RightAnswer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	resultText: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
	},
	funFact: {
		fontSize: 16,
		marginBottom: 20,
	},
	funFactHeader: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 20,
	},
	nextQuestionButton: {
		flex: 1,
		backgroundColor: 'green',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	headlineWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});
