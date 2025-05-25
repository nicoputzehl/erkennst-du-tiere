import { QuestionWithAnimal } from "../../../types";

export const namibiaUnsolved: QuestionWithAnimal[] = [
  {
    id: 1,
    animal: "leopard",
    images: {
      imageUrl: require("./img/leopard.jpg"),
      thumbnailUrl: require("./img/thumbnails/leopard.jpg"),
      unsolvedImageUrl: require("./img/leopard_unsolved.jpg"),
      unsolvedThumbnailUrl: require("./img/thumbnails/leopard_unsolved.jpg"),
    },
  },
  {
    id: 2,
    animal: "nilpferd",
    images: {
      imageUrl: require("./img/nilpferd.jpg"),
      thumbnailUrl: require("./img/thumbnails/nilpferd.jpg"),
      unsolvedImageUrl: require("./img/nilpferd_unsolved.jpg"),
      unsolvedThumbnailUrl: require("./img/thumbnails/nilpferd_unsolved.jpg"),
    },
  },
  {
    id: 13,
    animal: "giraffe",
    images: {
      imageUrl: require("./img/giraffe.jpg"),
      thumbnailUrl: require("./img/thumbnails/giraffe.jpg"),
      unsolvedImageUrl: require("./img/giraffe_unsolved.jpg"),
      unsolvedThumbnailUrl: require("./img/thumbnails/giraffe_unsolved.jpg"),
    },
  },
]