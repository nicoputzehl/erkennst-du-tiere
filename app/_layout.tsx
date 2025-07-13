import { Ubuntu_400Regular } from "@expo-google-fonts/ubuntu/400Regular";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/src/common/hooks/useColorScheme";
import { ToastContainer } from "@/src/quiz/components/ToastContainer";
import { QuizProvider } from "@/src/quiz/contexts/QuizProvider";
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';

export const DATABASE_NAME = 'quizzes';


export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({ Ubuntu_400Regular });
	const expoDb = openDatabaseSync(DATABASE_NAME);
	const db = drizzle(expoDb);
	const { success, error } = useMigrations(db, migrations);

	if (!loaded) {
		return null;
	}

	return (
		<Suspense fallback={<ActivityIndicator size="large" />}>
			<SQLiteProvider
				databaseName={DATABASE_NAME}
				options={{ enableChangeListener: true }}
				useSuspense>
				<QuizProvider>
					<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="index" options={{ headerShown: false }} />
							<Stack.Screen
								name="quiz/[quizId]/[questionId]/hints-modal"
								options={{
									presentation: "modal",
									headerShown: false,
									gestureEnabled: true,
									animationDuration: 300,
								}}
							/>
							<Stack.Screen name="+not-found" />
						</Stack>
						<StatusBar style="auto" />
						<ToastContainer />
					</ThemeProvider>
				</QuizProvider>
			</SQLiteProvider>
		</Suspense>
	);
}
