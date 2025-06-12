import { ThemedText } from "@/src/common/components/ThemedText";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { useHints } from "@/src/quiz/store/hooks/useHints";
import { FontAwesome6 } from "@expo/vector-icons";
import { useCallback } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

interface PurchaseHintPanelProps {
	quizId: string;
	questionId: number;
	isVisible: boolean;
	onClose: () => void;
	onHintPurchased: (content: string) => void;
}

export const PurchaseHintPanel: React.FC<PurchaseHintPanelProps> = ({
	quizId,
	questionId,
	isVisible,
	onClose,
	onHintPurchased,
}) => {
	const {
		purchasableHints,
		pointsBalance,
		handleUseHint: applyHint,
	} = useHints(quizId, questionId);

	const textColor = useThemeColor({}, "text");
	const backgroundColor = useThemeColor({}, "background");

	const handlePurchaseHint = useCallback(
		async (hintId: string) => {
			const result = await applyHint(hintId);
			if (result.success && result.hintContent) {
				onHintPurchased(result.hintContent);
				onClose();
			}
		},
		[applyHint, onHintPurchased, onClose],
	);

	const handleClose = useCallback(() => {
		console.log("[PurchaseHintPanel] Close button pressed");
		onClose();
	}, [onClose]);

	const handleBackdropPress = useCallback(() => {
		console.log("[PurchaseHintPanel] Backdrop pressed");
		handleClose();
	}, [handleClose]);

	if (!isVisible) {
		return null;
	}

	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="fade"
			onRequestClose={handleClose}
		>
			<TouchableWithoutFeedback onPress={handleBackdropPress}>
				<View style={styles.overlay}>
					<TouchableWithoutFeedback onPress={() => {}}>
						<View style={[styles.panel, { backgroundColor }]}>
							{/* Header */}
							<View style={styles.header}>
								<ThemedText style={[styles.title, { color: textColor }]}>
									Hinweise kaufen
								</ThemedText>
								<View style={styles.pointsContainer}>
									<FontAwesome6 name="coins" size={16} color="#FFD700" />
									<ThemedText style={[styles.pointsText, { color: textColor }]}>
										{pointsBalance} Punkte
									</ThemedText>
								</View>
								<TouchableOpacity
									onPress={handleClose}
									style={styles.closeButton}
									hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								>
									<FontAwesome6 name="times" size={20} color={textColor} />
								</TouchableOpacity>
							</View>

							{/* Available Purchasable Hints */}
							<ScrollView
								style={styles.hintsList}
								showsVerticalScrollIndicator={false}
							>
								{purchasableHints.map(({ hint, canUse, reason }) => (
									<TouchableOpacity
										key={hint.id}
										style={[styles.hintButton, !canUse && styles.disabledHint]}
										onPress={() => canUse && handlePurchaseHint(hint.id)}
										disabled={!canUse}
										activeOpacity={0.7}
									>
										<View style={styles.hintHeader}>
											<ThemedText
												style={[
													styles.hintTitle,
													!canUse && styles.disabledText,
												]}
											>
												{hint.title}
											</ThemedText>
											<View style={styles.hintCost}>
												<FontAwesome6 name="coins" size={12} color="#FFD700" />
												<ThemedText style={styles.costText}>
													{hint.cost}
												</ThemedText>
											</View>
										</View>

										<ThemedText
											style={[
												styles.hintDescription,
												!canUse && styles.disabledText,
											]}
										>
											{hint.description}
										</ThemedText>

										{!canUse && reason && (
											<ThemedText style={styles.hintReason}>
												{reason}
											</ThemedText>
										)}
									</TouchableOpacity>
								))}
							</ScrollView>

							{purchasableHints.length === 0 && (
								<View style={styles.noHintsContainer}>
									<ThemedText
										style={[styles.noHintsText, { color: textColor }]}
									>
										Keine kaufbaren Hinweise verfügbar
									</ThemedText>
								</View>
							)}

							{/* Close Button at Bottom */}
							<TouchableOpacity
								style={[styles.bottomCloseButton, { borderColor: textColor }]}
								onPress={handleClose}
								activeOpacity={0.7}
							>
								<ThemedText
									style={[styles.bottomCloseButtonText, { color: textColor }]}
								>
									Schließen
								</ThemedText>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
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
	panel: {
		width: "90%",
		maxHeight: "80%",
		borderRadius: 16,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
		paddingBottom: 12,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	pointsContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	pointsText: {
		fontSize: 16,
		fontWeight: "600",
	},
	closeButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: "rgba(0,0,0,0.1)",
	},

	hintsList: {
		maxHeight: 300,
	},
	hintButton: {
		backgroundColor: "#f8f9fa",
		borderWidth: 1,
		borderColor: "#dee2e6",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	disabledHint: {
		opacity: 0.6,
		backgroundColor: "#f1f3f4",
	},
	hintHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	hintTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#212529",
		flex: 1,
	},
	hintCost: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: "#fff3cd",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	costText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#856404",
	},
	hintDescription: {
		fontSize: 14,
		color: "#6c757d",
		marginBottom: 8,
		lineHeight: 18,
	},
	hintReason: {
		fontSize: 12,
		color: "#dc3545",
		fontStyle: "italic",
		marginTop: 4,
	},
	disabledText: {
		color: "#adb5bd",
	},
	noHintsContainer: {
		padding: 32,
		alignItems: "center",
	},
	noHintsText: {
		textAlign: "center",
		fontSize: 16,
		fontStyle: "italic",
	},
	bottomCloseButton: {
		marginTop: 16,
		padding: 12,
		borderWidth: 1,
		borderRadius: 8,
		alignItems: "center",
	},
	bottomCloseButtonText: {
		fontSize: 16,
		fontWeight: "600",
	},
});
