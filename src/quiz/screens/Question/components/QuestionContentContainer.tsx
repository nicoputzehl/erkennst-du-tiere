import type { Question } from "@/src/quiz/types";
import { type PropsWithChildren, memo } from "react";
import {
	Animated,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from "react-native";
import { ImageType, useImageDisplay } from "../../../hooks/useImageDisplay";
import { useKeyboardHandling } from "../hooks/useKeyboardHandling";
import { QuestionImage } from "./QuestionImage";

interface QuestionContentContainerProps extends PropsWithChildren {
	question: Question;
}

export const QuestionContentContainer: React.FC<QuestionContentContainerProps> =
	memo(({ question, children }) => {
		const { imageHeight } = useKeyboardHandling({ initialImageHeight: 400 });
		const { getImageUrl } = useImageDisplay(question);

		return (
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<View style={{ flex: 1, justifyContent: "space-between" }}>
					<View>
						<Animated.View
							style={[styles.imageContainer, { height: imageHeight }]}
						>
							<QuestionImage
								imageUrl={getImageUrl(ImageType.IMG)}
								thumbnailUrl={getImageUrl(ImageType.THUMBNAIL)}
								animatedHeight={imageHeight}
							/>
						</Animated.View>
					</View>
					{children}
				</View>
			</KeyboardAvoidingView>
		);
	});

QuestionContentContainer.displayName = "QuestionContentContainer";

const styles = StyleSheet.create({
	imageContainer: {
		width: "100%",
		overflow: "hidden",
	},
});
