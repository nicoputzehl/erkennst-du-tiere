// app/_layout.tsx - Multi-Provider Architektur
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

// ✅ Multi-Provider Architektur
import { QuizDataProvider } from '@/src/quiz/contexts/QuizDataProvider';
import { QuizStateProvider } from '@/src/quiz/contexts/QuizStateProvider';
import { UIStateProvider } from '@/src/quiz/contexts/UIStateProvider';
import { QuizProvider } from '@/src/quiz/contexts/QuizProvider';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	if (!loaded) {
		return null;
	}

	return (
		<QuizDataProvider>     
			<QuizStateProvider>  
				<UIStateProvider>  
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
				</UIStateProvider>
			</QuizStateProvider>
		</QuizDataProvider>
	);
}