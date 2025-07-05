import { useHints } from "@/src/quiz/store/hooks/useHints";
import { useQuiz } from "@/src/quiz/store/hooks/useQuiz";
import { QuestionStatus } from "@/src/quiz/types";
import { useMemo, useState } from "react";
import { useAnswerState } from "./useAnswerState";
import { useQuestionBusinessLogic } from "./useQuestionBusinessLogic";
import { useQuestionNavigation } from "./useQuestionNavigation";
import { useResultState } from "./useQuestionResultState";

export function useQuestionScreen(quizId: string, questionId: string) {
	const { getQuizState } = useQuiz();
	const { hasVisibleHints } = useHints(quizId, Number.parseInt(questionId));


	const navigation = useQuestionNavigation(quizId, questionId);
	const answerState = useAnswerState();
	const resultState = useResultState();

	const quizState = getQuizState(quizId);
	const question = quizState?.questions.find(
		(q) => q.id === Number.parseInt(questionId),
	);

	const isSolved = question?.status === QuestionStatus.SOLVED;
	const showInput = useMemo(() => !isSolved, [isSolved]);


	const { handleSubmit } = useQuestionBusinessLogic({
		quizId,
		questionId,
		question,
		answerState,
		resultState,
	});


	useState(() => {
		if (isSolved) {
			resultState.setShowResult(true);
			resultState.setIsCorrect(true);
		}
	});

	const headerText = useMemo(() => {
		if (isSolved && question?.answer) {
			return question.answer;
		}
		return question?.title || "Wie heißt das Tier?";
	}, [isSolved, question?.answer, question?.title]);

	const showResultReaction =
		answerState.submittedAnswer &&
		resultState.showResult &&
		!resultState.showHint;

	return {

		quizState,
		question,
		isSolved,
		hasVisibleHints,
		showInput,
		headerText,


		...answerState,
		...resultState,
		...navigation,


		handleSubmit,
		showResultReaction,
	};
}
