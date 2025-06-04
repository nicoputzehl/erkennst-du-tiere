import { HintState, UserPointsState } from "@/src/quiz/types/hint";
import { HintUtils } from "..";
import { createAutoFreeHint, createContextualHint, createFirstLetterHint, createLetterCountHint } from "../factories";
import { Question } from "@/src/quiz/types";

describe('Hint System Integration', () => {
  const mockQuestion: Question = {
    id: 1,
    answer: 'Leopard',
    images: { imageUrl: 1 },
    hints: [
      createLetterCountHint(1),
      createFirstLetterHint(1),
      createContextualHint(1, ['jaguar'], 'Fast richtig! Aber diese Katze hat Rosetten.'),
      createAutoFreeHint(1, 'Diese Großkatze ist bekannt für ihre Kletterfähigkeiten.')
    ]
  };

  const mockHintState: HintState = {
    questionId: 1,
    usedHints: [],
    wrongAttempts: 0,
    contextualHintsTriggered: []
  };

  const mockUserPoints: UserPointsState = {
    totalPoints: 50,
    earnedPoints: 50,
    spentPoints: 0,
    pointsHistory: []
  };

  it('should handle complete hint workflow', () => {
    // 1. Check available hints initially
    let availableHints = mockQuestion.hints!.map(hint => {
      const validation = HintUtils.canUseHint(hint, mockHintState, mockUserPoints);
      return { hint, canUse: validation.canUse, reason: validation.reason };
    });

    expect(availableHints.filter(h => h.canUse)).toHaveLength(2); // Letter count + first letter

    // 2. User makes wrong answer -> trigger contextual hint
    let currentHintState = { ...mockHintState, wrongAttempts: 1 };
    const triggeredHints = HintUtils.checkForContextualHints('jaguar', mockQuestion, currentHintState);
    
    expect(triggeredHints).toHaveLength(1);
    
    // 3. Update hint state with triggered contextual hint
    currentHintState = {
      ...currentHintState,
      contextualHintsTriggered: [triggeredHints[0].id]
    };

    // 4. Check available hints after trigger
    availableHints = mockQuestion.hints!.map(hint => {
      const validation = HintUtils.canUseHint(hint, currentHintState, mockUserPoints);
      return { hint, canUse: validation.canUse, reason: validation.reason };
    });

    expect(availableHints.filter(h => h.canUse)).toHaveLength(3); // +contextual hint

    // 5. User makes more wrong answers -> auto-free hint becomes available
    currentHintState = { ...currentHintState, wrongAttempts: 5 };
    
    availableHints = mockQuestion.hints!.map(hint => {
      const validation = HintUtils.canUseHint(hint, currentHintState, mockUserPoints);
      return { hint, canUse: validation.canUse, reason: validation.reason };
    });

    expect(availableHints.filter(h => h.canUse)).toHaveLength(4); // All hints available
  });

  it('should calculate points correctly for complex questions', () => {
    const points = HintUtils.calculatePointsForCorrectAnswer(mockQuestion);
    
    expect(points).toBe(18); // 10 base + (4 hints * 2) bonus
  });
});

