import { UnlockProgress } from "@/src/quiz/hooks";
import { Quiz } from "@/src/quiz/types";

export type QuizCardActiveProps = {
  quiz: Quiz;
  quizCardProgress: number;
  quizCardProgressString: string | null;
  onPress: (id: string) => void;
  isLoading: boolean;
};

export type QuizCardLockedProps = {
	quiz: Quiz;
	unlockProgress: UnlockProgress | null;
};
