// app/_layout.tsx - Aktualisierte Version
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
import { QuizDataProvider } from '@/src/quiz/contexts/QuizDataProvider'; // ✅ NEU
import { QuizProvider } from '@/src/quiz/contexts/QuizProvider'; // ⚠️ Wird später vereinfacht
import { ToastProvider } from '@/src/quiz/contexts/ToastProvider';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	if (!loaded) {
		return null;
	}

	return (
		<ToastProvider>
			<QuizDataProvider>
				<QuizProvider>
					<ThemeProvider
						value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
					>
						<Stack>
							<Stack.Screen name='index' options={{ headerShown: false }} />
							<Stack.Screen name='+not-found' />
						</Stack>
						<StatusBar style='auto' />
					</ThemeProvider>
				</QuizProvider>
			</QuizDataProvider>
		</ToastProvider>
	);
}
