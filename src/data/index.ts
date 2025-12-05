import { QuizUtils } from "../quiz/domain/quiz";
import { afrikaQuiz, arktisQuiz, asienQuiz, ausgestorbeneTiereQuiz, australienQuiz, dinosaurierQuiz, emojiAnimalsQuiz, europaQuiz, fabelwesenQuiz, nordamerikaQuiz, suedamerikaQuiz, vogelIllustrationenQuiz } from "./quizzes";

export const newAnmilQuizConfig = [
  QuizUtils.createQuizConfig(europaQuiz),
  QuizUtils.createQuizConfig(emojiAnimalsQuiz),
  QuizUtils.createQuizConfig(afrikaQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createMultiplePlaythroughUnlockCondition(["europa", "emojis"], 'Schließe "Europa" und "Emojis" ab, um Afrika freizuschalten.')
  }),
  QuizUtils.createQuizConfig(vogelIllustrationenQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("emojis", 'Schließe "Emojis" ab, um Vögel freizuschalten.')
  }),
  QuizUtils.createQuizConfig(australienQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("afrika", 'Schließe "Afrika" ab, um Australien freizuschalten.')
  }),
  QuizUtils.createQuizConfig(nordamerikaQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("afrika", 'Schließe "Afrika" ab, um Nordamerika freizuschalten.')
  }),
  QuizUtils.createQuizConfig(dinosaurierQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("vogelIllustrationen", 'Schließe "Heimische Vögel" ab, um Dinosaurier freizuschalten.')
  }),
  QuizUtils.createQuizConfig(asienQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("australien", 'Schließe "Australien" ab, um Asien freizuschalten.')
  }),
  QuizUtils.createQuizConfig(suedamerikaQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("australien", 'Schließe "Australien" ab, um Südamerika freizuschalten.')
  }),
  QuizUtils.createQuizConfig(ausgestorbeneTiereQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("dinosaurier", 'Schließe "Dinosaurier" ab, um Ausgestorbene Tiere freizuschalten.')
  }),
  QuizUtils.createQuizConfig(arktisQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("asien", 'Schließe "Asien" ab, um Arktis freizuschalten.')
  }),
  QuizUtils.createQuizConfig(fabelwesenQuiz, {
    initiallyLocked: true,
    unlockCondition: QuizUtils.createPlaythroughUnlockCondition("ausgestorbeneTiere", 'Schließe "Ausgestorbene Tiere" ab, um Asien freizuschalten.')
  }),
]