import { ThemedText } from "@/src/common/components/ThemedText";
import { memo } from "react";
import { View } from "react-native";
import { styles } from "../../quizCard.styles";
import type { UnlockProgressProps } from "../../quizCard.types";

export const UnlockConditionText = memo(
	({ unlockProgress }: UnlockProgressProps) => {
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

UnlockConditionText.displayName = "UnlockConditionText";
