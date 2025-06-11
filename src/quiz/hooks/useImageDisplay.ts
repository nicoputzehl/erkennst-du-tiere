import { QuestionStatus } from "@/src/quiz/types"; // Vereinfachte Types ohne Generics
import { useMemo } from "react";
import type { QuizImages } from "../types/image";

export enum ImageType {
	IMG = "img",
	THUMBNAIL = "thumbnail",
}

interface UseImageDisplayReturn {
	getImageUrl: (type: ImageType) => number;
	shouldShowUnsolvedImage: boolean;
}

export const useImageDisplay = (
	images: QuizImages,
	status: QuestionStatus,
): UseImageDisplayReturn => {
	// Kein Generic!
	// Closure Factory: Erstellt Funktionen basierend auf Image-Type
	const createImageSelector = useMemo(() => {
		return (type: ImageType) => {
			// Innere Closure: Prüft Status und gibt entsprechende URL zurück
			return (showUnsolved: boolean): number => {
				if (type === ImageType.IMG) {
					return showUnsolved && images.unsolvedImageUrl
						? images.unsolvedImageUrl
						: images.imageUrl;
				}
				return showUnsolved && images.unsolvedThumbnailUrl
					? images.unsolvedThumbnailUrl
					: images.thumbnailUrl || images.imageUrl;
			};
		};
	}, [images]);

	// Bestimme ob unsolved Images gezeigt werden sollen
	const shouldShowUnsolvedImage = useMemo(() => {
		return (
			status !== QuestionStatus.SOLVED &&
			(!!images.unsolvedImageUrl || !!images.unsolvedThumbnailUrl)
		);
	}, [status, images.unsolvedImageUrl, images.unsolvedThumbnailUrl]);

	// Public API: Einfache Funktion die Type entgegennimmt
	const getImageUrl = useMemo(() => {
		return (type: ImageType): number => {
			const imageSelector = createImageSelector(type);
			return imageSelector(shouldShowUnsolvedImage);
		};
	}, [createImageSelector, shouldShowUnsolvedImage]);

	return {
		getImageUrl,
		shouldShowUnsolvedImage,
	};
};
