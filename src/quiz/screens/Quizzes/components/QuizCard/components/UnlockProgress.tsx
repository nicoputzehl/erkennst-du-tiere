import { ThemedText } from "@/src/common/components/ThemedText";
import { memo } from "react";
import { View } from "react-native";
import { styles } from "../QuizCard.styles";
import type { UnlockProgressProps } from "../QuizCard.types";

export const UnlockProgress = memo(
	({ unlockProgress }: UnlockProgressProps) => {
		// TODO unlockProgress.progress kann evtl weg
		if (!unlockProgress?.condition) return null;

		return (
			<View style={styles.progressSection}>
				<ThemedText style={styles.unlockDescription} numberOfLines={2}>
					{unlockProgress.condition.description}
				</ThemedText>
			</View>
		);
	},
);

UnlockProgress.displayName = "UnlockProgress";
