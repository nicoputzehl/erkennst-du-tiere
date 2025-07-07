import { type ContextualHint, type CustomHint, HintType } from "@/src/quiz/types";
import { generateHintContent, getTriggeredContent } from "../generation";
import { createTestQuestion } from "@/src/quiz/testing/testUtils";

describe("generateHintContent", () => {
  const mockQuestion = createTestQuestion();

  it("should return the content directly if it exists on the hint object", () => {
    const hint: CustomHint = {
      id: "custom1",
      type: HintType.CUSTOM,
      title: "Custom Hint",
      content: "This is a custom hint content.",
      cost: 10,
    };
    expect(generateHintContent(hint, mockQuestion)).toBe("This is a custom hint content.");
  });

  it("should return 'Hint nicht verfügbar' and log a warning if content is missing (fallback)", () => {
    // This scenario should ideally not happen with the current hint structure,
    // but testing the fallback.
    const hint = {
      id: "brokenHint",
      type: HintType.CUSTOM,
      title: "Broken Hint",
      content: undefined, // Simulating missing content
    } as unknown as CustomHint;

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress console.warn for test

    expect(generateHintContent(hint, mockQuestion)).toBe("Hint nicht verfügbar");
    expect(consoleWarnSpy).toHaveBeenCalledWith(`Hint brokenHint has no content, this should not happen`);
    
    consoleWarnSpy.mockRestore(); // Restore console.warn
  });
});

describe("getTriggeredContent", () => {
  const baseContextualHint = {
    id: "ctx1",
    type: HintType.CONTEXTUAL,
    title: "Animal Group",
    content: "It's a wild animal.", // Standard content
    triggers: ["wild"],
  } as ContextualHint;

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