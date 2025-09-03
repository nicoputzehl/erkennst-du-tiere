import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const afrikanischer_elefant: QuestionBase = {
  id: 1,
  answer: "Elefant",
  funFact:
    "Afrikanische Elefanten mit ihren Füßen Erdbeben spüren können, die hunderte Kilometer entfernt stattfinden - so kommunizieren Herden über weite Distanzen.",
  images: {
    imageUrl: require("./afrikanischer-elefant.webp"),
    unsolvedImageUrl: require("./afrikanischer-elefant_unsolved.webp"),
  },
  alternativeAnswers: ["Afrikanischer Elefant"],
  autoFreeHints: [
    {
      id: "elefant",
      type: HintType.AUTO_FREE,
      content: "Tööörööö",
      triggerAfterAttempts: 3
    }
  ]
};

const flusspferd: QuestionBase = {
  id: 2,
  answer: "Flusspferd",
  title: "Schau mir ins Auge, kleines",
  images: {
    imageUrl: require("./flusspferd.webp"),
    unsolvedImageUrl: require("./flusspferd_unsolved.webp"),
  },
  alternativeAnswers: ["Nilpferd", "Hippo", "Hippopotamus"],
  funFact:
    "Flusspferde näher mit Walen  als mit anderen Landtieren verwandt sind - beide stammen von denselben urzeitlichen Meeresvorfahren ab.",
  autoFreeHints: [
    {
      id: "fpferd",
      type: HintType.AUTO_FREE,
      content: "Ich bin ein großes Säugetier, das viel Zeit im Wasser verbringt...",
      triggerAfterAttempts: 2,
    }
  ]
};

const gepard: QuestionBase = {
  id: 3,
  answer: "Gepard",
  images: {
    imageUrl: require("./gepard.webp"),
    unsolvedImageUrl: require("./gepard_unsolved.webp"),
  },
  alternativeAnswers: ["Cheetah"],
};

const giraffe: QuestionBase = {
  id: 4,
  answer: "Giraffe",
  title: "Hallo da unten",
  funFact:
    "Giraffen nur 7 Halswirbel haben - genau so viele wie Menschen, obwohl ihr Hals 2 Meter lang ist!",
  images: {
    imageUrl: require("./giraffe.webp"),
    unsolvedImageUrl: require("./giraffe_unsolved.webp"),
  },
  autoFreeHints: [
    {
      id: "giraffe",
      type: HintType.AUTO_FREE,
      content: "Schwer zu erkennen. Aber versuch mal das Muster zu erkennen.",
      triggerAfterAttempts: 3
    },
    {
      id: "giraffe2",
      type: HintType.AUTO_FREE,
      content: "Die Zunge des gesuchten Tieres kann 45-50 Zentimeter lang werden und ist oft bläulich-violett gefärbt.",
      triggerAfterAttempts: 6
    },
  ]
};

const leopard: QuestionBase = {
  id: 5,
  answer: "Leopard",
  title: "Ein sehr beliebtes Muster",
  funFact:
    "Leoparden Beute hochziehen können, die doppelt so schwer ist wie sie selbst - eine 90kg-Antilope 6 Meter hoch auf einen Baum!",
  images: {
    imageUrl: require("./leopard.webp"),
    unsolvedImageUrl: require("./leopard_unsolved.webp"),
  },
  customHints: [
    {
      id: "habitat",
      type: HintType.CUSTOM,
      title: "Lebensraum",
      content: "Dieses Tier ist ein hervorragender Kletterer.",
      cost: 1,
    },
    {
      id: "color",
      type: HintType.CUSTOM,
      title: "Aussehen",
      content: "Hat ein goldgelbes Fell mit schwarzen Rosetten.",
      cost: 1,
    }
  ],
  contextualHints: [{
    id: "jaguar",
    type: HintType.CONTEXTUAL,
    content: "Richtige Richtung! Aber lebt in Afrika, nicht Südamerika.",
    triggers: ["jaguar"]
  }
    , {
    id: "gepard",
    type: HintType.CONTEXTUAL,
    content: "Auch gefleckt, aber diese Katze kann sehr gut klettern!",
    title: "Nicht ganz so schnell!",
    triggers: ["gepard", "cheetah"]
  }
  ],
  autoFreeHints: [
    {
      id: "tip_1",
      type: HintType.AUTO_FREE,
      content: "Diese gefleckte Großkatze ist fuer ihre Kletterfaehigkeiten bekannt.",
      triggerAfterAttempts: 2,
    }
  ]
};

const loewe: QuestionBase = {
  id: 6,
  answer: "Löwe",
  title: "Erstmal strecken...", funFact:
    "Löwen die einzigen Katzen sind, die in Rudeln leben - alle anderen Großkatzen sind Einzelgänger!",
  images: {
    imageUrl: require("./loewe.webp"),
    unsolvedImageUrl: require("./loewe_unsolved.webp"),
  },
  autoFreeHints: [
    {
      id: "loew",
      type: HintType.AUTO_FREE,
      content: "Man nennt mich auch den König der Tiere.",
      triggerAfterAttempts: 4
    }
  ]
};

const nashorn: QuestionBase = {
  id: 7,
  answer: "Nashorn",
  title: "Ein Dickhäuter.",
  images: {
    imageUrl: require("./nashorn.webp"),
    unsolvedImageUrl: require("./nashorn_unsolved.webp"),
  },
  alternativeAnswers: ["Breitmaulnashorn"],
  autoFreeHints: [
    {
      id: "nashorn",
      type: HintType.AUTO_FREE,
      content: "Den Namensgebenden Teil meines Gesichts kann man nicht sehen.",
      triggerAfterAttempts: 6
    }
  ]
};

const zebra: QuestionBase = {
  id: 8,
  answer: "Zebra",
  title: "Das ist leicht",
  funFact:
    "Alle Zebras ein einzigartiges Streifenmuster haben - wie ein Fingerabdruck ist kein Zebra dem anderen gleich!",
  images: {
    imageUrl: require("./zebra.webp"),
    unsolvedImageUrl: require("./zebra_unsolved.webp"),
  },
  autoFreeHints: [
    {
      id: "zebra",
      type: HintType.AUTO_FREE,
      content: "Ich bin mit Pferden verwandt.",
      triggerAfterAttempts: 6
    }
  ]
};

const tiereAfrikas: QuestionBase[] = [
  afrikanischer_elefant,
  flusspferd,
  gepard,
  giraffe,
  leopard,
  loewe,
  nashorn,
  zebra,
];

export const afrikaQuiz: Quiz = {
  id: "afrika",
  title: "Afrika",
  questions: tiereAfrikas,
  titleImage: require("./loewe.webp"),
  description: "Erkunde die majestätische Tierwelt Afrikas.",
};