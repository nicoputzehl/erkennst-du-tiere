import { ThemedText } from "@/src/common/components/ThemedText";
import {
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import type { WrongAnswerHint } from "../Question.types";

type HintProps = {
	hint: WrongAnswerHint | undefined;
	onClose: () => void;
	isVisible: boolean;
};

const Hint = ({ hint, onClose, isVisible }: HintProps) => {
	if (!hint) {
		return null;
	}

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.overlay2}>
					<View style={styles.usedHintContainer}>
						<ThemedText style={styles.usedHintTitle}>
						{hint.title} 🤓
						</ThemedText>
						<ThemedText style={styles.usedHintContent}>
							{hint.content}
						</ThemedText>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default Hint;

const styles = StyleSheet.create({
	overlay2: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	usedHintContainer: {
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		padding: 24,
		borderRadius: 16,
		marginTop: 300,
		width: "90%",
	},
	usedHintTitle: {
		fontSize: 24,
		fontWeight: "600",
		color: "#000000ff",
		marginBottom: 4,
		lineHeight: 40,
	},
	usedHintContent: {
		fontSize: 20,
		color: "#000000ff",
		lineHeight: 32,
	},
});
