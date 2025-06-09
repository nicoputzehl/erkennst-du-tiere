import { memo, useCallback } from "react";
import { Text, TouchableOpacity, View, type ViewStyle } from "react-native";
import { styles } from "./QuizCard.styles";
import type { QuizCardViewProps } from "./QuizCard.types";
import { QuizCardProgress } from "./QuizCardProgress";
import {
	LoadingOverlay,
	LockIcon,
	QuizCardImage,
	UnlockProgress,
} from "./components";

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
		const handlePress = useCallback(() => {
			if (variant === "active" && onPress) {
				onPress(quiz.id);
			}
		}, [variant, onPress, quiz.id]);

		const getCardStyle = useCallback((): ViewStyle[] => {
			const baseStyle: ViewStyle[] = [styles.quizCardOuter];

			if (variant === "locked") {
				baseStyle.push(styles.locked);
			} else {
				if (!quizCardProgressString) baseStyle.push(styles.new);
				if (isLoading) baseStyle.push(styles.loadingCard);
			}

			return baseStyle;
		}, [variant, quizCardProgressString, isLoading]);

		const renderStartItem = () => {
			if (variant === "locked") {
				return (
					<View style={styles.quizCardStartItem}>
						<LockIcon />
					</View>
				);
			}

			return (
				<View style={styles.quizCardStartItem}>
					<QuizCardImage quiz={quiz} />
				</View>
			);
		};

		const renderProgress = () => {
			if (variant === "locked") {
				return <UnlockProgress unlockProgress={unlockProgress} />;
			}

			return (
				<View style={styles.activeProgressContainer}>
					<QuizCardProgress
						quizCardProgress={quizCardProgress ?? 0}
						quizCardProgressString={quizCardProgressString ?? null}
					/>
				</View>
			);
		};

		const content = (
			<View style={styles.quizCardInner}>
				{renderStartItem()}
				<View style={styles.quizCardContent}>
					<Text style={styles.quizTitle} numberOfLines={2}>
						{quiz.title}
					</Text>
					{renderProgress()}
				</View>
			</View>
		);

		if (variant === "locked") {
			return <View style={getCardStyle()}>{content}</View>;
		}

		return (
			<TouchableOpacity
				style={getCardStyle()}
				onPress={handlePress}
				disabled={isLoading}
				activeOpacity={0.8}
			>
				{isLoading ? <LoadingOverlay /> : content}
			</TouchableOpacity>
		);
	},
);

QuizCardContent.displayName = "QuizCardView";
