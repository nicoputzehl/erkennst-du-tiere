import { BorderRadius, Shadows } from "@/src/common/constants/Styles";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";
import { Image } from "expo-image";
import type React from "react";
import {  type PropsWithChildren, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, StyleSheet, View } from "react-native";
import { useKeyboardHandling } from "../hooks/useKeyboardHandling";
import type { Question } from "@/src/quiz/types";
import { ImageType, useImageDisplay } from "@/src/quiz/hooks";

interface QuestionImageProps {
	question: Question;
}

export const QuestionImage: React.FC<QuestionImageProps & PropsWithChildren> = 
	({ question, children }) => {
		const [isLoading, setIsLoading] = useState(true);
		const { getImageUrl } = useImageDisplay(question.images, question.status);

		const initialImageWidth =
			Dimensions.get("window").width -
			(styles.imageWrapper.paddingHorizontal || 0) * 2; // Berücksichtige das horizontale Padding
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
					source={getImageUrl(ImageType.IMG)}
					style={[styles.image, !!getImageUrl(ImageType.THUMBNAIL) && styles.fullImageOverlay]}
					contentFit="cover"
					cachePolicy="memory-disk"
					transition={getImageUrl(ImageType.THUMBNAIL) ? 400 : 300}
					priority="high"
					placeholder={
						!getImageUrl(ImageType.THUMBNAIL)
							? require("@/assets/images/placeholder.jpg")
							: undefined
					}
					placeholderContentFit="cover"
					onLoad={() => setIsLoading(false)}
					onError={(error) => {
						console.warn("Failed to load question image:", error);
						setIsLoading(false);
					}}
					allowDownscaling={true}
					recyclingKey={getImageUrl(ImageType.IMG).toString()}
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
