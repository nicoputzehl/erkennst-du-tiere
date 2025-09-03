import type { QuestionBase, Quiz } from "@/src/quiz";

const pfau: QuestionBase = {
  id: 1,
  answer: "Pfau",
  images: {
    imageUrl: require("./pfau.webp"),
    unsolvedImageUrl: require("./pfau_unsolved.webp"),
  },
  alternativeAnswers: ["Blauer Pfau", "Asiatischer Pfau"]
};

const koenigstiger: QuestionBase = {
  id: 2,
  answer: "Königstiger",
  images: {
    imageUrl: require("./koenigstiger.webp"),
    unsolvedImageUrl: require("./koenigstiger_unsolved.webp"),
  },
  alternativeAnswers: ["Bengal-Tiger", "Indischer Tiger", "Tiger"]
};

const grosser_panda: QuestionBase = {
  id: 3,
  answer: "Großer Panda",
  images: {
    imageUrl: require("./grosser_panda.webp"),
    unsolvedImageUrl: require("./grosser_panda_unsolved.webp"),
  },
  alternativeAnswers: ["Panda", "Riesenpanda", "Pandabär"]
};

const koenigskobra: QuestionBase = {
  id: 4,
  answer: "Königskobra",
  images: {
    imageUrl: require("./koenigskobra.webp"),
    unsolvedImageUrl: require("./koenigskobra_unsolved.webp"),
  },
};

const orang_utan: QuestionBase = {
  id: 5,
  answer: "Orang-Utan",
  images: {
    imageUrl: require("./orang_utan.webp"),
    unsolvedImageUrl: require("./orang_utan_unsolved.webp"),
  },
};

const tigerpython: QuestionBase = {
  id: 6,
  answer: "Tigerpython",
  images: {
    imageUrl: require("./tigerpython.webp"),
  },
  alternativeAnswers: ["Python"]
};

const asiatischer_elefant: QuestionBase = {
  id: 7,
  answer: "Asiatischer Elefant",
  images: {
    imageUrl: require("./asiatischer_elefant.webp"),
  },
};

const roter_panda: QuestionBase = {
  id: 8,
  answer: "Roter Panda",
  images: {
    imageUrl: require("./roter_panda.webp"),
  },
  alternativeAnswers: ["Kleiner Panda"]
};

const tiereAsiens: QuestionBase[] = [
  koenigskobra,
  grosser_panda,
  koenigstiger,
  orang_utan,
  pfau,
  asiatischer_elefant,
  roter_panda,
  tigerpython,
];

export const asienQuiz: Quiz = {
  id: "asien",
  title: "Asien",
  questions: tiereAsiens,
  titleImage: require("./koenigstiger.webp"),
  description: "Entdecke die faszinierende Tierwelt Asiens.",
};