import { Image } from "expo-image";
import { memo } from "react";
import { styles } from "../QuizCard.styles";
import type { QuizImageProps } from "../QuizCard.types";

export const QuizCardImage = memo(({ quiz }: QuizImageProps) => (
	<Image
		source={quiz.titleImage || require("@/assets/images/test-title.jpg")}
		contentFit="cover"
		cachePolicy="memory-disk"
		priority="high"
		placeholder={require("@/assets/images/placeholder.jpg")}
		placeholderContentFit="cover"
		onError={(error) => {
			console.warn(`Failed to load quiz image for ${quiz.id}:`, error);
		}}
		allowDownscaling
		style={styles.image}
	/>
));

QuizCardImage.displayName = "QuizImage";
