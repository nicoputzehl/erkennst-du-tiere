import { Question } from "../../types";
import { ContextualHint, HintState } from "../../types/hint";
import { normalizeString } from "../../utils/stringManipulation";
import { isContextualHint } from "./validation";

export const checkForContextualHints = (
  userAnswer: string,
  question: Question,
  hintState: HintState
): ContextualHint[] => {
  if (!question.hints) return [];
  
  const contextualHints = question.hints.filter(isContextualHint);
  
  return contextualHints.filter(hint => {
    if (hintState.contextualHintsTriggered.includes(hint.id)) {
      return false;
    }
    
    return hint.triggers.some(trigger => 
      normalizeString(userAnswer).includes(normalizeString(trigger))
    );
  });
};

export const getTriggeredContent = (
  hint: ContextualHint, 
  userAnswer: string
): string => {
  if (hint.triggerSpecificContent) {
    const normalizedAnswer = normalizeString(userAnswer);
    for (const [trigger, specificContent] of Object.entries(hint.triggerSpecificContent)) {
      if (normalizedAnswer.includes(normalizeString(trigger))) {
        return specificContent;
      }
    }
  }
  
  return hint.content;
};