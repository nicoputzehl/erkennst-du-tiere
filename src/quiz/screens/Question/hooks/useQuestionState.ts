import type { Question } from "@/src/quiz";
import { useQuiz } from "@/src/quiz/store/hooks/useQuiz";
import { useMemo } from "react";
import type { QuestionScreenProps } from "../QuestionScreen";

export const useQuestionState = ({
	quizId,
	questionId,
}: QuestionScreenProps) => {
	const { getQuizState } = useQuiz();
	const { quizState, question, isLoading } = useMemo(() => {
		if (!quizId || !questionId) {
			return { quizState: null, question: null, isLoading: false };
		}

		const state = getQuizState(quizId);
		const questionNumber = Number.parseInt(questionId);

		if (Number.isNaN(questionNumber)) {
			return { quizState: state, question: null, isLoading: false };
		}

		const foundQuestion = state?.questions.find(
			(q: Question) => q.id === questionNumber,
		);

		return {
			quizState: state,
			question: foundQuestion,
			isLoading: false,
		};
	}, [quizId, questionId, getQuizState]);

	return { quizState, question, isLoading };
};
