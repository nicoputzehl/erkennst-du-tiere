import type { QuestionBase, Quiz } from "@/src/quiz";

const wildschwein: QuestionBase = {
  id: 1,
  answer: "Wildschwein",
  images: {
    imageUrl: require("./wildschwein.webp"),
    unsolvedImageUrl: require("./wildschwein_unsolved.webp"),
  },
  alternativeAnswers: ["Schwarzwild", "Schwarzkittel"]
};

const rotfuchs: QuestionBase = {
  id: 2,
  answer: "Rotfuchs",
  images: {
    imageUrl: require("./rotfuchs.webp"),
    unsolvedImageUrl: require("./rotfuchs_unsolved.webp"),
  },
  alternativeAnswers: ["Fuchs"]
};

const wolf: QuestionBase = {
  id: 3,
  answer: "Wolf",
  images: {
    imageUrl: require("./wolf.webp"),
  },
};

const feldhase: QuestionBase = {
  id: 4,
  answer: "Feldhase",
  images: {
    imageUrl: require("./feldhase.webp"),
    unsolvedImageUrl: require("./feldhase_unsolved.webp"),
  },
  alternativeAnswers: ["Hase"]
};

const braunbaer: QuestionBase = {
  id: 5,
  answer: "Braunbär",
  images: {
    imageUrl: require("./braunbaer.webp"),
    unsolvedImageUrl: require("./braunbaer_unsolved.webp"),
  },
  alternativeAnswers: ["Europäischer Braunbär"]
};

const eichhoernchen: QuestionBase = {
  id: 6,
  answer: "Eichhörnchen",
  images: {
    imageUrl: require("./eichhoernchen.webp"),
    unsolvedImageUrl: require("./eichhoernchen_unsolved.webp"),
  },
  alternativeAnswers: ["Eurasisches Eichhörnchen"]
};

const elch: QuestionBase = {
  id: 7,
  answer: "Elch",
  images: {
    imageUrl: require("./elch.webp"),
    unsolvedImageUrl: require("./elch_unsolved.webp"),
  },
};

const dachs: QuestionBase = {
  id: 8,
  answer: "Dachs",
  images: {
    imageUrl: require("./dachs.webp"),

  },
  alternativeAnswers: ["Europäischer Dachs"]
};

const tiereEuropas: QuestionBase[] = [
  wildschwein,
  rotfuchs,
  wolf,
  feldhase,
  braunbaer,
  eichhoernchen,
  elch,
  dachs,
];

export const europaQuiz: Quiz = {
  id: "europa",
  title: "Europa",
  questions: tiereEuropas,
  titleImage: require("./wolf.webp"),
  description: "Entdecke die heimische Tierwelt Europas mit diesem Quiz.",
};