import { useCallback, useState } from "react";
import type { WrongAnswerHint } from "../Question.types";


export const useResultState = () => {
	const [showResult, setShowResult] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [statusChanged, setStatusChanged] = useState(false);
	const [hint, setHint] = useState<WrongAnswerHint | undefined>(undefined);

	const resetResult = useCallback(() => {
		setShowResult(false);
		setStatusChanged(false);
		setHint(undefined);
	}, []);

	return {
		showResult,
		setShowResult,
		isCorrect,
		setIsCorrect,
		statusChanged,
		setStatusChanged,
		hint,
		setHint,
		resetResult
	};
};