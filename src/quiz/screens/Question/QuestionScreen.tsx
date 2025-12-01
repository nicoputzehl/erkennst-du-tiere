import { ErrorComponent } from "@/src/common/components/ErrorComponent";
import Header from "@/src/common/components/Header";
import { LoadingComponent } from "@/src/common/components/LoadingComponent";
import { ThemedView } from "@/src/common/components/ThemedView";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Hint from "./components/Hint";
import { QuestionInput } from "./components/QuestionInput";
import ResultReaction from "./components/ResultReaction";
import Solved from "./components/Solved";
import { useQuestionScreen } from "./hooks/useQuestionScreen";
import { HintPatch } from "./components/HintPatch";
import { QuestionImage } from "./components/QuestionImage";
import Button from "@/src/common/components/Button";
import { GestureHandler } from "@/src/common/components/GestureHandler";

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
		handleChangeAnswer,
		isSubmitting,
		showResult,
		isCorrect,
		statusChanged,
		handleSubmit,
		handleBack,
		hint,
		hasVisibleHints,
		clearAnswer,
		showInput,
		headerText,
		resetResult,
		showHint,
		navigateToHintsModal,
		showResultReaction,
		visibleHints,
		isSolved,
		navigateToNextQuestion,
		continueButtonProps
	} = useQuestionScreen(quizId || "", questionId || "");

	const iconColor = useThemeColor({}, "tintOnGradient");

	const headerActions = useMemo(() => {
		const actions = [];

		if (hasVisibleHints) {
			actions.push({
				key: "hints",
				icon: <FontAwesome6 name="lightbulb" size={24} color="gold" />,
				onPress: navigateToHintsModal,
				accessibilityHint: "Öffnet die Seite mit den Hinweisen",
			});
		}

		actions.push({
			key: "close",
			icon: <MaterialCommunityIcons name="close" size={32} color={iconColor} />,
			onPress: handleBack,
			accessibilityHint: "Schließt die Frage",
		});

		return actions;
	}, [hasVisibleHints, handleBack, iconColor, navigateToHintsModal]);


	if (!quizId || !questionId) {
		return <ErrorComponent message="Quiz oder Frage-ID fehlt" />;
	}

	if (!quizState) {
		return <LoadingComponent message="Quiz wird geladen..." />;
	}

	if (!question) {
		return <ErrorComponent message="Frage nicht gefunden" />;
	}

	return (
		<GestureHandler onSwipeLeft={() => {
			if (navigateToNextQuestion && isSolved) {
				navigateToNextQuestion();
			}
		}} onSwipeUp={handleBack}>
			<ThemedView
				gradientType="primary" style={{ flex: 1 }}>
				<Header
					showBackButton={false}
					title={headerText}
					rightSlot={
						<View style={styles.headerActions}>
							{headerActions.map((action) => (
								<TouchableOpacity
									key={action.key}
									onPress={action.onPress}
									style={styles.actionButton}
									accessibilityHint={action.accessibilityHint}
								>
									{action.icon}
								</TouchableOpacity>
							))}
						</View>
					}
				/>
				{showResultReaction && <ResultReaction correctAnswer={isCorrect} />}
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={{ flex: 1 }}
				>
					<Hint hint={hint} isVisible={showHint} onClose={resetResult} />
					<View style={{ flex: 1, justifyContent: "space-between" }}>
						<View style={styles.imageWrapper}>
							<QuestionImage
								question={question}
							/>

						</View>
						{isSolved ? (
							<View style={styles.resultContainer}>
							<Solved question={question} justSolved={statusChanged} />
							<Button {...continueButtonProps} />
							</View>
						):
						
						<HintPatch hints={visibleHints} />
						}
						{showInput && (
							<QuestionInput
								value={answer}
								onChangeText={handleChangeAnswer}
								onSubmit={handleSubmit}
								onClear={clearAnswer}
								isSubmitting={isSubmitting}
								hasError={showResult && !isCorrect}
							/>
						)}
					</View>
				</KeyboardAvoidingView>
			</ThemedView>
		</GestureHandler>
	);
};

const styles = StyleSheet.create({
	headerActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		justifyContent: "flex-end",
	},
	actionButton: {
		padding: 8,
		borderRadius: 20,
	},
	resultContainer: {
		flex: 1,
		justifyContent: "space-between",
		minHeight: 200,
		padding: 16,
	},
	imageWrapper: {
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 16,
		width: "100%",
		gap: 16
	},
});
