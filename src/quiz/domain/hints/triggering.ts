// src/quiz/domain/hints/triggering.ts - DEBUG VERSION

import {  QuestionBase } from "../../types";
import { ContextualHint, HintState } from "../../types/hint";
import { normalizeString } from "../../utils/stringManipulation";
import { isAutoFreeHint, isContextualHint } from "./validation";

export const checkForContextualHints = (
  userAnswer: string,
  question: QuestionBase,
  hintState: HintState
): ContextualHint[] => {
  console.log('🎯 [checkForContextualHints] Input:', {
    userAnswer,
    questionId: question.id,
    hintsAvailable: !!question.hints,
    hintsCount: question.hints?.length || 0
  });

  if (!question.hints) {
    console.log('🎯 [checkForContextualHints] No hints available for question');
    return [];
  }
  
  const contextualHints = question.hints.filter(isContextualHint || isAutoFreeHint);
  console.log('🎯 [checkForContextualHints] Found contextual hints:', contextualHints.length);
  
  const normalizedUserAnswer = normalizeString(userAnswer);
  console.log('🎯 [checkForContextualHints] Normalized user answer:', normalizedUserAnswer);
  
  const triggeredHints = contextualHints.filter(hint => {
    console.log('🎯 [checkForContextualHints] Checking hint:', {
      hintId: hint.id,
      triggers: hint.triggers,
      alreadyTriggered: hintState.contextualHintsTriggered.includes(hint.id)
    });
    
    if (hintState.contextualHintsTriggered.includes(hint.id)) {
      console.log('🎯 [checkForContextualHints] Hint already triggered, skipping');
      return false;
    }
    
    const triggerMatches = hint.triggers.some(trigger => {
      const normalizedTrigger = normalizeString(trigger);
      const isMatch = normalizedUserAnswer.includes(normalizedTrigger);
      console.log('🎯 [checkForContextualHints] Trigger check:', {
        trigger,
        normalizedTrigger,
        normalizedUserAnswer,
        isMatch
      });
      return isMatch;
    });
    
    console.log('🎯 [checkForContextualHints] Hint triggered:', triggerMatches);
    return triggerMatches;
  });
  
  console.log('🎯 [checkForContextualHints] Final triggered hints:', {
    count: triggeredHints.length,
    hintIds: triggeredHints.map(h => h.id)
  });
  
  return triggeredHints;
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