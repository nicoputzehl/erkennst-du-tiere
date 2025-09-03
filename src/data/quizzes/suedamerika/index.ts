import type { QuestionBase, Quiz } from "@/src/quiz";

const alpaka: QuestionBase = {
  id: 1,
  answer: "Alpaka",
  images: {
    imageUrl: require("./alpaka.webp"),
    unsolvedImageUrl: require("./alpaka_unsolved.webp"),
  },
};

const piranha: QuestionBase = {
  id: 2,
  answer: "Piranha",
  images: {
    imageUrl: require("./piranha.webp"),
    unsolvedImageUrl: require("./piranha_unsolved.webp"),
  },
};

const jaguar: QuestionBase = {
  id: 3,
  answer: "Jaguar",
  images: {
    imageUrl: require("./jaguar.webp"),
    unsolvedImageUrl: require("./jaguar_unsolved.webp"),
  },
};

const lama: QuestionBase = {
  id: 4,
  answer: "Lama",
  images: {
    imageUrl: require("./lama.webp"),
    unsolvedImageUrl: require("./lama_unsolved.webp"),
  },
};

const capybara: QuestionBase = {
  id: 5,
  answer: "Capybara",
  images: {
    imageUrl: require("./capybara.webp"),
  },
  alternativeAnswers: ["Wasserschwein"],
};

const kondor: QuestionBase = {
  id: 6,
  answer: "Kondor",
  images: {
    imageUrl: require("./kondor.webp"),
  },
  alternativeAnswers: ["Andenkondor"]
};

const nandu: QuestionBase = {
  id: 7,
  answer: "Nandu",
  images: {
    imageUrl: require("./nandu.webp"),
  },
  alternativeAnswers: ["Großer Nandu"]
};

const schopfkarakara: QuestionBase = {
  id: 8,
  answer: "Schopfkarakara",
  images: {
    imageUrl: require("./schopfkarakara.webp"),
  },
};

const tiereDerAnden: QuestionBase[] = [
  alpaka,
  piranha,
  jaguar,
  lama,
  capybara,
  kondor,
  nandu,
  schopfkarakara,
];

export const suedamerikaQuiz: Quiz = {
  id: "suedamerika",
  title: "Südamerika",
  questions: tiereDerAnden,
  titleImage: require("./alpaka.webp"),
  description: "Entdecke die faszinierende Tierwelt Südamerikas.",
};