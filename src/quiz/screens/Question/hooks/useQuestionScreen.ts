import { QuizUtils } from "@/src/quiz/domain/quiz";
import { useHints } from "@/src/quiz/store/hooks/useHints";
import { useQuiz } from "@/src/quiz/store/hooks/useQuiz";
import { QuestionStatus } from "@/src/quiz/types";
import { useCallback, useEffect, useMemo } from "react";
import { useAnswerState } from "./useAnswerState";
import { useQuestionBusinessLogic } from "./useQuestionBusinessLogic";
import { useQuestionNavigation } from "./useQuestionNavigation";
import { useResultState } from "./useQuestionResultState";

export function useQuestionScreen(quizId: string, questionId: string) {
	const { getQuizState } = useQuiz();
	const { hasVisibleHints, visibleHints, firstLetterHint } = useHints(quizId, Number.parseInt(questionId));

	const navigation = useQuestionNavigation(quizId, questionId);
	const answerState = useAnswerState(firstLetterHint?.value || "");
	const resultState = useResultState();

	const quizState = getQuizState(quizId);
	const nextQuestionId = useMemo(() => {
		return QuizUtils.getNextQuestionId(quizState, Number.parseInt(questionId));
	}, [questionId, quizState]);


	const navigateToNextQuestion = useCallback(() => {
		if(nextQuestionId) {
			navigation.navigateToQuestionFromQuestion(nextQuestionId.toString());
		}
	},[nextQuestionId, navigation]);
	console.warn({ nextQuestionId })

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


	useEffect(() => {
		if (isSolved) {
			resultState.setShowResult(true);
			resultState.setIsCorrect(true);
		}
	}, [isSolved, resultState]);

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
		hasVisibleHints,
		showInput,
		headerText,


		...answerState,
		...resultState,
		...navigation,

navigateToNextQuestion,
		handleSubmit,
		showResultReaction,
		visibleHints,
		isSolved
	};
}
