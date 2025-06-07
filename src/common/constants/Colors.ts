const tintColorLight = "#0a7ea4";
const tintColorDark = "#64B5F6";

const tintColorOnGradientLight = "#1A365D";
const tintColorOnGradientDark = "#E2E8F0";

export const Colors = {
	light: {
		text: "#FFFFFF",
		background: "#fff",
		tint: tintColorLight,
		tintOnGradient: tintColorOnGradientLight,
		icon: "#FFFFFF",
		tabIconDefault: "#687076",
		tabIconSelected: tintColorLight,

		primary: "#0a7ea4",
		success: "#4CAF50",
		error: "#F44336",
		warning: "#FF9800",
		info: "#2196F3",

		buttonPrimary: "#0a7ea4",
		buttonSuccess: "#4CAF50",
		buttonWarning: "#FF9800",
		buttonError: "#F44336",
		buttonDisabled: "#ccc",

		textPrimary: "#FFFFFF",
		textSecondary: "#6c757d",
		textOnButton: "#fff",
		textPlaceholder: "#666",

		border: "rgba(0, 0, 0, 0.1)",
		borderActive: "#0a7ea4",
		shadow: "#000",

		cardBackground: "#f5f5f5",
		cardBorder: "rgba(0, 0, 0, 0.1)",
		containerBackground: "rgba(255, 255, 255, 0.1)",

		correct: "#4CAF50",
		incorrect: "#F44336",
		locked: "#6c757d",
		new: "#ff9800",

		gradientPrimary: ["#5F8AE1", "#7A9EE8", "#A8C5F0"] as [
			string,
			string,
			...string[],
		],
		gradientSecondary: ["#FF6B6B", "#FFE66D", "#FF8E53"] as [
			string,
			string,
			...string[],
		],
		gradientNeutral: ["#E8EAF6", "#C5CAE9", "#9FA8DA"] as [
			string,
			string,
			...string[],
		],
		gradientSuccess: ["#66BB6A", "#81C784", "#A5D6A7"] as [
			string,
			string,
			...string[],
		],
	},
	dark: {
		text: "#ECEDEE",
		background: "#151718",
		tint: tintColorDark,
		tintOnGradient: tintColorOnGradientDark,
		icon: "#ECEDEE",
		tabIconDefault: "#9BA1A6",
		tabIconSelected: tintColorDark,

		primary: "#64B5F6",
		success: "#81C784",
		error: "#E57373",
		warning: "#FFB74D",
		info: "#64B5F6",

		buttonPrimary: "#64B5F6",
		buttonSuccess: "#81C784",
		buttonWarning: "#FFB74D",
		buttonError: "#E57373",
		buttonDisabled: "#424242",

		textPrimary: "#ECEDEE",
		textSecondary: "#9BA1A6",
		textOnButton: "#fff",
		textPlaceholder: "#666",

		border: "rgba(255, 255, 255, 0.2)",
		borderActive: "#64B5F6",
		shadow: "#000",

		cardBackground: "#2a2a2a",
		cardBorder: "rgba(255, 255, 255, 0.2)",
		containerBackground: "rgba(0, 0, 0, 0.2)",

		correct: "#81C784",
		incorrect: "#E57373",
		locked: "#9BA1A6",
		new: "#FFB74D",

		gradientPrimary: ["#1a1a2e", "#16213e", "#0f3460"] as [
			string,
			string,
			...string[],
		],
		gradientSecondary: ["#2C1810", "#3D2817", "#4A3728"] as [
			string,
			string,
			...string[],
		],
		gradientNeutral: ["#2E2E2E", "#3A3A3A", "#464646"] as [
			string,
			string,
			...string[],
		],
		gradientSuccess: ["#1B5E20", "#2E7D32", "#388E3C"] as [
			string,
			string,
			...string[],
		],
	},
};
