import type { QuestionBase, Quiz } from "@/src/quiz";

const koala: QuestionBase = {
  id: 1,
  answer: "Koala",
  images: {
    imageUrl: require("./koala.webp"),
    unsolvedImageUrl: require("./koala_unsolved.webp"),
  },
  alternativeAnswers: ["Beutelbär", "Koalabär"]
};

const kaenguru: QuestionBase = {
  id: 2,
  answer: "Känguru",
  images: {
    imageUrl: require("./kaenguru.webp"),
    unsolvedImageUrl: require("./kaenguru_unsolved.webp"),
  },
};

const quokka: QuestionBase = {
  id: 3,
  answer: "Quokka",
  images: {
    imageUrl: require("./quokka.webp"),
  },
  alternativeAnswers: ["Kurzschwanzkänguru"]
};

const wombat: QuestionBase = {
  id: 4,
  answer: "Wombat",
  images: {
    imageUrl: require("./wombat.webp"),
  },
};

const dingo: QuestionBase = {
  id: 5,
  answer: "Dingo",
  images: {
    imageUrl: require("./dingo.webp"),
  },
};

const emu: QuestionBase = {
  id: 6,
  answer: "Emu",
  images: {
    imageUrl: require("./emu.webp"),
  },
  alternativeAnswers: ["Großer Emu"]
};

const wallaby: QuestionBase = {
  id: 7,
  answer: "Wallaby",
  images: {
    imageUrl: require("./wallaby.webp"),
  },
};

const kookaburra: QuestionBase = {
  id: 8,
  answer: "Kookaburra",
  images: {
    imageUrl: require("./kookaburra.webp"),
  },
  alternativeAnswers: ["Jägerliest", "Lachender Hans"]
};



const tiereAustraliens: QuestionBase[] = [
  koala,
  kaenguru,
  quokka,
  wombat,
  dingo,
  emu,
  wallaby,
  kookaburra,
];

export const australienQuiz: Quiz = {
  id: "australien",
  title: "Australien",
  questions: tiereAustraliens,
  titleImage: require("./kaenguru.webp"),
  description: "Entdecke die einzigartige Tierwelt Australiens.",
};