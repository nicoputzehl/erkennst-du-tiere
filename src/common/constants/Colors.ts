// Grayscale
const white = "#FFFFFF";
const lightGrey = "#F0F0F0";
const grey = "#CCC";
const mediumGrey = "#687076";
const darkGrey = "#666";
const graphite = "#333333";
const black = "#000";

// Reds
const strawberry = "#E04F5F"; // Light theme accent
const lightRed = "#F44336"; // Light theme incorrect/buttonError
const darkRed = "#8b603b"; // Light theme error
const darkThemeErrorRed = "#E57373"; // Dark theme specific error red

// Oranges
const dawnOrange = "#FFC266";
const darkOrange = "#FF9800"; // Light theme warning/new
const darkThemeWarningOrange = "#FFB74D"; // Dark theme specific warning/new
const darkOrangeWithTransparency = "#ff990020";
const darkThemeWarningOrangeWithTransparency = "#FFB74D20"; // Dark theme specific warning/new
// Yellows
const citrus = "#FFF2A1";

// Greens
const lightGreen = "#4CAF50"; // Light theme correct/buttonSuccess
const darkThemeSuccessGreen = "#81C784"; // Dark theme specific success/correct green

// Blues
const primaryBlue = "#0a7ea4"; // Light theme primary/tint
const infoBlue = "#2196F3"; // Light theme info
const successBlue = "#5c7fbb"; // Light theme success
const darkThemePrimaryBlue = "#64B5F6"; // Dark theme primary/tint/info/borderActive

// Dark Theme Specific Grayscale
const darkBackground = "#151718";
const darkText = "#ECEDEE";
const darkIcon = "#ECEDEE";
const darkTabIconDefault = "#9BA1A6";
const darkButtonDisabled = "#424242";
const darkCardBackground = "#2a2a2a";
const darkTextPlaceholder = "#666"; // This is the same as light's darkGrey, consider if a single variable could work

// Dark Theme Specific Transparencies
const transparentBorderDark = "rgba(255, 255, 255, 0.2)";
const transparentContainerDark = "rgba(0, 0, 0, 0.2)";

const tintColorLight = primaryBlue;
const tintColorDark = darkThemePrimaryBlue;

export const Colors = {
	light: {
		// Grayscale
		text: white,
		background: white,

		tabIconDefault: mediumGrey,
		textOnButton: white,
		textPlaceholder: darkGrey,
		buttonDisabled: grey,
		shadow: black,

		// Reds
		accent: strawberry,
		error: darkRed,
		incorrect: lightRed,
		buttonError: lightRed,

		// Oranges
		warning: darkOrange,
		new: darkOrange,
		buttonWarning: darkOrangeWithTransparency,

		// Yellows
		lightAccent: citrus,

		// Greens
		correct: lightGreen,
		buttonSuccess: lightGreen,

		// Blues
		tint: tintColorLight,
		primary: primaryBlue,
		buttonPrimary: primaryBlue,
		tabIconSelected: tintColorLight,
		success: successBlue,
		info: infoBlue,
		borderActive: primaryBlue,

		// Other
		tintOnGradient: graphite,
		textSecondary: "#6c757d", // You might want to define this as a variable if it's reused.
		border: "rgba(0, 0, 0, 0.1)", // You might want to define this as a variable if it's reused.
		cardBackground: lightGrey,
		cardBorder: "rgba(0, 0, 0, 0.1)", // You might want to define this as a variable if it's reused.
		containerBackground: "rgba(255, 255, 255, 0.1)", // You might want to define this as a variable if it's reused.
		locked: "#6c757d", // You might want to define this as a variable if it's reused.

		// HEADER
		icon: "#fff",
	},
	dark: {
		// Grayscale
		text: darkText,
		background: darkBackground,
		icon: darkIcon,
		tabIconDefault: darkTabIconDefault,
		textOnButton: white, // Assuming white text on buttons in dark mode
		textPlaceholder: darkTextPlaceholder,
		buttonDisabled: darkButtonDisabled,
		shadow: black, // Assuming black shadow for now

		// Reds
		error: darkThemeErrorRed,
		incorrect: darkThemeErrorRed,
		buttonError: darkThemeErrorRed,

		// Oranges
		accent: dawnOrange, // Assuming accent is dawnOrange in dark mode
		warning: darkThemeWarningOrange,
		new: darkThemeWarningOrange,
		buttonWarning: darkThemeWarningOrangeWithTransparency,

		// Yellows
		lightAccent: citrus, // Assuming lightAccent is citrus in dark mode

		// Greens
		success: darkThemeSuccessGreen,
		correct: darkThemeSuccessGreen,
		buttonSuccess: darkThemeSuccessGreen,

		// Blues
		tint: tintColorDark,
		primary: darkThemePrimaryBlue,
		info: darkThemePrimaryBlue,
		tabIconSelected: tintColorDark,
		buttonPrimary: darkThemePrimaryBlue,
		borderActive: darkThemePrimaryBlue,

		// Other
		tintOnGradient: lightGrey, // Using lightGrey for tintOnGradient in dark mode
		textPrimary: darkText, // Assuming primary text is the same as general text
		textSecondary: darkTabIconDefault, // Assuming secondary text is the same as default tab icon color
		border: transparentBorderDark,
		cardBackground: darkCardBackground,
		cardBorder: transparentBorderDark,
		containerBackground: transparentContainerDark,
		locked: darkTabIconDefault, // Assuming locked status uses default tab icon color
	},
};
