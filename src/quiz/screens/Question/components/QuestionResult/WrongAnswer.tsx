import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Button from '@/src/common/components/Button';

export type WrongAnswerProps = {
	onTryAgain: () => void;
};

const WrongAnswer = ({ onTryAgain }: WrongAnswerProps) => {
	return (
		<View>
			<Text style={[styles.resultText, { color: 'red' }]}>Leider falsch</Text>

			<View style={styles.buttonRow}>
				<Button
					text='Nochmal versuchen'
					onPress={onTryAgain}
					style={styles.tryAgainButton}
				/>
			</View>
		</View>
	);
};

export default WrongAnswer;

const styles = StyleSheet.create({
	resultText: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 20,
	},
	tryAgainButton: {
		flex: 1,
		backgroundColor: '#ff9800',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
});
