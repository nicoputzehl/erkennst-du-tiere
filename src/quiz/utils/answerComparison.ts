import { colognePhonetic } from "./colognePhonetic";
import { normalizeString } from "./normalizeString";

export function arePhoneticallySimilar(answer1: string, answer2: string): boolean {
  if (!answer1.trim() || !answer2.trim()) {
    return false;
  }
  
  const phonetic1 = colognePhonetic(answer1);
  const phonetic2 = colognePhonetic(answer2);
  
  return phonetic1.length > 0 && phonetic1 === phonetic2;
}

export const isAnswerCorrect = (
  userAnswer: string,
  correctAnswer: string,
  alternativeAnswers?: string[]
): boolean => {
  if(!userAnswer || !correctAnswer) {
    return false
  }

  const normalizedUserAnswer = normalizeString(userAnswer);
  const normalizedCorrectAnswer = normalizeString(correctAnswer);

  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return true;
  }

  else if (arePhoneticallySimilar(userAnswer, correctAnswer)) {
    return true;
  }

  else  if (!alternativeAnswers?.length) {
    return false;
  }

  for (const alt of alternativeAnswers) {
    const normalizedAlt = normalizeString(alt);
    if (normalizedAlt === normalizedUserAnswer || 
        arePhoneticallySimilar(alt, userAnswer)) {
      return true;
    }
  }

  return false;
};

