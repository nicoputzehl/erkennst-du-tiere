import type { QuestionBase, Quiz } from "@/src/quiz";

const triceratops: QuestionBase = {
  id: 1,
  answer: "Triceratops",
  images: {
    imageUrl: require("./triceratops.webp"),
  },
};

const brachiosaurus: QuestionBase = {
  id: 2,
  answer: "Brachiosaurus",
  images: {
    imageUrl: require("./brachiosaurus.webp"),
  },
  alternativeAnswers: ["Armechse"]
};

const stegosaurus: QuestionBase = {
  id: 3,
  answer: "Stegosaurus",
  images: {
    imageUrl: require("./stegosaurus.webp"),
  },
};

const velociraptor: QuestionBase = {
  id: 4,
  answer: "Velociraptor",
  images: {
    imageUrl: require("./velociraptor.webp"),
  },
  alternativeAnswers: ["Dachechse"]
};

const tyrannosaurus: QuestionBase = {
  id: 5,
  answer: "Tyrannosaurus",
  images: {
    imageUrl: require("./tyrannosaurus.webp"),
  },
  alternativeAnswers: ["T-Rex", "Tyrannosaurus Rex"],
};

const parasaurolophus: QuestionBase = {
  id: 6,
  answer: "Parasaurolophus",
  images: {
    imageUrl: require("./parasaurolophus.webp"),
  },
  alternativeAnswers: ["Entenschnabel-Dinosaurier"]
};

const pteosaurus: QuestionBase = {
  id: 7,
  answer: "Pteosaurus",
  images: {
    imageUrl: require("./pteosaurus.webp"),
  },
  alternativeAnswers: ["Flugdinosaurier"]
};

const ichthyosaurus: QuestionBase = {
  id: 8,
  answer: "Ichthyosaurus",
  images: {
    imageUrl: require("./ichthyosaurus.webp"),
  },
};

const dinosaurier: QuestionBase[] = [
  triceratops,
  brachiosaurus,
  stegosaurus,
  velociraptor,
  tyrannosaurus,
  parasaurolophus,
  pteosaurus,
  ichthyosaurus,
];

export const dinosaurierQuiz: Quiz = {
  id: "dinosaurier",
  title: "Dinosaurier",
  questions: dinosaurier,
  titleImage: require("./tyrannosaurus.webp"),
  description: "Teste dein Wissen über die Giganten der Urzeit.",
};