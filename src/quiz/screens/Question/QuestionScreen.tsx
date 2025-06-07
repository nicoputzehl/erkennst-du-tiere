// src/quiz/screens/Question/QuestionScreen.tsx - ENHANCED VERSION
import { ErrorComponent } from "@/src/common/components/ErrorComponent";
import { LoadingComponent } from "@/src/common/components/LoadingComponent";
import { ThemedView } from "@/src/common/components/ThemedView";
import type React from "react";
import { useCallback, useState } from "react";
import { View } from "react-native";
import {
	ContextualHint,
	HintButton,
	PurchaseHintPanel,
	PointsDisplay,
	AutoFreeHint,
	PurchasedHint,
} from "../../components/HintUi";
import { QuestionComponent } from "./components/Question";
import { useQuestionScreen } from "./hooks/useQuestionScreen";

export interface QuestionScreenProps {
	quizId: string | null;
	questionId: string | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
	quizId,
	questionId,
}) => {
	const [showPurchaseHints, setShowPurchaseHints] = useState(false);

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

		isContextualHintVisible,
		handleContextualHintClose,
		contextualHintContent,

		isAutoFreeHintVisible,
		handleAutoFreeHintClose,
		autoFreeHintContent,

		purchasedHints,
		handleHintPurchased,
	} = useQuestionScreen(quizId || "", questionId || "");

	const handleClosePurchaseHints = useCallback(() => {
		console.log("[QuestionScreen] Closing purchase hints modal");
		setShowPurchaseHints(false);
	}, []);

	const handleOpenPurchaseHints = useCallback(() => {
		console.log("[QuestionScreen] Opening purchase hints modal");
		setShowPurchaseHints(true);
	}, []);

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

	// Main render
	return (
		<ThemedView gradientType="primary" style={{ flex: 1 }}>
			<QuestionComponent
				quizId={quizId}
				questionId={questionId}
				question={question}
				answer={answer}
				setAnswer={setAnswer}
				isSubmitting={isSubmitting}
				showResult={showResult}
				isCorrect={isCorrect}
				statusChanged={statusChanged}
				isSolved={isSolved}
				onSubmit={handleSubmit}
				onTryAgain={handleTryAgain}
				onBack={handleBack}
				quizTitle={quizState.title}
				purchasedHints={purchasedHints}
			/>

			{/* Points Display */}
			<View style={{ position: "absolute", top: 50, right: 16 }}>
				<PointsDisplay quizId={quizId} compact />
			</View>

			{/* Hint Button - only show when not showing result and not solved */}
			{!showResult && !isSolved && (
				<HintButton
					quizId={quizId}
					questionId={Number.parseInt(questionId)}
					onOpenHints={handleOpenPurchaseHints}
				/>
			)}
			<ContextualHint
				isVisible={isContextualHintVisible}
				onClose={handleContextualHintClose}
				content={contextualHintContent}
			/>
			<AutoFreeHint
				isVisible={isAutoFreeHintVisible}
				onClose={handleAutoFreeHintClose}
				content={autoFreeHintContent}
			/>
			<PurchasedHint
				isVisible={showPurchaseHints}
				onClose={handleClosePurchaseHints}
				content={purchasedHints[0]}
			/>
			<PurchaseHintPanel
				quizId={quizId}
				questionId={Number.parseInt(questionId)}
				isVisible={showPurchaseHints}
				onClose={handleClosePurchaseHints}
				onHintPurchased={handleHintPurchased}
			/>
		</ThemedView>
	);
};
