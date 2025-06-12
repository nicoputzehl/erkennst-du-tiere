import { ThemedText } from "@/src/common/components/ThemedText";
import { FontWeights } from "@/src/common/constants/Styles";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet } from "react-native";
import { useRandomFeedback } from "./hooks/useRandomFeedback";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // Get screen dimensions

const ResultText = ({ correctAnswer }: { correctAnswer: boolean }) => {
	const { currentPhrase } = useRandomFeedback(correctAnswer);

	// Determine text color based on correctness using the mocked hook
	const textColor = useThemeColor({}, "tintOnGradient");

	const translateXAnim = useRef(new Animated.Value(0)).current;
	const translateYAnim = useRef(new Animated.Value(0)).current;

	const getRandomOffscreenCoordinates = () => {
		const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
		let x = 0;
		let y = 0;

		switch (edge) {
			case 0: // From top
				x = Math.random() * screenWidth * 1.5 - screenWidth * 0.25; // Random X along top edge, extending beyond screen bounds
				y = -screenHeight * 1.2; // Y coordinate is off-screen top
				break;
			case 1: // From right
				x = screenWidth * 1.2; // X coordinate is off-screen right
				y = Math.random() * screenHeight * 1.5 - screenHeight * 0.25; // Random Y along right edge
				break;
			case 2: // From bottom
				x = Math.random() * screenWidth * 1.5 - screenWidth * 0.25; // Random X along bottom edge
				y = screenHeight * 1.2; // Y coordinate is off-screen bottom
				break;
			case 3: // From left
				x = -screenWidth * 1.2; // X coordinate is off-screen left
				y = Math.random() * screenHeight * 1.5 - screenHeight * 0.25; // Random Y along left edge
				break;
		}
		return { x, y };
	};

	useEffect(() => {
		translateXAnim.setValue(0);
		translateYAnim.setValue(0);

		// Determine random entry coordinates
		const entryCoords = getRandomOffscreenCoordinates();

		translateXAnim.setValue(entryCoords.x);
		translateYAnim.setValue(entryCoords.y);

		const exitCoords = getRandomOffscreenCoordinates();

		// Define the animation sequence:
		// 1. Slide in: Parallel animation of X and Y from random entry point to center (0,0).
		// 2. Hold: Pause in the center.
		// 3. Slide out: Parallel animation of X and Y from center (0,0) to random exit point.
		Animated.sequence([
			// Phase 1: Slide in from the random entry direction to the center (0,0)
			Animated.parallel([
				Animated.timing(translateXAnim, {
					toValue: 0, // Animate X to center (relative 0 translation)
					duration: 500, // Duration of slide-in
					easing: Easing.out(Easing.ease), // Smooth ease-out for landing
					useNativeDriver: true, // Use native driver for performance
				}),
				Animated.timing(translateYAnim, {
					toValue: 0, // Animate Y to center (relative 0 translation)
					duration: 500, // Duration of slide-in
					easing: Easing.out(Easing.ease), // Smooth ease-out for landing
					useNativeDriver: true, // Use native driver for performance
				}),
			]),

			// Phase 2: Hold in the center
			Animated.delay(1500), // Pause duration in the center (1.5 seconds)
			// Phase 3: Slide out to the random exit direction
			Animated.parallel([
				Animated.timing(translateXAnim, {
					toValue: exitCoords.x, // Animate X to the random exit X coordinate
					duration: 500, // Duration of slide-out
					easing: Easing.in(Easing.ease), // Smooth ease-in for exiting
					useNativeDriver: true, // Use native driver for performance
				}),
				Animated.timing(translateYAnim, {
					toValue: exitCoords.y, // Animate Y to the random exit Y coordinate
					duration: 500, // Duration of slide-out
					easing: Easing.in(Easing.ease), // Smooth ease-in for exiting
					useNativeDriver: true, // Use native driver for performance
				}),
			]),
		]).start(); // Start the defined animation sequence
	}, [correctAnswer, translateXAnim, translateYAnim]); // Re-run effect if 'correctAnswer' changes (or anim references change)


	return (
		<Animated.View
			style={[
				styles.resultContainer,
				{
					transform: [
						{ translateX: translateXAnim },
						{ translateY: translateYAnim },
					],
				},
			]}
		>

			<ThemedText style={[styles.resultText, { color: textColor }]}>
				{currentPhrase}
			</ThemedText>
		</Animated.View>
	);
};

export default ResultText;

const styles = StyleSheet.create({
	resultContainer: {
		position: "absolute",
		zIndex: 4,
		alignSelf: "center",
		height: "auto",
		width: "70%",
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		padding: 32,
		bottom: "60%",
		borderRadius: 16,
		justifyContent: "center",
	},
	resultText: {
		textAlign: "center",
		fontWeight: FontWeights.bold,
		fontSize: 30,
		lineHeight: 38,
	},
});
