import { BorderRadius, Shadows } from "@/src/common/constants/Styles";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { Image } from "expo-image";
import type React from "react";
import { type PropsWithChildren, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, StyleSheet, View } from "react-native";
import { useKeyboardHandling } from "../hooks/useKeyboardHandling";
import type { Question } from "@/src/quiz/types";
import { useImageDisplay } from "@/src/quiz/hooks";
import { logWarn } from "@/src/common/helper/logging";

interface QuestionImageProps {
	question: Question;
	quizTitle?: string;
}

export const QuestionImage: React.FC<QuestionImageProps & PropsWithChildren> =
	({ question, quizTitle, children }) => {
		const [isLoading, setIsLoading] = useState(true);

		const { getImageUrl } = useImageDisplay(question.status, question.answer, quizTitle);

		const initialImageWidth =
			Dimensions.get("window").width -
			(styles.imageWrapper.paddingHorizontal || 0) * 2;
		const { imageSize } = useKeyboardHandling({
			initialImageSize: initialImageWidth,
		});

		const tintColor = useThemeColor({}, "tint");

		return (
			<Animated.View
				style={[
					styles.imageContainer,
					{ height: imageSize, width: imageSize },
				]}
			>
				{isLoading && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator size="large" color={tintColor} />
					</View>
				)}
				<Image
					source={getImageUrl()}
					style={[styles.image, !!getImageUrl() && styles.fullImageOverlay]}
					contentFit="cover"
					cachePolicy="memory-disk"
					transition={getImageUrl() ? 400 : 300}
					priority="high"
					placeholder={
						!getImageUrl()
							? require("@/assets/images/placeholder.jpg")
							: undefined
					}
					placeholderContentFit="cover"
					onLoad={() => setIsLoading(false)}
					onError={(error) => {
						logWarn("Failed to load question image:", error);
						setIsLoading(false);
					}}
					allowDownscaling={true}
					recyclingKey={getImageUrl().toString()}
				/>
				<View style={styles.childContainer}>

					{children}
				</View>
			</Animated.View>
		);
	}

QuestionImage.displayName = "QuestionImage";

const styles = StyleSheet.create({
	container: {
		width: "100%",
		borderRadius: BorderRadius.md,
		overflow: "hidden",
		position: "relative",

	},
	childContainer: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		padding: 8,
		justifyContent: "flex-end",
		height: "100%",
	},
	image: {
		height: "100%",
		width: "100%",
		boxShadow: Shadows.boxShadow,
	},
	fullImageOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1,
	},
	imageContainer: {
		overflow: "hidden",
		borderRadius: 16,
	},
	imageWrapper: {
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 16,
		width: "100%",
		gap: 16
	},
});
