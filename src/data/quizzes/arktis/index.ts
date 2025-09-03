import type { QuestionBase, Quiz } from "@/src/quiz";

const eisbaer: QuestionBase = {
  id: 1,
  answer: "Eisbär",
  images: {
    imageUrl: require("./eisbaer.webp"),
  }
  ,
  alternativeAnswers: ["Polarbär"]
}

const walross: QuestionBase = {
  id: 2,
  answer: "Walross",
  images: {
    imageUrl: require("./walross.webp"),
  }
}

const papageientaucher: QuestionBase = {
  id: 3,
  answer: "Papageientaucher",
  images: {
    imageUrl: require("./papageientaucher.webp"),
  },
  alternativeAnswers: ["Puffin"]
}


const schneeeule: QuestionBase = {
  id: 4,
  answer: "Schneeeule",
  images: {
    imageUrl: require("./schneeeule.webp"),
  },
}

const polarfuchs: QuestionBase = {
  id: 5,
  answer: "Polarfuchs",
  images: {
    imageUrl: require("./polarfuchs.webp"),
  },
  alternativeAnswers: ["Schneefuchs", "Eisfuchs"]
}

const rentier: QuestionBase = {
  id: 6,
  answer: "Rentier",
  images: {
    imageUrl: require("./rentier.webp"),
  },
  alternativeAnswers: ["Ren"]
}

const polarwolf: QuestionBase = {
  id: 7,
  answer: "Polarwolf",
  images: {
    imageUrl: require("./polarwolf.webp"),
  },
  alternativeAnswers: ["Weißwolf", "Arktischer Wolf"]
}

const schneehase: QuestionBase = {
  id: 8,
  answer: "Schneehase",
  images: {
    imageUrl: require("./schneehase.webp"),
  },
}

 const arktis: QuestionBase[] = [
  eisbaer,
  walross,
  papageientaucher,
  schneeeule,
  polarfuchs,
  rentier,
  polarwolf,
  schneehase
]

export const arktisQuiz: Quiz= {
  id: "arktis",
  title: "Arktis",
  questions: arktis,
  titleImage: require("./eisbaer.webp"),
  description: "Diese Tiere mögen es gerne kalt."
};
