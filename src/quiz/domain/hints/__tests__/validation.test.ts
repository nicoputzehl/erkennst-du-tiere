import { type AutoFreeHint, type ContextualHint, type CustomHint, type Hint, HintType, type StandardHint } from "@/src/quiz/types";
import { canUseHint, canTriggerContextualHint, isStandardHint, isCustomHint, isContextualHint, isAutoFreeHint } from "../validation";


describe("canUseHint", () => {
  // Mock HintState and UserPointsState for testing
  const mockHintState = {
    questionId: 1,
    usedHints: [] as Hint[],
    wrongAttempts: 0,
    autoFreeHintsUsed: [] as string[],
  };

  const mockGlobalUserPoints = {
    totalPoints: 100,
    earnedPoints: 100,
    spentPoints: 0,
    pointsHistory: [],
  };

  // Reset mocks before each test
  beforeEach(() => {
    mockHintState.usedHints = [];
    mockHintState.wrongAttempts = 0;
    mockHintState.autoFreeHintsUsed = [];
    mockGlobalUserPoints.totalPoints = 100;
  });

  it("should return false if hint is already used (in usedHints)", () => {
    const hint = { id: "h1", type: HintType.CUSTOM, title: "Hint 1", content: "Content 1", cost: 10 } as Hint;
    mockHintState.usedHints.push(hint);
    const result = canUseHint(hint, mockHintState, mockGlobalUserPoints);
    expect(result.canUse).toBe(false);
    expect(result.reason).toBe("Hint bereits verwendet");
  });

  describe("AutoFreeHint", () => {
    it("should return false if auto-free hint is already used (in autoFreeHintsUsed)", () => {
      const hint: AutoFreeHint = { id: "af1", type: HintType.AUTO_FREE, title: "Auto Free Hint 1", content: "Auto Content", triggerAfterAttempts: 3 };
      mockHintState.autoFreeHintsUsed.push("af1");
      const result = canUseHint(hint, mockHintState, mockGlobalUserPoints);
      expect(result.canUse).toBe(false);
      expect(result.reason).toBe("Hint bereits verwendet");
    });

    it("should return false if wrong attempts are less than triggerAfterAttempts", () => {
      const hint: AutoFreeHint = { id: "af1", type: HintType.AUTO_FREE, title: "Auto Free Hint 1", content: "Auto Content", triggerAfterAttempts: 3 };
      mockHintState.wrongAttempts = 2;
      const result = canUseHint(hint, mockHintState, mockGlobalUserPoints);
      expect(result.canUse).toBe(false);
      expect(result.reason).toBe("Erst nach 3 falschen Versuchen");
    });

    it("should return true if wrong attempts are greater than or equal to triggerAfterAttempts and not used", () => {
      const hint: AutoFreeHint = { id: "af1", type: HintType.AUTO_FREE, title: "Auto Free Hint 1", content: "Auto Content", triggerAfterAttempts: 3 };
      mockHintState.wrongAttempts = 3;
      const result = canUseHint(hint, mockHintState, mockGlobalUserPoints);
      expect(result.canUse).toBe(true);
      expect(result.reason).toBeUndefined();
    });
  });

  describe("ContextualHint", () => {
    it("should always return false for contextual hints with a specific reason", () => {
      const hint: ContextualHint = { id: "c1", type: HintType.CONTEXTUAL, title: "Contextual Hint 1", content: "Context Content", triggers: ["trigger"] };
      const result = canUseHint(hint, mockHintState, mockGlobalUserPoints);
      expect(result.canUse).toBe(false);
      expect(result.reason).toBe("Wird durch Antworten ausgelöst");
    });
  });

  describe("StandardHint and CustomHint (Purchasable Hints)", () => {
    it("should return false if not enough points for StandardHint", () => {
      const hint: StandardHint = { id: "s1", type: HintType.LETTER_COUNT, title: "Letter Count", content: "5 letters", cost: 100 };
      mockGlobalUserPoints.totalPoints = 50;
      const result = canUseHint(hint, mockHintState, mockGlobalUserPoints);
      expect(result.canUse).toBe(false);
      expect(result.reason).toBe("Nicht genug Punkte");
    });

    it("should return true if enough points for StandardHint and not used", () => {
      const hint: StandardHint = { id: "s1", type: HintType.LETTER_COUNT, title: "Letter Count", content: "5 letters", cost: 100 };
      mockGlobalUserPoints.totalPoints = 100;
      const result = canUseHint(hint, mockHintState, mockGlobalUserPoints);
      expect(result.canUse).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it("should return false if not enough points for CustomHint", () => {
      const hint: CustomHint = { id: "c1", type: HintType.CUSTOM, title: "Custom Hint 1", content: "Custom Content", cost: 100 };
      mockGlobalUserPoints.totalPoints = 50;
      const result = canUseHint(hint, mockHintState, mockGlobalUserPoints);
      expect(result.canUse).toBe(false);
      expect(result.reason).toBe("Nicht genug Punkte");
    });

    it("should return true if enough points for CustomHint and not used", () => {
      const hint: CustomHint = { id: "c1", type: HintType.CUSTOM, title: "Custom Hint 1", content: "Custom Content", cost: 100 };
      mockGlobalUserPoints.totalPoints = 100;
      const result = canUseHint(hint, mockHintState, mockGlobalUserPoints);
      expect(result.canUse).toBe(true);
      expect(result.reason).toBeUndefined();
    });
  });
});

describe("canTriggerContextualHint", () => {
  // Mock ContextualHint
  const mockContextualHint: ContextualHint = {
    id: "ch1",
    type: HintType.CONTEXTUAL,
    title: "Animal Family",
    content: "It belongs to the cat family.",
    triggers: ["cat", "feline"],
  };

  const nonContextualHint = {
    id: "nh1",
    type: HintType.CUSTOM,
    title: "Non Contextual",
    content: "Just a regular hint.",
    cost: 10,
  };

  it("should return true if user answer includes a trigger (case-insensitive, trimmed)", () => {
    expect(canTriggerContextualHint(mockContextualHint, "I think it's a Cat")).toBe(true);
    expect(canTriggerContextualHint(mockContextualHint, "It's a feline ")).toBe(true);
    expect(canTriggerContextualHint(mockContextualHint, "  CAT  ")).toBe(true);
  });

  it("should return false if user answer does not include any trigger", () => {
    expect(canTriggerContextualHint(mockContextualHint, "I think it's a dog")).toBe(false);
    expect(canTriggerContextualHint(mockContextualHint, "bird")).toBe(false);
  });

  it("should return false if the hint is not a contextual hint", () => {
    expect(canTriggerContextualHint(nonContextualHint as unknown as ContextualHint, "any answer")).toBe(false);
  });
});

describe("Type Guards", () => {
  it("isStandardHint should correctly identify StandardHint types", () => {
    const letterCountHint: Hint = { id: "l1", type: HintType.LETTER_COUNT, title: "", content: "", cost: 5 };
    const firstLetterHint: Hint = { id: "f1", type: HintType.FIRST_LETTER, title: "", content: "", cost: 10 };
    const customHint: Hint = { id: "c1", type: HintType.CUSTOM, title: "", content: "", cost: 10 };

    expect(isStandardHint(letterCountHint)).toBe(true);
    expect(isStandardHint(firstLetterHint)).toBe(true);
    expect(isStandardHint(customHint)).toBe(false);
  });

  it("isCustomHint should correctly identify CustomHint type", () => {
    const customHint: Hint = { id: "c1", type: HintType.CUSTOM, title: "", content: "", cost: 10 };
    const standardHint: Hint = { id: "s1", type: HintType.LETTER_COUNT, title: "", content: "", cost: 5 };

    expect(isCustomHint(customHint)).toBe(true);
    expect(isCustomHint(standardHint)).toBe(false);
  });

  it("isContextualHint should correctly identify ContextualHint type", () => {
    const contextualHint: Hint = { id: "ctx1", type: HintType.CONTEXTUAL, title: "", content: "", triggers: [] };
    const customHint: Hint = { id: "c1", type: HintType.CUSTOM, title: "", content: "", cost: 10 };

    expect(isContextualHint(contextualHint)).toBe(true);
    expect(isContextualHint(customHint)).toBe(false);
  });

  it("isAutoFreeHint should correctly identify AutoFreeHint type", () => {
    const autoFreeHint: Hint = { id: "af1", type: HintType.AUTO_FREE, title: "", content: "", triggerAfterAttempts: 1 };
    const customHint: Hint = { id: "c1", type: HintType.CUSTOM, title: "", content: "", cost: 10 };

    expect(isAutoFreeHint(autoFreeHint)).toBe(true);
    expect(isAutoFreeHint(customHint)).toBe(false);
  });
});