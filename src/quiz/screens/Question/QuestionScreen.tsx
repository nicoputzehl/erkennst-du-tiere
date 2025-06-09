import { ErrorComponent } from "@/src/common/components/ErrorComponent";
import { LoadingComponent } from "@/src/common/components/LoadingComponent";
import { ThemedView } from "@/src/common/components/ThemedView";
import { useQuestionScreen } from "./hooks/useQuestionScreen";

import Header from "@/src/common/components/Header";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AnswerInput } from "./components/AnswerInput";
import { QuestionContentContainer } from "./components/QuestionContentContainer";
import { QuestionResult } from "./components/QuestionResult/QuestionResult";

export interface QuestionScreenProps {
	quizId: string | null;
	questionId: string | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
	quizId,
	questionId,
}) => {
	const {
		quizState,
		question,
		answer,
		setAnswer,
		isSubmitting,
		showResult,
		isCorrect,
		statusChanged,
		isSolved,
		handleSubmit,
		handleTryAgain,
		handleBack,
		navigateToHints,
		hint,
		isHintsLinkVisible,
	} = useQuestionScreen(quizId || "", questionId || "");

	// Early returns for error states
	if (!quizId || !questionId) {
		return <ErrorComponent message="Quiz oder Frage-ID fehlt" />;
	}

	if (!quizState) {
		return <LoadingComponent message="Quiz wird geladen..." />;
	}

	if (!question) {
		return <ErrorComponent message="Frage nicht gefunden" />;
	}

	const renderHintsLink = () => {
		//BUG Muss Updaten, sobald ein Tipp verfügbar ist
		if (isHintsLinkVisible) {
			return (
				<TouchableOpacity
					onPress={navigateToHints}
					style={styles.hintsButton}
					accessibilityHint="Öffnet die Seite mit den Hinweisen"
				>
					<FontAwesome6
						name="lightbulb"
						size={24}
						color="gold"
						style={styles.icon}
					/>
				</TouchableOpacity>
			);
		}
	};

	// Main render
	return (
		<ThemedView gradientType="primary" style={{ flex: 1 }}>
			<Header
				showBackButton
				backButtonText={quizState.title}
				onBackPress={handleBack}
				rightSlot={renderHintsLink()}
			/>
			<QuestionContentContainer question={question}>
				{!showResult && !isSolved && (
					<AnswerInput
						value={answer}
						onChangeText={setAnswer}
						onSubmitEditing={handleSubmit}
						isSubmitting={isSubmitting}
					/>
				)}

				{showResult && (
					<View style={styles.contentInner}>
						<QuestionResult
							isCorrect={isCorrect}
							funFact={question.funFact}
							wikipediaSlug={question.wikipediaName || question.answer}
							onBack={handleBack}
							onTryAgain={handleTryAgain}
							statusChanged={statusChanged}
							answer={question.answer}
							hint={hint}
						/>
					</View>
				)}
			</QuestionContentContainer>
		</ThemedView>
	);
};

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
		paddingVertical: 8,
		justifyContent: "flex-end",
	},
	icon: {
		marginRight: 8,
	},
});
