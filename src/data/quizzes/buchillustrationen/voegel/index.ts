import type { QuestionBase, Quiz } from "@/src/quiz";

const haubenmeise: QuestionBase = {
  id: 1,
  answer: "Haubenmeise",
  images: {
    imageUrl: require("./haubenmeise.webp"),
  },
};

const bienenfresser: QuestionBase = {
  id: 2,
  answer: "Bienenfresser",
  images: {
    imageUrl: require("./bienenfresser.webp"),
  },
};

const eichelhaeher: QuestionBase = {
  id: 3,
  answer: "Eichelhäher",
  images: {
    imageUrl: require("./eichelhaeher.webp"),
  },
};

const raubwuerger: QuestionBase = {
  id: 4,
  answer: "Raubwürger",
  images: {
    imageUrl: require("./raubwuerger.webp"),
  },
};

const gruenspecht: QuestionBase = {
  id: 5,
  answer: "Grünspecht",
  images: {
    imageUrl: require("./gruenspecht.webp"),
  },
  alternativeAnswers: ["Grasspecht", "Erdspecht"],
};

const wespenbussard: QuestionBase = {
  id: 6,
  answer: "Wespenbussard",
  images: {
    imageUrl: require("./wespenbussard.webp"),
  },
};

const rotkopfwuerger: QuestionBase = {
  id: 7,
  answer: "Rotkopfwürger",
  images: {
    imageUrl: require("./rotkopfwuerger.webp"),
  },
};

const star: QuestionBase = {
  id: 8,
  answer: "Star",
  images: {
    imageUrl: require("./star.webp"),
  },
};

const heimischeVoegel: QuestionBase[] = [
  haubenmeise,
  bienenfresser,
  eichelhaeher,
  raubwuerger,
  gruenspecht,
  wespenbussard,
  rotkopfwuerger,
  star,
];

export const vogelIllustrationenQuiz: Quiz = {
  id: "vogelIllustrationen",
  title: "Vögel - Illustrationen",
  questions: heimischeVoegel,
  titleImage: require("./star.webp"),
  description: "Teste dein Wissen über die gefiederte Vielfalt in unseren Breitengraden.",
};