import { useEffect } from "react";
import {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

export const usePulsingAnimation = (isEnabled: boolean) => {
	const pulseState = useSharedValue(1);

	useEffect(() => {
		if (isEnabled) {
			const timer = setTimeout(() => {
				pulseState.value = withRepeat(
					withSequence(
						withTiming(1.01, { duration: 750 }),
						withTiming(0.99, { duration: 750 }),
					),
					-1,
					true,
				);
			}, 150);
			return () => clearTimeout(timer);
		}
		pulseState.value = 1;
	}, [isEnabled, pulseState]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: pulseState.value }],
		};
	});

	return { animatedStyle };
};
