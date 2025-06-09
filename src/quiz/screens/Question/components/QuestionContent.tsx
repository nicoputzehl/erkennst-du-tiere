import type { Question } from "@/src/quiz/types";
import type React from "react";
import { memo } from "react";
import {
	Animated,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import { ImageType, useImageDisplay } from "../../../hooks/useImageDisplay";
import { useKeyboardHandling } from "../hooks/useKeyboardHandling";
import { AnswerInput } from "./AnswerInput";
import { QuestionImage } from "./QuestionImage";
import { QuestionResult } from "./QuestionResult/QuestionResult";

interface QuestionProps {
	quizId: string;
	questionId: string;
	question: Question;
	answer: string;
	setAnswer: (answer: string) => void;
	isSubmitting: boolean;
	showResult: boolean;
	isCorrect: boolean;
	statusChanged: boolean;
	isSolved: boolean;
	onSubmit: () => void;
	onTryAgain: () => void;
	onBack: () => void;
	// NEUE PROPS für purchased hints (dauerhaft)
	purchasedHints?: string[];
}

export const QuestionContent: React.FC<QuestionProps> = memo(
	({
		question,
		answer,
		setAnswer,
		isSubmitting,
		showResult,
		isCorrect,
		statusChanged,
		isSolved,
		onSubmit,
		onTryAgain,
		onBack,
		purchasedHints,
	}) => {
		const { imageHeight } = useKeyboardHandling({ initialImageHeight: 400 });
		const { getImageUrl } = useImageDisplay(question);

		return (
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<View style={{ flex: 1, justifyContent: "space-between" }}>
					<View>
						<Animated.View
							style={[styles.imageContainer, { height: imageHeight }]}
						>
							<QuestionImage
								imageUrl={getImageUrl(ImageType.IMG)}
								thumbnailUrl={getImageUrl(ImageType.THUMBNAIL)}
								animatedHeight={imageHeight}
							/>
						</Animated.View>
					</View>

					{!showResult && !isSolved && (
						<AnswerInput
							value={answer}
							onChangeText={setAnswer}
							onSubmitEditing={onSubmit}
							isSubmitting={isSubmitting}
						/>
					)}

					{showResult && (
						<View style={styles.contentInner}>
							<QuestionResult
								isCorrect={isCorrect}
								funFact={question.funFact}
								wikipediaSlug={question.wikipediaName || question.answer}
								onBack={onBack}
								onTryAgain={onTryAgain}
								statusChanged={statusChanged}
								answer={question.answer}
							/>
						</View>
					)}
				</View>
			</KeyboardAvoidingView>
		);
	},
);

QuestionContent.displayName = "Question";

const styles = StyleSheet.create({
	imageContainer: {
		width: "100%",
		overflow: "hidden",
	},
	contentInner: {
		flex: 1,
		justifyContent: "space-between",
		minHeight: 200,
	},
	hintsButton: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 16,
		backgroundColor: "yellow",
	},
	hintsButtonText: {
		marginLeft: 8,
	},
});
