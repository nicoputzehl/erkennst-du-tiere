import { QuestionStatus, QuizQuestion } from "@/src/quiz/types";
import { useMemo } from "react";


export enum ImageType {
  IMG = 'img',
  THUMBNAIL = 'thumbnail',

}

interface UseImageDisplayReturn {
  getImageUrl: (type: ImageType) => string;
  shouldShowUnsolvedImage: boolean;
}

export const useImageDisplay = (question: QuizQuestion): UseImageDisplayReturn => {
  // Closure Factory: Erstellt Funktionen basierend auf Image-Type
  const createImageSelector = useMemo(() => {
    return (type: ImageType) => {
      // Innere Closure: Prüft Status und gibt entsprechende URL zurück
      return (showUnsolved: boolean): string => {
        if (type === ImageType.IMG) {
          return showUnsolved && question.images.unsolvedImageUrl
            ? question.images.unsolvedImageUrl
            : question.images.imageUrl;
        } else {
          return showUnsolved && question.images.unsolvedThumbnailUrl
            ? question.images.unsolvedThumbnailUrl
            : question.images.thumbnailUrl || question.images.imageUrl;
        }
      };
    };
  }, [question.images]);

  // Bestimme ob unsolved Images gezeigt werden sollen
  const shouldShowUnsolvedImage = useMemo(() => {
    return question.status !== QuestionStatus.SOLVED &&
      (!!question.images.unsolvedImageUrl || !!question.images.unsolvedThumbnailUrl);
  }, [question.status, question.images.unsolvedImageUrl, question.images.unsolvedThumbnailUrl]);

  // Public API: Einfache Funktion die Type entgegennimmt
  const getImageUrl = useMemo(() => {
    return (type: ImageType): string => {
      const imageSelector = createImageSelector(type);
      return imageSelector(shouldShowUnsolvedImage);
    };
  }, [createImageSelector, shouldShowUnsolvedImage]);

  return {
    getImageUrl,
    shouldShowUnsolvedImage,
  };
};