import { Animal } from "../../types";

const ANIMAL_LIST: Record<string, Animal> = {
  // A
  axolotl: {
    name: "Axolotl",
  },
  // D
  delfin: {
    name: "Delfin"
  },
  dumbo_oktopuss: {
    name: "Dumbo-Oktopuss",
    wikipediaName: "Dumbo-Oktopusse"
  },
  // E
  elefant: {
    name: "Elefant"
  },
  // F
  fangschreckenkrebs: {
    name: "Fangeschreckenkrebs",
    wikipediaName: "Fangschreckenkrebse"
  },
  faultier: {
    name: "Faultier",
  },
  fingertier: {
    name: "Fingertier",
    alternativeNames: ["Aye-Aye"],
    funFact: "Die Aye-Ayes leben in der Dschungel und sind sehr gefragt, weil sie ihre Fäden mit ihren Fingern anziehen und damit ihre Beine bewegen.",
  },
  flamingo: {
    name: "Flamingo"
  },
  // G
  gelbschnabeltoko: {
    name: "Gelbschnabeltoko"
  },
  giraffe: {
    name: "Giraffe"
  },
  gorilla: {
    name: "Gorilla"
  },
  gottesanbeterin: {
    name: "Gottesanbeterin",
    alternativeNames: ["Mantis"],
  },
  // H
  hai: {
    name: "Hai"
  },
  hirsch: {
    name: "Hirsch"
  },
  // I
  ibex: {
    name: "Ibex"
  },
  // J
  // K
  kamel: {
    name: "Kamel"
  },
  kap_borstenhoernchen: {
    name: "Kap Borstenhörnchen",
    alternativeNames: ["Borstenhörnchen"],
  },
  // L
  lama: {
    name: "Lama"
  },
  leopard: {
    name: "Leopard"
  },
  loewe: {
    name: "Löwe"
  },
  // N
  nacktmull: {
    name: "Nacktmull",
    alternativeNames: [],
    funFact: "Obwohl sie wie winzige Würstchen mit Zähnen aussehen, sind Nacktmulle die einzigen eusoziale Säugetiere - sie leben wie Ameisen in Kolonien mit einer Königin und Arbeitern, die nie fortpflanzen.",
  },
  nashorn: {
    name: "Nashorn",
  },
  nilpferd: {
    name: "Nilpferd"
  },
  // O
  orangutang: {
    name: "Orangutang"
  },
  oryxantilope: {
    name: "Oryxantilope",
    alternativeNames: ["Oryx"],
  },
  // P
  pfau: {
    name: "Pfau"
  },
  // Q
  quokka: {
    name: "Quokka",
    funFact: "Die Quokkas leben in Australien und sind einzigartig, weil sie ihre Beine in der Lage haben, sich zu bewegen, indem sie ihre Fäden mit ihren Fingern anziehen.",
  },
  // S
  seepferdchen: {
    name: "Seepferdchen",
  },
  schnabeltier: {
    name: "Schnabeltier",
    alternativeNames: ["Playpus"],
  },
  schuppentier: {
    name: "Schuppentier",
    alternativeNames: ["Pangolin"],
    wikipediaName: "Schuppentiere"
  },
  seehund: {
    name: "Seehund"
  },
  steenbock: {
    name: "Steenbock",
    alternativeNames: ["Steinböckchen"],
  },
  stinktier: {
    name: "Stinktier",
    alternativeNames: ["Skunk"],
  },
  strauss: {
    name: "Strauss"
  },
  suedafrikanischer_seebaer: {
    name: "Südafrikanischer Seebär",
    alternativeNames: ["Seebär"],
  },
  // T
  tiger: {
    name: "Tiger"
  },
  // w
  warzenschwein: {
    name: "Warzenschwein"
  },
  // Z
  zebra: {
    name: "Zebra"
  }
} as const;

export { ANIMAL_LIST }; 