import { ThemedText } from "@/src/common/components/ThemedText";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { WikipediaLink } from "@/src/quiz/screens/Question/components/WikipediaLink";
import type { Question } from "@/src/quiz/types";
import { StyleSheet, View } from "react-native";
import { DelayedLottie } from "./DelayedLottie";

export interface SolvedProps {
	question: Question;
	justSolved: boolean;
}

const Solved = ({ question, justSolved: statusChanged }: SolvedProps) => {
	const wikipediaSlug = question.wikipediaName || question.answer;

	return (
		<View style={styles.container}>
			<DelayedLottie shouldPlay={statusChanged} delay={500} />
			<View style={styles.content}>
				{question.funFact && <FunFactSection funFact={question.funFact} />}
					<WikipediaLink slug={wikipediaSlug} />
			</View>
		</View>
	);
};

const FunFactSection = ({ funFact }: { funFact: string }) => {
	const textColor = useThemeColor({}, "tintOnGradient");
	return (
		<View>
			<ThemedText
				style={[styles.funFactHeader, { color: textColor }]}
				type="title"
			>
				Wusstest du das ...
			</ThemedText>
			<ThemedText style={[styles.funFact, { color: textColor }]}>
				{funFact}
			</ThemedText>
		</View>
	);
};


export default Solved;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
	},
	funFact: {
		fontSize: 20,
		marginBottom: 20,
		lineHeight: 24,
	},
	funFactHeader: {
		marginBottom: 10,
	},
	content: {
		justifyContent: "flex-start",
		flex: 1,
	},
	bottomContainer: {
		flex: 1,
		flexDirection: "row",
		gap: 8,
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},
});
