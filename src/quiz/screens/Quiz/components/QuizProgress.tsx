import { ThemedText } from "@/src/common/components/ThemedText";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { ProgressIndicator } from "@/src/quiz/components/ProgressIndicator";
import { StyleSheet, View } from "react-native";

interface QuizProgressProps {
	progress: number;
	total: number;
	completed: number;
}

export const QuizProgress = ({
	progress,
	total,
	completed,
}: QuizProgressProps) => {
	const textColor = useThemeColor({}, "text");

	const dynamicStyles = StyleSheet.create({
		progressContainer: {
			...styles.progressContainer,
			// backgroundColor: colorScheme === 'dark'
			//   ? 'rgba(255, 255, 255, 0.05)'
			//   : 'rgba(0, 0, 0, 0.03)',
			// borderTopWidth: 1,
			// borderTopColor: colorScheme === 'dark'
			//   ? 'rgba(255, 255, 255, 0.1)'
			//   : 'rgba(0, 0, 0, 0.1)',
		},
	});

	return (
		<View style={dynamicStyles.progressContainer}>
			<View style={styles.progressLabelContainer}>
				<ThemedText
					style={[
						styles.progressLabel,
						{ color: typeof textColor === "string" ? textColor : "#6c757d" },
					]}
				>
					{completed} / {total} Fragen
				</ThemedText>
				<ThemedText
					style={[
						styles.progressPercentage,
						{ color: typeof textColor === "string" ? textColor : "#6c757d" },
					]}
				>
					{Math.round(progress)}%
				</ThemedText>
			</View>
			<ProgressIndicator progress={progress} />
		</View>
	);
};

const styles = StyleSheet.create({
	progressContainer: {
		padding: 16,
	},
	progressLabelContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	progressLabel: {
		fontSize: 14,
		fontWeight: "500",
		opacity: 0.8,
	},
	progressPercentage: {
		fontSize: 14,
		fontWeight: "600",
		opacity: 0.9,
	},
});
