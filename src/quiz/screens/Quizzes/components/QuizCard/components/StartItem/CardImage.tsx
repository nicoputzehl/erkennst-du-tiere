import { Image } from "expo-image";
import { memo } from "react";
import { styles } from "../../QuizCard.styles";
import type { QuizImageProps } from "../../QuizCard.types";
import { logWarn } from "@/src/common/helper/logging";
import { QuestionMarkIcon } from "./QuestionMarkIcon";
import { useCardImage } from "./useCardImage";

const PLACEHOLDER_IMAGE = require("@/assets/images/placeholder.jpg");

export const CardImage = memo(({ quiz }: QuizImageProps) => {
	const { imageSrc, hasImage } = useCardImage({ quiz });

	if (!hasImage) return <QuestionMarkIcon />;

	return (
		<Image
			source={imageSrc}
			contentFit="cover"
			cachePolicy="memory-disk"
			priority="high"
			placeholder={PLACEHOLDER_IMAGE}
			placeholderContentFit="cover"
			onError={(error) => {
				logWarn(`Failed to load quiz image for ${quiz.id}:`, error);
			}}
			allowDownscaling
			style={styles.image}
		/>
	);
});

CardImage.displayName = "QuizImage";
