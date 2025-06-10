import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../QuizCard.styles";
import type { UnlockProgressProps } from "../QuizCard.types";

export const UnlockProgress = memo(
	({ unlockProgress }: UnlockProgressProps) => {
		// TODO unlockProgress.progress kann evtl weg
		if (!unlockProgress?.condition) return null;

		return (
			<View style={styles.progressSection}>
				<Text style={styles.unlockDescription} numberOfLines={2}>
					{unlockProgress.condition.description}
				</Text>
			</View>
		);
	},
);

UnlockProgress.displayName = "UnlockProgress";
