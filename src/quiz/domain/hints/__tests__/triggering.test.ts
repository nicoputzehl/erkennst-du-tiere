import { type AutoFreeHint, type ContextualHint, HintType } from "@/src/quiz/types";
import { getTriggeredContent } from "../generation";
import { checkForContextualHints, checkForAutoFreeHints, checkTriggeredHints } from "../triggering";
import { createTestQuestion } from "@/src/quiz/testing/testUtils";

// Helper for console.log spy
const suppressConsoleLog = () => {
  jest.spyOn(console, 'log').mockImplementation(() => { });
};

const restoreConsoleLog = () => {
  jest.spyOn(console, 'log').mockRestore();
};

const mockQuestionBase = createTestQuestion();

describe("checkForContextualHints", () => {

  const mockQuestion = {
    ...mockQuestionBase,
    contextualHints: [
      {
        id: "ctx1",
        type: HintType.CONTEXTUAL,
        title: "Family",
        content: "It belongs to the cat family.",
        triggers: ["cat", "feline"],
      } as ContextualHint,
      {
        id: "ctx2",
        type: HintType.CONTEXTUAL,
        title: "Habitat",
        content: "It lives in Africa.",
        triggers: ["africa", "savanna"],
      } as ContextualHint,
      {
        id: "ctx3",
        type: HintType.CONTEXTUAL,
        title: "Sound",
        content: "It roars.",
        triggers: ["bark", "meow"], // Triggers that won't match "Lion" directly
      } as ContextualHint,
    ],
  };

  const mockHintState = {
    questionId: 1,
    usedHints: [],
    wrongAttempts: 0,
    autoFreeHintsUsed: [],
  };

  beforeAll(() => suppressConsoleLog());
  afterAll(() => restoreConsoleLog());

  it("should return an empty array if no contextual hints are available for the question", () => {
    const questionWithoutContextualHints = { ...mockQuestion, contextualHints: [] };
    const result = checkForContextualHints("any answer", questionWithoutContextualHints, mockHintState);
    expect(result).toEqual([]);
  });

  it("should return contextual hints that are triggered by the user answer (case-insensitive, trimmed)", () => {
    const result1 = checkForContextualHints("Is it a CAT?", mockQuestion, mockHintState);
    expect(result1.length).toBe(1);
    expect(result1[0].id).toBe("ctx1");

    const result2 = checkForContextualHints("What about the African savanna?", mockQuestion, mockHintState);
    expect(result2.length).toBe(1);
    expect(result2[0].id).toBe("ctx2");
  });

  it("should return multiple contextual hints if multiple triggers match", () => {
    const result = checkForContextualHints("Is it a feline from Africa?", mockQuestion, mockHintState);
    expect(result.length).toBe(2);
    expect(result.some(h => h.id === "ctx1")).toBe(true);
    expect(result.some(h => h.id === "ctx2")).toBe(true);
  });

  it("should return an empty array if no user answer triggers match any contextual hint", () => {
    const result = checkForContextualHints("Is it a bird?", mockQuestion, mockHintState);
    expect(result).toEqual([]);
  });

  it("should not return contextual hints that are already in usedHints (though checkForContextualHints itself doesn't filter by usedHints, `canUseHint` does)", () => {
    // This function only checks for triggers, not for whether a hint is already used.
    // The filtering for 'used' hints happens in `canUseHint`.
    const usedHintState = { ...mockHintState, usedHints: [{ id: "ctx1", title: "Family", content: "It belongs to the cat family." }] };
    const result = checkForContextualHints("cat", mockQuestion, usedHintState);
    expect(result.length).toBe(1); // Still returns the hint, it's up to the caller to check if it's usable.
    expect(result[0].id).toBe("ctx1");
  });
});

describe("checkForAutoFreeHints", () => {
  const mockQuestion = {
    ...mockQuestionBase,
    autoFreeHints: [
      {
        id: "af1",
        type: HintType.AUTO_FREE,
        title: "Basic Info",
        content: "It has stripes.",
        triggerAfterAttempts: 1,
      } as AutoFreeHint,
      {
        id: "af2",
        type: HintType.AUTO_FREE,
        title: "Advanced Info",
        content: "It's an apex predator.",
        triggerAfterAttempts: 3,
      } as AutoFreeHint,
    ],
  };

  const initialHintState = {
    questionId: 2,
    usedHints: [],
    wrongAttempts: 0,
    autoFreeHintsUsed: [],
  };

  beforeAll(() => suppressConsoleLog());
  afterAll(() => restoreConsoleLog());

  it("should return an empty array if no auto-free hints are available for the question", () => {
    const questionWithoutAutoFreeHints = { ...mockQuestion, autoFreeHints: [] };
    const result = checkForAutoFreeHints(questionWithoutAutoFreeHints, initialHintState);
    expect(result).toEqual([]);
  });

  it("should return auto-free hints that meet the wrongAttempts threshold", () => {
    let hintState = { ...initialHintState, wrongAttempts: 1 };
    let result = checkForAutoFreeHints(mockQuestion, hintState);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("af1");

    hintState = { ...initialHintState, wrongAttempts: 3 };
    result = checkForAutoFreeHints(mockQuestion, hintState);
    expect(result.length).toBe(2);
    expect(result.some(h => h.id === "af1")).toBe(true);
    expect(result.some(h => h.id === "af2")).toBe(true);
  });

  it("should not return auto-free hints if wrongAttempts is below the threshold", () => {
    const hintState = { ...initialHintState, wrongAttempts: 0 };
    const result = checkForAutoFreeHints(mockQuestion, hintState);
    expect(result).toEqual([]);
  });

  it("should not return auto-free hints that are already in autoFreeHintsUsed", () => {
    const hintState = { ...initialHintState, wrongAttempts: 3, autoFreeHintsUsed: ["af1"] };
    const result = checkForAutoFreeHints(mockQuestion, hintState);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("af2");
  });

  it("should not return auto-free hints that are already in usedHints", () => {
    const hintState = { ...initialHintState, wrongAttempts: 3, usedHints: [{ id: "af2", title: "Advanced Info", content: "..." }] };
    const result = checkForAutoFreeHints(mockQuestion, hintState);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("af1");
  });
});

describe("checkTriggeredHints", () => {
  const mockQuestion = {
    ...mockQuestionBase,
    contextualHints: [
      {
        id: "ctx_bear1",
        type: HintType.CONTEXTUAL,
        title: "Winter Sleep",
        content: "It hibernates.",
        triggers: ["sleep", "winter"],
      } as ContextualHint,
    ],
    autoFreeHints: [
      {
        id: "af_bear1",
        type: HintType.AUTO_FREE,
        title: "Diet",
        content: "It is an omnivore.",
        triggerAfterAttempts: 2,
      } as AutoFreeHint,
    ],
  };

  beforeAll(() => suppressConsoleLog());
  afterAll(() => restoreConsoleLog());

  it("should return both triggered contextual and auto-free hints", () => {
    const hintState = {
      questionId: 3,
      usedHints: [],
      wrongAttempts: 2, // Triggers af_bear1
      autoFreeHintsUsed: [],
    };
    const userAnswer = "Does it sleep in winter?"; // Triggers ctx_bear1

    const result = checkTriggeredHints(userAnswer, mockQuestion, hintState);
    expect(result.contextualHints.length).toBe(1);
    expect(result.contextualHints[0].id).toBe("ctx_bear1");
    expect(result.autoFreeHints.length).toBe(1);
    expect(result.autoFreeHints[0].id).toBe("af_bear1");
  });

  it("should return empty arrays if no hints are triggered", () => {
    const hintState = {
      questionId: 3,
      usedHints: [],
      wrongAttempts: 0, // No auto-free triggered
      autoFreeHintsUsed: [],
    };
    const userAnswer = "Is it a cat?"; // No contextual triggered

    const result = checkTriggeredHints(userAnswer, mockQuestion, hintState);
    expect(result.contextualHints).toEqual([]);
    expect(result.autoFreeHints).toEqual([]);
  });

  it("should handle cases where only one type of hint is triggered", () => {
    // Only contextual triggered
    let hintState = {
      questionId: 3,
      usedHints: [],
      wrongAttempts: 0,
      autoFreeHintsUsed: [],
    };
    let userAnswer = "Does it sleep?";
    let result = checkTriggeredHints(userAnswer, mockQuestion, hintState);
    expect(result.contextualHints.length).toBe(1);
    expect(result.autoFreeHints).toEqual([]);

    // Only auto-free triggered
    hintState = {
      questionId: 3,
      usedHints: [],
      wrongAttempts: 2,
      autoFreeHintsUsed: [],
    };
    userAnswer = "Some random answer.";
    result = checkTriggeredHints(userAnswer, mockQuestion, hintState);
    expect(result.contextualHints).toEqual([]);
    expect(result.autoFreeHints.length).toBe(1);
  });
});

describe("getTriggeredContent (from triggering.ts)", () => {
  const baseContextualHint: ContextualHint = {
    id: "ctx1",
    type: HintType.CONTEXTUAL,
    title: "Animal Group",
    content: "It's a wild animal.", // Standard content
    triggers: ["wild"],
  };

  beforeAll(() => suppressConsoleLog());
  afterAll(() => restoreConsoleLog());

  it("should return specific content if a trigger matches and triggerSpecificContent is defined", () => {
    const hintWithSpecificContent = {
      ...baseContextualHint,
      triggerSpecificContent: {
        "mammal": "It is a mammal.",
        "fish": "It lives in water.",
      },
      triggers: ["mammal", "fish"]
    };

    expect(getTriggeredContent(hintWithSpecificContent, "Is it a mammal?")).toBe("It is a mammal.");
    expect(getTriggeredContent(hintWithSpecificContent, "It's a fishy animal")).toBe("It lives in water.");
  });

  it("should return standard content if no specific trigger content matches", () => {
    const hintWithSpecificContent = {
      ...baseContextualHint,
      triggerSpecificContent: {
        "mammal": "It is a mammal.",
      },
      triggers: ["mammal"]
    };

    // User answer does not match any specific trigger, falls back to standard content
    expect(getTriggeredContent(hintWithSpecificContent, "Is it a bird?")).toBe("It's a wild animal.");
  });

  it("should return standard content if triggerSpecificContent is not defined", () => {
    expect(getTriggeredContent(baseContextualHint, "Is it wild?")).toBe("It's a wild animal.");
    expect(getTriggeredContent(baseContextualHint, "Any answer")).toBe("It's a wild animal.");
  });

  it("should handle case-insensitivity and trimming for triggers and user answer", () => {
    const hintWithSpecificContent = {
      ...baseContextualHint,
      triggerSpecificContent: {
        "BIG": "It is a big animal.",
      },
      triggers: ["big"]
    };

    expect(getTriggeredContent(hintWithSpecificContent, "Is it Big?")).toBe("It is a big animal.");
    expect(getTriggeredContent(hintWithSpecificContent, " it is big ")).toBe("It is a big animal.");
  });
});