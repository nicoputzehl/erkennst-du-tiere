import { ThemedText } from "@/src/common/components/ThemedText";
import { useCallback } from "react";
import {
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";

export interface PurchasedHintProps {
	isVisible: boolean;
	onClose: () => void;
	content: string;
}

export const PurchasedHint = ({
	isVisible,
	onClose,
	content,
}: PurchasedHintProps) => {
	const handleClose = useCallback(() => {
		console.log("[PurchasedHint] Close button pressed");
		onClose();
	}, [onClose]);

	const handleBackdropPress = useCallback(() => {
		console.log("[PurchasedHint] Backdrop pressed");
		handleClose();
	}, [handleClose]);

	if (!isVisible) {
		return null;
	}

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">
			<TouchableWithoutFeedback onPress={handleBackdropPress}>
				<View style={styles.overlay2}>
					<View style={styles.purchasedHintContainer}>
						<ThemedText style={styles.purchasedHintTitle}>
							💰 Dein gekaufter Hinweis:
						</ThemedText>
						<ThemedText style={styles.purchasedHintContent}>
							{content}
						</ThemedText>
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
	purchasedHintContainer: {
		backgroundColor: "#E3F2FD",
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	purchasedHintTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1976D2",
		marginBottom: 4,
	},
	purchasedHintContent: {
		fontSize: 16,
		color: "#0D47A1",
		lineHeight: 22,
	},
});
