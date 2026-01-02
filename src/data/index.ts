import { QuizUtils } from "../quiz/domain/quiz";
import { afrikaQuiz, arktisQuiz, asienQuiz, ausgestorbeneTiereQuiz, australienQuiz, dinosaurierQuiz, emojiAnimalsQuiz, europaQuiz, fabelwesenQuiz, nordamerikaQuiz, suedamerikaQuiz, vogelIllustrationenQuiz } from "./quizzes";

export const newAnmilQuizConfig = [
  // Continent Quizzes
  QuizUtils.createQuizConfig(europaQuiz),
  QuizUtils.createQuizConfig(afrikaQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createMultiplePlaythroughUnlockCondition(["europa"], 'Schließe "Europa" um Afrika freizuschalten.')
  }),
  QuizUtils.createQuizConfig(australienQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("afrika", 'Schließe "Afrika" ab, um Australien freizuschalten.')
  }),
  QuizUtils.createQuizConfig(nordamerikaQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("australien", 'Schließe "Australien" ab, um Nordamerika freizuschalten.')
  }),
  QuizUtils.createQuizConfig(asienQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("nordamerika", 'Schließe "Nordamerika" ab, um Asien freizuschalten.')
  }),
  QuizUtils.createQuizConfig(suedamerikaQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("asien", 'Schließe "Asien" ab, um Südamerika freizuschalten.')
  }),
  QuizUtils.createQuizConfig(arktisQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("suedamerika", 'Schließe "Südamerika" ab, um Arktis freizuschalten.')
  }),
  // Special Quizzes
  QuizUtils.createQuizConfig(emojiAnimalsQuiz),
  QuizUtils.createQuizConfig(vogelIllustrationenQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("emojis", 'Schließe "Emojis" ab, um Vögel freizuschalten.')
  }),
  QuizUtils.createQuizConfig(dinosaurierQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("vogelIllustrationen", 'Schließe "Vögel" ab, um Dinosaurier freizuschalten.')
  }),
  QuizUtils.createQuizConfig(ausgestorbeneTiereQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("dinosaurier", 'Schließe "Dinosaurier" ab, um Ausgestorbene Tiere freizuschalten.')
  }),
  QuizUtils.createQuizConfig(fabelwesenQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("ausgestorbeneTiere", 'Schließe "Ausgestorbene Tiere" ab, um Mythische Wesen freizuschalten.')
  }),
]