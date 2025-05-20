import { QuizOverviewScreen } from '@/src/quiz/screens/QuizOverview/QuizOverviewScreen';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/src/common/components/ThemedView';

export default function QuizOverviewRoute() {
	const { quizId } = useLocalSearchParams<{ quizId: string }>();
	const [isParsingParams, setIsParsingParams] = useState(true);

	useEffect(() => {
		// Einfacher Effekt, um den Initialzustand zu überbrücken
		setIsParsingParams(false);
	}, []);

	if (isParsingParams) {
		return (
			<ThemedView style={styles.loadingContainer}>
				<ActivityIndicator size='large' color='#0a7ea4' />
			</ThemedView>
		);
	}

	return <QuizOverviewScreen quizId={quizId || null} />;
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
