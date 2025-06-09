import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import type React from "react";
import { memo, useEffect, useRef } from "react";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";

interface AnswerInputProps {
	value: string;
	onChangeText: (text: string) => void;
	onSubmitEditing: () => void;
	isSubmitting?: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = memo(
	({ value, onChangeText, onSubmitEditing, isSubmitting = false }) => {
		const inputRef = useRef<TextInput>(null);

		const textColor = useThemeColor({}, "text") as string;
		const tintColor = useThemeColor({}, "tint") as string;
		const placeholderColor = useThemeColor(
			{ light: "#666", dark: "#666" },
			"text",
		) as string;

		useEffect(() => {
			const timer = setTimeout(() => {
				inputRef.current?.focus();
			}, 300);
			return () => clearTimeout(timer);
		}, []);

		useEffect(() => {
			if (isSubmitting) {
				inputRef.current?.blur();
				Keyboard.dismiss();
			}
		}, [isSubmitting]);

		const handleSubmit = () => {
			if (!value.trim() || isSubmitting) return;
			Keyboard.dismiss();
			onSubmitEditing();
		};

		return (
			<View style={styles.container}>
				<View style={styles.inputContainer}>
					<TextInput
						ref={inputRef}
						style={[
							styles.input,
							{
								color: textColor,
								borderBottomColor: tintColor,
							},
							isSubmitting && styles.inputDisabled,
						]}
						value={value}
						onChangeText={onChangeText}
						onSubmitEditing={handleSubmit}
						autoCapitalize="none"
						autoCorrect={false}
						placeholder="Antwort eingeben..."
						placeholderTextColor={placeholderColor}
						textAlignVertical="center"
						editable={!isSubmitting}
						returnKeyType="done"
						submitBehavior="blurAndSubmit"
						maxLength={50}
					/>
				</View>
			</View>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.value === nextProps.value &&
			prevProps.isSubmitting === nextProps.isSubmitting &&
			prevProps.onChangeText === nextProps.onChangeText &&
			prevProps.onSubmitEditing === nextProps.onSubmitEditing
		);
	},
);

AnswerInput.displayName = "AnswerInput";

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
		alignItems: "center",
		width: "100%",
	},
	inputContainer: {
		width: "85%",
		marginBottom: 16,
	},
	input: {
		height: 50,
		borderWidth: 0,
		borderBottomWidth: 2,
		paddingHorizontal: 12,
		paddingVertical: 8,
		fontSize: 18,
		backgroundColor: "transparent",
		textAlign: "center",
		fontWeight: "500",
	},
	inputDisabled: {
		opacity: 0.7,
	},
});
