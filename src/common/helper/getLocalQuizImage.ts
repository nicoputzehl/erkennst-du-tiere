import { quizImageAssets } from "@/src/assets/quizImages";
import { logWarn } from "./logging";

export function getQuizImageKeyFromAnswer(
  answer: string,
  solved: boolean,
  title: string
): string {
  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  const baseKey = normalize(answer);
  const regionKey = title ? normalize(title) : undefined;

  const key = regionKey ? `${regionKey}_${baseKey}` : baseKey;

  return solved ? key : `${key}_unsolved`;
}

export const getImageFromMap = (
  name?: string,
): number | undefined => {
  if (!name) return undefined;
  const asset = quizImageAssets[name];
  if (!asset) {
    logWarn(`Kein lokales Quiz-Bild gefunden für Namen: ${name}`);
    return undefined;
  }
  return quizImageAssets[name];
};


export function getLocalQuizImage(
  answer: string,
  solved: boolean,
  title: string) {
  const imageKey = getQuizImageKeyFromAnswer(answer, solved, title);
  return getImageFromMap(imageKey);
}

export function hasUnsolvedLocalImage(answer: string, title: string): boolean {

  const unsolvedKey = getQuizImageKeyFromAnswer(answer, false, title);
  return Boolean(quizImageAssets[unsolvedKey]);
};

