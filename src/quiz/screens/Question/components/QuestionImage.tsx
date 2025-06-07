import { Image } from "expo-image";
import type React from "react";
import { memo, useState } from "react";
import { StyleSheet, Animated, View, ActivityIndicator } from "react-native";
import { useThemeColor } from "@/src/common/hooks/useThemeColor";

interface QuestionImageProps {
	imageUrl: number;
	thumbnailUrl?: number;
	animatedHeight?: Animated.Value;
}

export const QuestionImage: React.FC<QuestionImageProps> = memo(
	({ imageUrl, thumbnailUrl, animatedHeight }) => {
		const [isLoading, setIsLoading] = useState(true);

		// Sicherstellen dass nur ein String zurückgegeben wird
		const backgroundColor = useThemeColor(
			{ light: "rgba(0, 0, 0, 0.05)", dark: "rgba(255, 255, 255, 0.1)" },
			"background",
		) as string;

		const tintColor = useThemeColor({}, "tint") as string;

		return (
			<Animated.View
				style={[
					styles.container,
					{ backgroundColor },
					animatedHeight && { height: animatedHeight },
				]}
			>
				{isLoading && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator size="large" color={tintColor} />
					</View>
				)}
				<Image
					source={imageUrl}
					style={[styles.image, !!thumbnailUrl && styles.fullImageOverlay]}
					contentFit="cover"
					cachePolicy="memory-disk"
					transition={thumbnailUrl ? 400 : 300}
					priority="high"
					placeholder={
						!thumbnailUrl
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
					recyclingKey={imageUrl.toString()}
				/>
			</Animated.View>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.imageUrl === nextProps.imageUrl &&
			prevProps.thumbnailUrl === nextProps.thumbnailUrl &&
			prevProps.animatedHeight === nextProps.animatedHeight
		);
	},
);

QuestionImage.displayName = "QuestionImage";

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 400,
		borderRadius: 0,
		overflow: "hidden",
		position: "relative",
	},
	image: {
		width: "100%",
		height: "100%",
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
});
