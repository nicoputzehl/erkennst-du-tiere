import type { QuestionBase, Quiz } from "@/src/quiz";

const dodo: QuestionBase = {
  id: 1,
  answer: "Dodo",
  images: {
    imageUrl: require("./dodo.webp"),
  },
  alternativeAnswers: ["Dudu", "Dronte", "Doudo"],
};

const quagga: QuestionBase = {
  id: 2,
  answer: "Quagga",
  images: {
    imageUrl: require("./quagga.webp"),
  },
};

const trilobit: QuestionBase = {
  id: 3,
  answer: "Trilobit",
  images: {
    imageUrl: require("./trilobit.webp"),
  },
  alternativeAnswers: ["Trilobite"],
};

const saebelzahnkatze: QuestionBase = {
  id: 4,
  answer: "Säbelzahnkatze",
  images: {
    imageUrl: require("./saebelzahnkatze.webp"),
  },
  alternativeAnswers: ["Säbelzahntiger", "Smilodon"],
};

const mammut: QuestionBase = {
  id: 5,
  answer: "Mammut",
  images: {
    imageUrl: require("./mammut.webp"),
  },
};

const beutelwolf: QuestionBase = {
  id: 6,
  answer: "Beutelwolf",
  images: {
    imageUrl: require("./beutelwolf.webp"),
  },
  alternativeAnswers: ["Tasmanischer Tiger", "Tasmanischer Wolf", "Beuteltiger"],
};

const elefantenVogel: QuestionBase = {
  id: 7,
  answer: "Elefantenvogel",
  images: {
    imageUrl: require("./elefantenvogel.webp"),
  },
  alternativeAnswers: ["Madagaskar-Strauß", "Vorompatras"],
};

const goldkroete: QuestionBase = {
  id: 8,
  answer: "Goldkröte",
  images: {
    imageUrl: require("./goldkroete.webp"),
  },
};

const ausgestorbeneTiere: QuestionBase[] = [
  dodo,
  quagga,
  trilobit,
  saebelzahnkatze,
  mammut,
  beutelwolf,
  elefantenVogel,
  goldkroete,
];

export const ausgestorbeneTiereQuiz: Quiz = {
  id: "ausgestorbeneTiere",
  title: "Ausgestorbene Tiere",
  questions: ausgestorbeneTiere,
  titleImage: require("./mammut.webp"),
  description: "Erinnere dich an die Tiere, die nicht mehr unter uns sind.",
};