import { HintType, type VisibleHint } from "@/src/quiz/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type HintPatchProps = {
	hints: VisibleHint[];
};

export const HintPatch: React.FC<HintPatchProps> = ({ hints }) => {
	if (hints.length === 0) return null;

	const firstletter = hints.find((h) => h.type === HintType.FIRST_LETTER);
	const lettercount = hints.find((h) => h.type === HintType.LETTER_COUNT);

	const hasFirstletterHint = !!firstletter;
	const hasLettercountHint = !!lettercount;

	let hintText = "";
	if (hasFirstletterHint && hasLettercountHint) {
		hintText = `Hinweis: ${lettercount?.value} Buchstaben, beginnt mit ${firstletter.value}`;
	} else if (hasFirstletterHint) {
		hintText = `Hinweis: Erster Buchstabe ist ${firstletter.value}`;
	} else if (hasLettercountHint) {
		hintText = `Hinweis: ${lettercount.value} Buchstaben`;
	} else {
		return null;
	}

	return (
		<View style={styles.container}>
			<FontAwesome6
				name="lightbulb"
				size={24}
				color="gold"
				style={styles.icon}
			/>
			<Text style={styles.text}>{hintText}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		padding: 8,
		borderRadius: 6,
		backgroundColor: "#fffbea",
		borderWidth: 1,
		borderColor: "gold",
	},
	icon: {
		marginRight: 8,
	},
	text: {
		fontSize: 16,
		color: "#333",
	},
});
