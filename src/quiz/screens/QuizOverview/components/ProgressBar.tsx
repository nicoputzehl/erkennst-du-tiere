import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
	progress: number;
	total: number;
	completed: number;
}

export const ProgressBar = ({
	progress,
	total,
	completed,
}: ProgressBarProps) => {
	return (
		<View style={styles.progressContainer}>
			<View style={styles.progressLabelContainer}>
				<Text style={styles.progressLabel}>
					{completed} / {total} Fragen
				</Text>
				<Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
			</View>
			<View style={styles.progressBarBackground}>
				<View style={[styles.progressBarFill, { width: `${progress}%` }]} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	progressContainer: {
		padding: 16,
		backgroundColor: '#f8f9fa',
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef',
	},
	progressLabelContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	progressLabel: {
		fontSize: 14,
		color: '#6c757d',
		fontWeight: '500',
	},
	progressPercentage: {
		fontSize: 14,
		color: '#6c757d',
		fontWeight: '500',
	},
	progressBarBackground: {
		height: 8,
		backgroundColor: '#e9ecef',
		borderRadius: 4,
		overflow: 'hidden',
	},
	progressBarFill: {
		height: '100%',
		backgroundColor: '#28a745',
		borderRadius: 4,
	},
});
