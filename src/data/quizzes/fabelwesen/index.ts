import type { QuestionBase, Quiz } from "@/src/quiz";

const drache: QuestionBase = {
  id: 1,
  answer: "Drache",
  images: {
    imageUrl: require("./drache.webp"),
  },
};

const basilisk: QuestionBase = {
  id: 2,
  answer: "Basilisk",
  images: {
    imageUrl: require("./basilisk.webp"),
  },
};

const mantikor: QuestionBase = {
  id: 3,
  answer: "Mantikor",
  images: {
    imageUrl: require("./mantikor.webp"),
  },
  alternativeAnswers: ["Manticor", "Manticore", "Manticora", "Marticora"],
};

const hippokamp: QuestionBase = {
  id: 4,
  answer: "Hippokamp",
  images: {
    imageUrl: require("./hippokamp.webp"),
  },
  alternativeAnswers: ["Seepferd", "Hippocamp"],
};

const pegasos: QuestionBase = {
  id: 5,
  answer: "Pegasos",
  images: {
    imageUrl: require("./pegasos.webp"),
  },
  alternativeAnswers: ["Pegasus"],
};

const einhorn: QuestionBase = {
  id: 6,
  answer: "Einhorn",
  images: {
    imageUrl: require("./einhorn.webp"),
  },
  alternativeAnswers: ["Unicorn"],
};

const phoenex: QuestionBase = {
  id: 7,
  answer: "Phönix",
  images: {
    imageUrl: require("./phoenix.webp"),
  },
  alternativeAnswers: ["Phoenix"],
};

const greif: QuestionBase = {
  id: 8,
  answer: "Greif",
  images: {
    imageUrl: require("./greif.webp"),
  },
};

const fabelwesen: QuestionBase[] = [
  drache,
  basilisk,
  mantikor,
  hippokamp,
  pegasos,
  einhorn,
  phoenex,
  greif,
];

export const fabelwesenQuiz: Quiz = {
  id: "fabelwesen",
  title: "Fabelwesen und Mythen",
  questions: fabelwesen,
  titleImage: require("./drache.webp"),
  description: "Erkunde eine Welt voller mythischer Kreaturen.",
};