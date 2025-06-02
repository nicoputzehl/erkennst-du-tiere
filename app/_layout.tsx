// app/_layout.tsx - Simplified Provider Hierarchy (Schritt 5B)
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/common/hooks/useColorScheme';

import {
	PersistenceProvider,
	QuizDataProvider,
	QuizStateProvider,
	// UIStateProvider, // REMOVED: Now handled by Store Bridge
	QuizProvider,
} from '@/src/quiz';
import { QuizStoreProvider } from '@/src/stores/QuizStoreProvider';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	if (!loaded) {
		return null;
	}

	return (
		<PersistenceProvider>
			<QuizDataProvider>
				<QuizStateProvider>
					{/* UIStateProvider REMOVED - Now via QuizStoreProvider UI Store */}
					<QuizProvider>
						<QuizStoreProvider enableUIToasts={true}>
							<ThemeProvider
								value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
							>
								<Stack screenOptions={{ headerShown: false }}>
									<Stack.Screen
										name='index'
										options={{ headerShown: false }}
									/>
									<Stack.Screen name='+not-found' />
								</Stack>
								<StatusBar style='auto' />
							</ThemeProvider>
						</QuizStoreProvider>
					</QuizProvider>
					{/* UIStateProvider was here - REMOVED */}
				</QuizStateProvider>
			</QuizDataProvider>
		</PersistenceProvider>
	);
}