import {
	BorderRadius,
	CommonStyles,
	FontSizes,
	FontWeights,
	Shadows,
	Spacing,
} from "@/src/common/constants/Styles";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	quizTitle: {
		fontSize: FontSizes.lg,
		fontWeight: FontWeights.semibold,
		zIndex: 1,
		color: "#666",
	},
	quizCardOuter: {
		backgroundColor: "#f8f9fa",
		borderRadius: BorderRadius.md,
		flex: 1,
		height: 100,
		maxWidth: "100%",
		minWidth: "100%",
		overflow: "hidden",
		boxShadow: Shadows.boxShadow,
	},
	quizCardInner: {
		flex: 1,
		flexDirection: "row",
	},
	quizCardContent: {
		flex: 1,
		padding: Spacing.md,
		justifyContent: "space-between",
	},
	quizCardStartItem: {
		width: 105,
		height: 100,
		...CommonStyles.centered,
	},
	image: {
		width: 105,
		height: 100,
	},
	iconContainer: {
		width: "100%",
		height: "100%",
		...CommonStyles.centered,
	},
	description: {
		fontSize: FontSizes.xs,
		color: "#6c757d",
		lineHeight: FontSizes.md,
	},
	locked: {
		backgroundColor: "#f8f9fa",
	},
	new: {
		borderStyle: "dotted",
		borderColor: "orange",
		borderWidth: 4,
	},
	loadingCard: {
		opacity: 0.7,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.15)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
	},


	activeProgressContainer: {
		...CommonStyles.rowSpaceBetween,
	},
	progressSection: {},
	progressContainer: {
		flexDirection: "row",
		width: "100%",
		gap: Spacing.sm,
		...CommonStyles.centered,
	},
	progressIndicatorContainer: {
		flex: 1,
	},
	progressText: {
		fontSize: FontSizes.sm,
		color: "#666",
		zIndex: 1,
		textAlign: "right",
	},
	newText: {
		fontSize: FontSizes.sm,
		color: "#ff9800",
		fontWeight: FontWeights.medium,
	},
});
