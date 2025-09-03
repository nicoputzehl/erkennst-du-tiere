import type { QuestionBase, Quiz } from "@/src/quiz";

const weisskopfseeadler: QuestionBase = {
  id: 1,
  answer: "Weißkopfseeadler",
  images: {
    imageUrl: require("./weisskopfseeadler.webp"),
    unsolvedImageUrl: require("./weisskopfseeadler_unsolved.webp"),
  },
};

const stinktier: QuestionBase = {
  id: 2,
  answer: "Stinktier",
  images: {
    imageUrl: require("./stinktier.webp"),
    unsolvedImageUrl: require("./stinktier_unsolved.webp"),
  },
  alternativeAnswers: ["Skunk"],
};

const klapperschlange: QuestionBase = {
  id: 3,
  answer: "Klapperschlange",
  images: {
    imageUrl: require("./klapperschlange.webp"),
    unsolvedImageUrl: require("./klapperschlange_unsolved.webp"),
  },
};

const waschbaer: QuestionBase = {
  id: 4,
  answer: "Waschbär",
  images: {
    imageUrl: require("./waschbaer.webp"),
    unsolvedImageUrl: require("./waschbaer_unsolved.webp"),
  },
};

const grizzly: QuestionBase = {
  id: 5,
  answer: "Grizzly",
  images: {
    imageUrl: require("./grizzly.webp"),
  },
  alternativeAnswers: ["Graubär", "Grizzlybär"],
};

const bison: QuestionBase = {
  id: 6,
  answer: "Bison",
  images: {
    imageUrl: require("./bison.webp"),
  },
};

const kojote: QuestionBase = {
  id: 7,
  answer: "Kojote",
  images: {
    imageUrl: require("./kojote.webp"),
  },
  alternativeAnswers: ["Präriewolf", "Steppenwolf"]
};

const kanadagans: QuestionBase = {
  id: 8,
  answer: "Kanadagans",
  images: {
    imageUrl: require("./kanadagans.webp"),
  },
};

const nordamerikaTiere: QuestionBase[] = [
  weisskopfseeadler,
  stinktier,
  klapperschlange,
  waschbaer,
  grizzly,
  bison,
  kojote,
  kanadagans,
];

export const nordamerikaQuiz: Quiz = {
  id: "nordamerika",
  title: "Nordamerika",
  questions: nordamerikaTiere,
  titleImage: require("./bison.webp"),
  description: "Entdecke die Tierwelt Nordamerikas mit diesem Quiz.",
};