import { StyleSheet, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import { useRandomFeedback } from "./hooks/useRandomFeedback";
import { ThemedText } from "@/src/common/components/ThemedText";
import { FontWeights } from "@/src/common/constants/Styles";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";

const ResultText = ({ answerCorrect }: { answerCorrect: boolean }) => {
	const { currentPhrase } = useRandomFeedback(answerCorrect);
	const accentColor = useThemeColor({}, "accent");
	const successColor = useThemeColor({}, "success");
	const errorColor = useThemeColor({}, "error");
	const textColor = answerCorrect ? successColor : errorColor;

	// Create an animated value for the bounce effect
	const bounceAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Reset the value to 0 every time the component renders (or 'answerCorrect' changes)
		bounceAnim.setValue(0);
		// Start the bounce animation
		Animated.timing(bounceAnim, {
			toValue: 1, // Animate to 1
			duration: 800, // Duration of the animation
			easing: Easing.elastic(1), // Use an elastic easing for a bounce effect
			useNativeDriver: true, // Use native driver for better performance
		}).start();
	}, [answerCorrect, bounceAnim]); // Re-run animation when 'answerCorrect' changes

	// Interpolate the animated value to create a scale effect
	const scale = bounceAnim.interpolate({
		inputRange: [0, 0.5, 1], // Define points in the animation
		outputRange: [0.7, 1.3, 1], // Corresponding scale values
	});

	return (
		<Animated.View
			style={[
				styles.resultContainer,
				{
					transform: [{ scale: scale }], // Apply the scale transformation
				},
			]}
		>
			<ThemedText
				style={[
					styles.resultText,
					{ color: textColor, shadowColor: accentColor },
				]}
			>
				{currentPhrase}
			</ThemedText>
		</Animated.View>
	);
};

export default ResultText;

const styles = StyleSheet.create({
	resultContainer: {
		position: "absolute",
		bottom: "20%",
		zIndex: 4,
		alignSelf: "center",
    maxWidth: "80%",
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 1,
		shadowRadius: 1,
		elevation: 20,
	},
	resultText: {
		textAlign: "center",
		fontWeight: FontWeights.bold,
		fontSize: 30,
		lineHeight: 30,
	},
});
