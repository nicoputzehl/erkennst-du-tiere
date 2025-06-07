import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../QuizCard.styles";
import type { UnlockProgressProps } from "../QuizCard.types";

export const UnlockProgress = memo(
	({ unlockProgress }: UnlockProgressProps) => {
		if (!unlockProgress?.condition) return null;

		return (
			<View style={styles.progressSection}>
				<Text style={styles.unlockDescription} numberOfLines={2}>
					{unlockProgress.condition.description}
				</Text>
				<Text style={styles.unlockProgress}>
					Fortschritt: {Math.round(unlockProgress.progress)}%
				</Text>
			</View>
		);
	},
);

UnlockProgress.displayName = "UnlockProgress";
