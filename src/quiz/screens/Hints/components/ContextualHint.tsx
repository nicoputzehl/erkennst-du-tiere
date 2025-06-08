import { useCallback } from "react";
import {
	View,
	Text,
	Modal,
	TouchableWithoutFeedback,
	StyleSheet,
} from "react-native";

export interface ContextualHintProps {
	isVisible: boolean;
	onClose: () => void;
	content: string;
}

export const ContextualHint = ({
	isVisible,
	onClose,
	content,
}: ContextualHintProps) => {
	const handleClose = useCallback(() => {
		console.log("[ContextualHint] Close button pressed");
		onClose();
	}, [onClose]);

	const handleBackdropPress = useCallback(() => {
		console.log("[ContextualHint] Backdrop pressed");
		handleClose();
	}, [handleClose]);

	if (!isVisible) {
		return null;
	}

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">
			<TouchableWithoutFeedback onPress={handleBackdropPress}>
				<View style={styles.overlay2}>
					<View style={styles.usedHintContainer}>
						<Text style={styles.usedHintTitle}>💡 Dein Hinweis:</Text>
						<Text style={styles.usedHintContent}>{content}</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay2: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
		padding: 32,
	},
	usedHintContainer: {
		backgroundColor: "#E8F5E8",
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	usedHintTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2E7D32",
		marginBottom: 4,
	},
	usedHintContent: {
		fontSize: 16,
		color: "#1B5E20",
		lineHeight: 22,
	},
});
