// src/quiz/components/HintUi.tsx - ENHANCED VERSION
import type React from "react";
import { useState, useCallback } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Modal,
	TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { useHints } from "../store/hooks/useHints";
import { useQuizStore } from "../store/Quiz.store";

// ==========================================
// PURCHASE HINT PANEL (kostenpflichtige Hints)
// ==========================================
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

	const textColor = useThemeColor({}, "text") as string;
	const backgroundColor = useThemeColor({}, "background") as string;

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
								<Text style={[styles.title, { color: textColor }]}>
									Hinweise kaufen
								</Text>
								<View style={styles.pointsContainer}>
									<FontAwesome6 name="coins" size={16} color="#FFD700" />
									<Text style={[styles.pointsText, { color: textColor }]}>
										{pointsBalance} Punkte
									</Text>
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
											<Text
												style={[
													styles.hintTitle,
													!canUse && styles.disabledText,
												]}
											>
												{hint.title}
											</Text>
											<View style={styles.hintCost}>
												<FontAwesome6 name="coins" size={12} color="#FFD700" />
												<Text style={styles.costText}>{hint.cost}</Text>
											</View>
										</View>

										<Text
											style={[
												styles.hintDescription,
												!canUse && styles.disabledText,
											]}
										>
											{hint.description}
										</Text>

										{!canUse && reason && (
											<Text style={styles.hintReason}>{reason}</Text>
										)}
									</TouchableOpacity>
								))}
							</ScrollView>

							{purchasableHints.length === 0 && (
								<View style={styles.noHintsContainer}>
									<Text style={[styles.noHintsText, { color: textColor }]}>
										Keine kaufbaren Hinweise verfügbar
									</Text>
								</View>
							)}

							{/* Close Button at Bottom */}
							<TouchableOpacity
								style={[styles.bottomCloseButton, { borderColor: textColor }]}
								onPress={handleClose}
								activeOpacity={0.7}
							>
								<Text
									style={[styles.bottomCloseButtonText, { color: textColor }]}
								>
									Schließen
								</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

// ==========================================
// AUTO-FREE HINT MODAL (wie Contextual Hint)
// ==========================================
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
				<View style={styles.overlay2}>
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

// ==========================================
// PURCHASED HINT MODAL (gekaufte Hints anzeigen)
// ==========================================
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
						<Text style={styles.purchasedHintTitle}>
							💰 Dein gekaufter Hinweis:
						</Text>
						<Text style={styles.purchasedHintContent}>{content}</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

// ==========================================
// EXISTING CONTEXTUAL HINT (unverändert)
// ==========================================
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

// ==========================================
// EXISTING COMPONENTS (unverändert)
// ==========================================
interface PointsDisplayProps {
	quizId: string;
	compact?: boolean;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({
	quizId,
	compact = false,
}) => {
	const pointsBalance = useQuizStore((state) => state.getPointsBalance());
	const textColor = useThemeColor({}, "text") as string;

	return (
		<View
			style={[styles.pointsDisplay, compact && styles.pointsDisplayCompact]}
		>
			<FontAwesome6 name="coins" size={compact ? 14 : 18} color="#FFD700" />
			<Text
				style={[
					compact ? styles.pointsTextCompact : styles.pointsTextLarge,
					{ color: textColor },
				]}
			>
				{pointsBalance}
			</Text>
		</View>
	);
};

interface HintButtonProps {
	quizId: string;
	questionId: number;
	onOpenHints: () => void;
}

export const HintButton: React.FC<HintButtonProps> = ({
	quizId,
	questionId,
	onOpenHints,
}) => {
	const { purchasableHints } = useHints(quizId, questionId);
	const availableCount = purchasableHints.filter((h) => h.canUse).length;
	const tintColor = useThemeColor({}, "tint") as string;

	const handlePress = useCallback(() => {
		console.log("[HintButton] Opening purchase hints modal");
		onOpenHints();
	}, [onOpenHints]);

	// Nur anzeigen wenn kaufbare Hints verfügbar sind
	if (availableCount === 0) {
		return null;
	}

	return (
		<TouchableOpacity
			style={[styles.hintFloatingButton, { backgroundColor: tintColor }]}
			onPress={handlePress}
			activeOpacity={0.8}
		>
			<FontAwesome6 name="lightbulb" size={20} color="white" />
			{availableCount > 0 && (
				<View style={styles.hintBadge}>
					<Text style={styles.hintBadgeText}>{availableCount}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

// ==========================================
// STYLES (erweitert)
// ==========================================
const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	overlay2: {
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

	// EXISTING Contextual Hint Styles
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

	// NEUE Auto-Free Hint Styles
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

	// NEUE Purchased Hint Styles
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
	pointsDisplay: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "rgba(255, 215, 0, 0.2)",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	pointsDisplayCompact: {
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	pointsTextLarge: {
		fontSize: 16,
		fontWeight: "600",
	},
	pointsTextCompact: {
		fontSize: 14,
		fontWeight: "600",
	},
	hintFloatingButton: {
		position: "absolute",
		bottom: 100,
		right: 16,
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	hintBadge: {
		position: "absolute",
		top: -4,
		right: -4,
		backgroundColor: "#dc3545",
		borderRadius: 10,
		width: 20,
		height: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	hintBadgeText: {
		color: "white",
		fontSize: 12,
		fontWeight: "bold",
	},
});
