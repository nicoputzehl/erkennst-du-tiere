import { ErrorComponent } from "@/src/common/components/ErrorComponent";
import Header from "@/src/common/components/Header";
import { ThemedView } from "@/src/common/components/ThemedView";
import { router } from "expo-router";
import { HintsContent } from "./components/HintsContent";
import { PointsDisplay } from "./components/PointsDisplay";

interface HintsScreenProps {
	quizId: string | null;
	questionId: string | null;
}

export const HintsScreen: React.FC<HintsScreenProps> = ({
	quizId,
	questionId,
}) => {
	const handleBack = () => {
		router.back(); // Zurück zur Question
	};

	if (!quizId || !questionId) {
		return <ErrorComponent message="Quiz oder Frage-ID fehlt" />;
	}

	return (
		<ThemedView style={{ flex: 1 }} gradientType="primary">
			<Header
				title="Hinweise"
				showBackButton
				onBackPress={handleBack}
				backButtonText="Zurück"
				rightSlot={<PointsDisplay quizId={quizId} />}
			/>

			<HintsContent quizId={quizId} questionId={questionId} />
		</ThemedView>
	);
};
