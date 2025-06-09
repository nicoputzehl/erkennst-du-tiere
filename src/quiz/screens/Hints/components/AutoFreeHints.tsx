import { useCallback } from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native";

export interface AutoFreeHintProps {
	isVisible: boolean;
	onClose: () => void;
	content: string;
}

export const AutoFreeHint = ({
	isVisible,
	onClose,
	content,
}: AutoFreeHintProps) => {
	const handleClose = useCallback(() => {
		console.log("[AutoFreeHint] Close button pressed");
		onClose();
	}, [onClose]);

	const handleBackdropPress = useCallback(() => {
		console.log("[AutoFreeHint] Backdrop pressed");
		handleClose();
	}, [handleClose]);

	if (!isVisible) {
		return null;
	}

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">
			<TouchableWithoutFeedback onPress={handleBackdropPress}>
				<View style={styles.overlay}>
					<View style={styles.autoFreeHintContainer}>
						<Text style={styles.autoFreeHintTitle}>
							🎁 Kostenloser Hinweis:
						</Text>
						<Text style={styles.autoFreeHintContent}>{content}</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
		padding: 32,
	},
	autoFreeHintContainer: {
		backgroundColor: "#FFF3E0",
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	autoFreeHintTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#F57C00",
		marginBottom: 4,
	},
	autoFreeHintContent: {
		fontSize: 16,
		color: "#E65100",
		lineHeight: 22,
	},
});
