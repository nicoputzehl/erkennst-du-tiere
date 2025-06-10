import { ThemedText } from "@/src/common/components/ThemedText";
import {
	CommonStyles,
	FontSizes,
	FontWeights,
	Spacing,
} from "@/src/common/constants/Styles";
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
	const textColor = useThemeColor({}, "tintOnGradient");

	return (
		<View style={styles.progressContainer}>
			<View style={styles.progressLabelContainer}>
				<ThemedText style={[styles.progressLabel, { color: textColor }]}>
					{completed} / {total}
				</ThemedText>
			</View>
			<ProgressIndicator progress={progress} />
		</View>
	);
};

const styles = StyleSheet.create({
	progressContainer: {
		padding: Spacing.lg,
		paddingHorizontal: Spacing.xxl,
	},
	progressLabelContainer: {
		...CommonStyles.centered,
		marginBottom: Spacing.md,
	},
	progressLabel: {
		fontSize: FontSizes.sm,
		fontWeight: FontWeights.normal,
	},
});
