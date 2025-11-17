import { colognePhonetic, normalizeString } from "./utils/stringManipulation";

export function arePhoneticallySimilar(
	answer1: string,
	answer2: string,
): boolean {
	if (!answer1 || !answer2) {
		return false;
	}

	const trimmedAnswer1 = answer1.trim();
	const trimmedAnswer2 = answer2.trim();

	if (!trimmedAnswer1 || !trimmedAnswer2) {
		return false;
	}

	const phonetic1 = colognePhonetic(trimmedAnswer1);
	const phonetic2 = colognePhonetic(trimmedAnswer2);

	return (
		phonetic1.length > 0 && phonetic2.length > 0 && phonetic1 === phonetic2
	);
}

export const isAnswerCorrect = (
	userAnswer: string,
	correctAnswer: string,
	alternativeAnswers?: string[],
): boolean => {
	if (!userAnswer || !correctAnswer) {
		return false;
	}

	const normalizedUserAnswer = normalizeString(userAnswer);
	const normalizedCorrectAnswer = normalizeString(correctAnswer);

	if (normalizedUserAnswer === normalizedCorrectAnswer) {
		return true;
	}

	if (arePhoneticallySimilar(userAnswer, correctAnswer)) {
		return true;
	}

	if (alternativeAnswers?.length) {
		for (const alt of alternativeAnswers) {
			if (!alt) continue;
			const normalizedAlt = normalizeString(alt);

			if (
				normalizedAlt === normalizedUserAnswer ||
				arePhoneticallySimilar(alt, userAnswer)
			) {
				return true;
			}
		}
	}

	return false;
};
