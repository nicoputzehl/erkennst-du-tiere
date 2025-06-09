import { type Question, QuestionStatus } from "@/src/quiz/types"; // Vereinfachte Types ohne Generics
import { useMemo } from "react";

export enum ImageType {
	IMG = "img",
	THUMBNAIL = "thumbnail",
}

interface UseImageDisplayReturn {
	getImageUrl: (type: ImageType) => number;
	shouldShowUnsolvedImage: boolean;
}

export const useImageDisplay = (question: Question): UseImageDisplayReturn => {
	// Kein Generic!
	// Closure Factory: Erstellt Funktionen basierend auf Image-Type
	const createImageSelector = useMemo(() => {
		return (type: ImageType) => {
			// Innere Closure: Prüft Status und gibt entsprechende URL zurück
			return (showUnsolved: boolean): number => {
				if (type === ImageType.IMG) {
					return showUnsolved && question.images.unsolvedImageUrl
						? question.images.unsolvedImageUrl
						: question.images.imageUrl;
				}
				return showUnsolved && question.images.unsolvedThumbnailUrl
					? question.images.unsolvedThumbnailUrl
					: question.images.thumbnailUrl || question.images.imageUrl;
			};
		};
	}, [question.images]);

	// Bestimme ob unsolved Images gezeigt werden sollen
	const shouldShowUnsolvedImage = useMemo(() => {
		return (
			question.status !== QuestionStatus.SOLVED &&
			(!!question.images.unsolvedImageUrl ||
				!!question.images.unsolvedThumbnailUrl)
		);
	}, [
		question.status,
		question.images.unsolvedImageUrl,
		question.images.unsolvedThumbnailUrl,
	]);

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
