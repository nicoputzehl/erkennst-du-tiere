import { useQuiz } from "@/src/quiz/store";
import type { QuizImageProps } from "../../QuizCard.types";
import { useImageDisplay } from "@/src/quiz/hooks";
import { QuestionStatus } from "@/src/quiz/types";

export const useCardImage = ({ quiz }: QuizImageProps) => {
  const { titleImage } = quiz;
  const { getLastAnsweredQuestion } = useQuiz();


  const { getImageUrl } = useImageDisplay(QuestionStatus.SOLVED, getLastAnsweredQuestion(quiz.id) || "", quiz.title);
  const imageSrc = getImageUrl();

  const hasImage = Boolean(titleImage || imageSrc);

  return {
    imageSrc: titleImage || imageSrc,
    hasImage,
  };
}