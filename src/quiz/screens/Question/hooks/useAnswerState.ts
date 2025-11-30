import { useCallback, useEffect, useState } from "react";

export const useAnswerState = (initialLetter = "") => {
	const [answer, setAnswer] = useState(initialLetter);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submittedAnswer, setSubmittedAnswer] = useState(false);

	useEffect(() => {
		if (initialLetter && !answer.startsWith(initialLetter)) {
			setAnswer(initialLetter);
		}
	}, [initialLetter, answer]);

	const resetSubmittedAnswer = useCallback(() => {
		setSubmittedAnswer(false);
	}, []);

	const handleChangeAnswer = useCallback(
		(newAnswer: string) => {
			if (!newAnswer.startsWith(initialLetter)) {
				setAnswer(initialLetter + newAnswer.substring(initialLetter.length));
			} else {
				setAnswer(newAnswer);
			}
			resetSubmittedAnswer();
		},
		[initialLetter, resetSubmittedAnswer],
	);

	const clearAnswer = useCallback(() => {
		setAnswer(initialLetter);
		resetSubmittedAnswer();
	}, [initialLetter, resetSubmittedAnswer]);

	return {
		answer,
		handleChangeAnswer,
		isSubmitting,
		setIsSubmitting,
		clearAnswer,
		submittedAnswer,
		setSubmittedAnswer,
	};
};
