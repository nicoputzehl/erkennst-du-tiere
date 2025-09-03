import { ThemedText } from "@/src/common/components/ThemedText";
import { memo, useCallback, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { ContentWrapper } from "./components/ContentWrapper";

import { LoadingOverlay } from "./components/LoadingOverlay";
import { ProgressSection } from "./components/ProgressSection/ProgressSection";
import { StartItem } from "./components/StartItem/StartItem";
import { getQuizCardStyles } from "./getQuizCardStyle";

import type { QuizCardViewProps } from "./QuizCard.types";
import { styles } from "./QuizCard.styles";

export const QuizCardContent = memo(
	({
		quiz,
		variant,
		onPress,
		isLoading = false,
		quizCardProgress,
		quizCardProgressString,
		unlockProgress,
	}: QuizCardViewProps) => {
		const isNewCard = variant === "active" && !quizCardProgress;

		const handlePress = useCallback(() => {
			if (variant === "active" && onPress) {
				onPress(quiz.id);
			}
		}, [variant, onPress, quiz.id]);

		const descriptionText = useMemo(() => variant === "locked" ? unlockProgress?.condition?.description : quiz.description, [unlockProgress?.condition?.description, quiz.description, variant])

		const innerContent = (
			<View style={styles.quizCardInner}>
				<StartItem variant={variant} quiz={quiz} />
				<View style={styles.quizCardContent}>
					<View>

						<ThemedText style={styles.quizTitle} numberOfLines={2}>
							{quiz.title}
						</ThemedText>
						<ThemedText lightColor="red" darkColor="red" style={styles.description}>{descriptionText}</ThemedText>
					</View>
					<ProgressSection
						variant={variant}
						unlockProgress={unlockProgress}
						quizCardProgress={quizCardProgress}
						quizCardProgressString={quizCardProgressString}
					/>
				</View>
			</View>
		);

		if (variant === "locked") {
			return (
				<View style={getQuizCardStyles({ variant, isLoading })}>
					{innerContent}
				</View>
			);
		}

		return (
			<TouchableOpacity
				onPress={handlePress}
				disabled={isLoading}
				activeOpacity={0.8}
			>
				<ContentWrapper isLoading={isLoading} isNewCard={isNewCard}>
					{isLoading ? <LoadingOverlay /> : innerContent}
				</ContentWrapper>
			</TouchableOpacity>
		);
	},
);
QuizCardContent.displayName = "QuizCardView";
