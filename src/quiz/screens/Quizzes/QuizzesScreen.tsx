import Header from "@/src/common/components/Header";
import { ThemedView } from "@/src/common/components/ThemedView";
import { FontSizes } from "@/src/common/constants/Styles";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import type { Quiz } from "../../types";
import { QuizGrid } from "./components/QuizGrid";
import { useQuizzesScreen } from "./hooks/useQuizzesScreen";
import { useCallback } from "react";
import { NavigationService } from "../../services/NavigationService";
import { useDatabase } from "@/db/DatabaseProvider";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { expoDatabase } from "@/db/client";


type QuizzesProps = {
	quizzes: Quiz[];
};

export default function QuizzesScreen({ quizzes }: QuizzesProps) {
	useQuizzesScreen();
	const { error, isReady, db } = useDatabase();
	useDrizzleStudio(expoDatabase);
	console.log({ error }, { isReady })

	const iconColor = useThemeColor({}, "icon");

	const handleNavigateToSettings = useCallback(() => NavigationService.toSettings(), []);

	const renderContent = () => (
		<ScrollView
			style={styles.scrollView}
			contentContainerStyle={styles.scrollContent}
			showsVerticalScrollIndicator={false}
		>
			<QuizGrid quizzes={quizzes} />
		</ScrollView>
	);

	return (
		<ThemedView style={styles.container} gradientType="primary">
			<Header
				title="Erkennst du: Tiere"
				titleType="defaultSemiBold"
				rightSlot={
					<TouchableOpacity
						onPress={handleNavigateToSettings}
						style={[styles.settingsButton, { shadowColor: iconColor }]}
						activeOpacity={0.7}
						accessibilityLabel="Einstellungen öffnen"
						accessibilityRole="button"
					>
						<FontAwesome6
							name="gear"
							size={FontSizes.xxl}
							color={iconColor}
						/>
					</TouchableOpacity>
				}
			/>

			{renderContent()}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	settingsButton: {
		padding: 10,
		borderRadius: 12,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
		alignItems: "center",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
		paddingTop: 8,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		textAlign: "center",
		opacity: 0.8,
	},
});
