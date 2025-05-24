import { memo } from 'react';
import { ThemedView } from './ThemedView';
import { Text, StyleSheet } from 'react-native';

export const ErrorComponent = memo(
	({ message }: { message: string }) => {
		return (
			<ThemedView style={styles.container}>
				<Text style={styles.errorText}>{message}</Text>
			</ThemedView>
		);
	},
	(prevProps, nextProps) => {
		return prevProps.message === nextProps.message;
	}
);
ErrorComponent.displayName = 'ErrorComponent';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	errorText: {
		fontSize: 16,
		color: '#dc3545',
		textAlign: 'center',
		marginBottom: 16,
	},
});
