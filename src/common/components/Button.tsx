import React from "react";
import {
	type StyleProp,
	StyleSheet,
	type TextStyle,
	TouchableOpacity,
	type TouchableOpacityProps,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "../hooks/useColorScheme.web";
import { Colors } from "../constants/Colors";

interface ButtonProps extends TouchableOpacityProps {
	text: string;
	buttonStyle?: StyleProp<TextStyle>;
}

const Button = ({
	disabled,
	onPress,
	text,
	buttonStyle,
	style,
}: ButtonProps) => {
		const colorScheme = useColorScheme();
		const isDark = colorScheme === "dark";

		const buttonColor = isDark ? Colors.dark.buttonPrimary : Colors.light.buttonPrimary;
	return (
		<TouchableOpacity
			style={[styles.button, disabled && styles.disabledButton, style, { backgroundColor: buttonColor }]}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.8}
		>
			<ThemedText style={[styles.buttonText, buttonStyle]}>{text}</ThemedText>
		</TouchableOpacity>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#00ffbfac",
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 12,
		// width: "70%",
		alignItems: "center",
		justifyContent: "center",
		minHeight: 50,
		// Schatten
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	disabledButton: {
		opacity: 0.5,
		backgroundColor: "#ccc",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 16,
		letterSpacing: 0.5,
	},
});
