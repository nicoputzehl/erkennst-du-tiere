import { QuestionStatus } from "@/src/quiz/types"; // Vereinfachte Types ohne Generics
import { useMemo } from "react";
import type { QuizImages } from "../types/image";
import { getLocalQuizImage, hasUnsolvedLocalImage } from "@/src/common/helper/getLocalQuizImage";

export enum ImageType {
	IMG = "img",
	THUMBNAIL = "thumbnail",
}

export const useImageDisplay = (
	images: QuizImages,
	status: QuestionStatus,
	answer?: string,
	quizTitle?: string
) => {
	const shouldShowUnsolvedImage = useMemo(() => {
		if (status === QuestionStatus.SOLVED) return false;

		return (
			hasUnsolvedLocalImage(answer ?? "", quizTitle ?? "") ||
			!!images.unsolvedImageUrl ||
			!!images.unsolvedImageName
		);
	}, [status, answer, images.unsolvedImageUrl, images.unsolvedImageName, quizTitle]);

	const getImageUrl = useMemo(() => {
		return (type: ImageType): number => {
			// 🔑 Entscheide final, ob unsolved wirklich benutzt wird
			const useUnsolved =
				status !== QuestionStatus.SOLVED &&
				hasUnsolvedLocalImage(answer || "", quizTitle || "");

			// 1️⃣ Lokales Asset
			if (answer) {

				const localAsset = getLocalQuizImage(answer, !useUnsolved, quizTitle || "");

				if (localAsset) {
					return localAsset;
				}
			}
			return 0; // Fallback, falls kein lokales Asset gefunden wird
		};
	}, [status, answer, quizTitle]);

	return {
		getImageUrl,
		shouldShowUnsolvedImage,
	};
};

