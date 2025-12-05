import { ThemedText } from "@/src/common/components/ThemedText";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

export interface ToastProps {
	visible: boolean;
	message: string;
	type?: "success" | "info" | "warning" | "error";
	duration?: number;
	onHide: () => void;
	onFinishRemove?: () => void;
	position?: "top" | "bottom";
	index?: number;
}

export const Toast: React.FC<ToastProps> = ({
	visible,
	message,
	type = "info",
	duration = 30000,
	onHide,
	onFinishRemove,
	position = "top",
	index = 0,
}) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(0)).current;
	const indexAnim = useRef(new Animated.Value(index)).current;

	const hideTimeoutRef = useRef<number | undefined>(undefined);



	const hideToast = useCallback(() => {
		console.log("[Toast] Hiding toast");
		onHide();
	}, [onHide]);

	useEffect(() => {
		Animated.spring(indexAnim, {
			toValue: index,
			useNativeDriver: true,
		}).start();
	}, [index, indexAnim]);

	useEffect(() => {
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
		}

		if (visible) {
			console.log(`[Toast] Showing toast: "${message}"`);

			// Show animation
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(slideAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();

			// Auto-hide after duration
			hideTimeoutRef.current = setTimeout(() => {
				hideToast();
			}, duration) as unknown as number;
		} else {
			// Hide animation
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 250,
					useNativeDriver: true,
				}),
				Animated.timing(slideAnim, {
					toValue: -40,
					duration: 250,
					useNativeDriver: true,
				}),
			]).start(() => {
				onFinishRemove?.();
			});
		}


		return () => {
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current);
			}
		};
	}, [visible, message, duration, position, fadeAnim, slideAnim, hideToast, onFinishRemove]);



	const getBackgroundColor = () => {
		switch (type) {
			case "success":
				return "#4CAF50";
			case "error":
				return "#F44336";
			case "warning":
				return "#FF9800";
			default:
				return "#2196F3";
		}
	};

	return (
		<Animated.View
			style={[
				styles.toastContainer,
				position === "top" ? styles.topPosition : styles.bottomPosition,
				{
					opacity: fadeAnim,
					// Warunm 60?
					// Toast-Höhe  +  Margin
					// ≈ 48–56 px   +  4–8 px
					transform: [
						{ translateY: Animated.multiply(indexAnim, 60) },
						{ translateY: slideAnim },
					],
					backgroundColor: getBackgroundColor(),
				},
			]}
		>
			<TouchableOpacity style={styles.toastContent} onPress={hideToast}>
				<ThemedText style={styles.toastText}>{message}</ThemedText>
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	toastContainer: {
		position: "relative",
		left: 16,
		right: 16,
		borderRadius: 8,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 9999,
		marginTop: -8,
	},
	topPosition: {
		top: 50,
	},
	bottomPosition: {
		bottom: 100,
	},
	toastContent: {
		padding: 16,
	},
	toastText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
});
