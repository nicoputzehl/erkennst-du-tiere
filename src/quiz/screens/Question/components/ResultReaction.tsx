import { ColorsValues } from "@/src/common/constants/Colors.values";
import { AntDesign } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withSequence,
	withTiming,
	Easing,
} from "react-native-reanimated";

const ResultReaction = () => {
	const scale = useSharedValue(0);
	const rotation = useSharedValue(0);
	const opacity = useSharedValue(0);

	const color = ColorsValues.pumpkin;

	useEffect(() => {
		// Einblenden
		scale.value = withSpring(1, {
			damping: 14,
			stiffness: 120,
		});

		opacity.value = withTiming(1, { duration: 300 });

		rotation.value = withSequence(
			withTiming(-4, { duration: 120, easing: Easing.out(Easing.ease) }),
			withTiming(4, { duration: 180, easing: Easing.inOut(Easing.ease) }),
			withTiming(0, { duration: 120, easing: Easing.out(Easing.ease) }),
		);

		// Nach 5 Sekunden ausblenden
		const hideTimer = setTimeout(() => {
			scale.value = withTiming(0.85, { duration: 250 });
			opacity.value = withTiming(0, { duration: 250 });
		}, 5000);

		return () => clearTimeout(hideTimer);
	}, [opacity, rotation, scale]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [
			{ scale: scale.value },
			{ rotate: `${rotation.value}deg` },
		],
	}));

	return (
		<Animated.View style={[styles.container, animatedStyle]}>
			<AntDesign name="frown" size={24} color={color} />
			<Text>Versuch&apos;s nochmal</Text>
		</Animated.View>
	);
};

export default ResultReaction;

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		alignSelf: "center",
		bottom: "15%",
	},
});
