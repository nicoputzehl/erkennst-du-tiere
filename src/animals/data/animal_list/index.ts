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
    name: "Elefant",
    funFact: "Afrikanische Elefanten können mit ihren Füßen Erdbeben spüren, die hunderte Kilometer entfernt stattfinden - so kommunizieren Herden über weite Distanzen.",
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
    name: "Flamingo",
    funFact: "Flamingos werden nur durch bestimmte Algen und Krebstiere rosa - in Gefangenschaft verblassen sie ohne spezielle Nahrung wieder zu grau-weiß!",
  },
  // G
  gelbschnabeltoko: {
    name: "Gelbschnabeltoko",
    funFact: "Gelbschnabeltokos sind die einzigen Vögel, die sich während der Brutzeit komplett in Baumhöhlen einmauern - nur ein kleiner Spalt bleibt zum Füttern offen.",
  },
  giraffe: {
    name: "Giraffe",
    funFact: "Giraffen haben nur 7 Halswirbel - genau so viele wie Menschen, obwohl ihr Hals 2 Meter lang ist!",
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
    funFact: "Kap-Borstenhörnchen wedeln mit ihrem buschigen Schwanz wie mit einem Sonnenschirm, um sich vor der afrikanischen Hitze zu schützen!",
  },
  // L
  lama: {
    name: "Lama"
  },
  leopard: {
    name: "Leopard",
    funFact: "Leoparden öönnen Beute hochziehen, die doppelt so schwer ist wie sie selbst - eine 90kg-Antilope 6 Meter hoch auf einen Baum!",
  },
  loewe: {
    name: "Löwe",
    funFact: "Löwen sind die einzigen Katzen, die in Rudeln leben - alle anderen Großkatzen sind Einzelgänger!Löwen sind die einzigen Katzen, die in Rudeln leben - alle anderen Großkatzen sind Einzelgänger!",
  },
  // N
  nacktmull: {
    name: "Nacktmull",
    alternativeNames: [],
    funFact: "Obwohl sie wie winzige Würstchen mit Zähnen aussehen, sind Nacktmulle die einzigen eusoziale Säugetiere - sie leben wie Ameisen in Kolonien mit einer Königin und Arbeitern, die nie fortpflanzen.",
  },
  nashorn: {
    name: "Nashorn",
    funFact: "Nashörner haben trotz ihrer massigen Erscheinung überraschend schlechte Augen, können aber dafür auf 50 km/h beschleunigen!",
  },
  nilpferd: {
    name: "Nilpferd",
    funFact: "Nilpferde sind näher mit Walen verwandt als mit anderen Landtieren - beide stammen von denselben urzeitlichen Meeresvorfahren ab.",
  },
  // O
  orangutang: {
    name: "Orangutang"
  },
  oryxantilope: {
    name: "Oryxantilope",
    alternativeNames: ["Oryx"],
    funFact: "Oryxantilopen können monatelang ohne Wasser überleben und ihren Wasserbedarf komplett aus der Nahrung decken, selbst in der Sahara.",
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
    alternativeNames: ["Steinböckchen", "Steinbock"],
    funFact: "Steinböcke sind so kleine Antilopen, dass sie sich bei Gefahr regungslos hinlegen und dank ihrer braunen Farbe praktisch unsichtbar werden.",
  },
  stinktier: {
    name: "Stinktier",
    alternativeNames: ["Skunk"],
  },
  strauss: {
    name: "Strauss",
    funFact: "Strauße können nicht fliegen, aber dafür mit bis zu 70 km/h rennen und dabei 4 Meter weite Schritte machen.",
  },
  suedafrikanischer_seebaer: {
    name: "Südafrikanischer Seebär",
    alternativeNames: ["Seebär"],
    funFact: "Südafrikanische Seebären können ihre Hinterflossen nach vorne drehen und dadurch als einzige Robbenart richtig 'laufen' statt nur robben.",
  },
  // T
  tiger: {
    name: "Tiger"
  },
  // w
  warzenschwein: {
    name: "Warzenschwein",
    funFact: "Warzenschweine laufen bei Gefahr rückwärts in ihre Höhlen, um mit den scharfen Hauern voran jeden Angreifer abzuwehren."
  },
  // Z
  zebra: {
    name: "Zebra",
    funFact: "Zebras haben alle ein einzigartiges Streifenmuster - wie ein Fingerabdruck ist kein Zebra dem anderen gleich!",
  }
} as const;

export { ANIMAL_LIST }; 