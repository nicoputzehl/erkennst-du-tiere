import { Question } from "@/src/quiz";


export const emojiAnimals: Question[] = [
  {
    id: 1,
    answer: "Stachelschwein",
    images: {
      imageUrl: require("./img/stachelschwein.png"),
      thumbnailUrl: require("./img/thumbnails/stachelschwein.png"),
    },
    wikipediaName: "Stachelschweine"
  },
  {
    id: 2,
    answer: "Kaiserpinguin",
    images: {
      imageUrl: require("./img/kaiserpinguin.png"),
      thumbnailUrl: require("./img/thumbnails/kaiserpinguin.png"),
    },
  },
  {
    id: 3,
    answer: "Klapperschlange",
    images: {
      imageUrl: require("./img/klapperschlange.png"),
      thumbnailUrl: require("./img/thumbnails/klapperschlange.png"),
    },
    wikipediaName: "Klapperschlangen"
  },
  {
    id: 4,
    answer: "Buntspecht",
    alternativeAnswers: ["Specht"],
    images: {
      imageUrl: require("./img/buntspecht.png"),
      thumbnailUrl: require("./img/thumbnails/buntspecht.png"),
    },
  },
  {
    id: 5,
    answer: "Narwal",
    images: {
      imageUrl: require("./img/narwal.png"),
      thumbnailUrl: require("./img/thumbnails/narwal.png"),
    },
  },
  {
    id: 6,
    answer: "Zitteraal",
    images: {
      imageUrl: require("./img/zitteraal.png"),
      thumbnailUrl: require("./img/thumbnails/zitteraal.png"),
    },
    wikipediaName: "Zitteraale"
  },
  {
    id: 7,
    answer: "Wüstenrennmaus",
    images: {
      imageUrl: require("./img/wuestenrennmaus.png"),
      thumbnailUrl: require("./img/thumbnails/wuestenrennmaus.png"),
    },
    wikipediaName: "Rennmäuse"
  },
  {
    id: 8,
    answer: "Okapi",
    alternativeAnswers: ["Waldgiraffe", "Kurzhalsgiraffe"],
    images: {
      imageUrl: require("./img/okapi.png"),
      thumbnailUrl: require("./img/thumbnails/okapi.png"),
    },
  },
  {
    id: 9,
    answer: "Beutelteufel",
    alternativeAnswers: ["Tasmanischer Teufel"],
    images: {
      imageUrl: require("./img/tasmanischer_teufel.png"),
      thumbnailUrl: require("./img/thumbnails/tasmanischer_teufel.png"),
    },
  },

];