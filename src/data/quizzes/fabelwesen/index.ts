import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const drache: QuestionBase = {
  id: 1,
  answer: "Drache",
  title: "Der feurige Wächter",
  wikipediaName: "Drache_(Mythologie)",
  images: {
    imageUrl: require("./drache.webp"),
  },
  funFact:
    "...der Name des Drachen sich vom griechischen Wort \"Drakon\" ableitet, was \"starrblickend\" oder \"scharf blickendes Tier\" bedeutet und in der Antike auch für große Schlangen verwendet wurde?",
  autoFreeHints: [
    {
      id: "drache_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist das bekannteste Fabelwesen, kann meist Feuer speien und symbolisiert oft Gefahr oder einen Schatz, den es zu bewachen gilt.",
      triggerAfterAttempts: 3
    },
    {
      id: "drache_h2",
      type: HintType.AUTO_FREE,
      content: "Ein Bad im Blut dieses Wesens machte den Helden Siegfried unverwundbar.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "basilisk_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist deutlich größer und kann fliegen, seine Hauptwaffe ist Feuer – nicht der Blick.",
      title: "Kein Basilisken-Blick!",
      triggers: ["basilisk", "schlange"]
    },
    {
      id: "greif_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ähnelt einer Echse und ist kein Mischwesen aus Adler und Löwe.",
      title: "Kein Adler-Kopf!",
      triggers: ["greif", "hippogreif"]
    }
  ],
  customHints: [
    {
      id: "drache_asien",
      type: HintType.CUSTOM,
      title: "Fernöstliche Variante",
      content: "In der asiatischen Mythologie ist er oft ein wohlwollendes Symbol für Glück, Macht und Wetterkontrolle (Regen).",
      cost: 1,
    }
  ]
};

const basilisk: QuestionBase = {
  id: 2,
  answer: "Basilisk",
  title: "Der König der Schlangen",
  wikipediaName: "Basilisk_(Mythologie)",
  images: {
    imageUrl: require("./basilisk.webp"),
  },
  funFact:
    "...der Basilisk der Legende nach aus einem dotterlosen Hühnerei schlüpft, das von einer Kröte oder Schlange ausgebrütet wird und sein Name \"kleiner König\" bedeutet?",
  autoFreeHints: [
    {
      id: "basilisk_h1",
      type: HintType.AUTO_FREE,
      content: "Seine berühmteste Waffe ist sein tödlicher Blick oder Basiliskenblick, der Menschen versteinern oder töten kann.",
      triggerAfterAttempts: 3
    },
    {
      id: "basilisk_h2",
      type: HintType.AUTO_FREE,
      content: "Im Mittelalter wurde er oft mit dem Oberkörper eines Hahns und dem Unterleib einer Schlange dargestellt.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "drache_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist wesentlich kleiner, hat meist Federn und lebt oft in Brunnenschächten und Kellern.",
      title: "Kein Drache!",
      triggers: ["drache", "hydra"]
    },
    {
      id: "kobra_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein mythisches Wesen, das nicht nur giftig ist, sondern auch einen tödlichen Blick besitzt.",
      title: "Keine Kobra!",
      triggers: ["schlange", "kobra"]
    }
  ],
  customHints: [
    {
      id: "basilisk_feind",
      type: HintType.CUSTOM,
      title: "Sein einziger Feind",
      content: "Er soll angeblich nur durch das Krähen eines Hahnes oder durch sein eigenes Spiegelbild getötet werden können.",
      cost: 1,
    }
  ]
};

const mantikor: QuestionBase = {
  id: 3,
  answer: "Mantikor",
  title: "Menschenfresser",
  images: {
    imageUrl: require("./mantikor.webp"),
  },
  alternativeAnswers: ["Manticor", "Manticore", "Manticora", "Marticora"],
  funFact:
    "...sein altpersischer Name \"Martiyaxvāra\" wörtlich \"Menschenfresser\" bedeutet und die Legende ursprünglich aus Indien stammt?",
  autoFreeHints: [
    {
      id: "mantikor_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist ein Mischwesen mit dem Körper eines Löwen, einem menschlichen Kopf und dem Schwanz eines Skorpions.",
      triggerAfterAttempts: 3
    },
    {
      id: "mantikor_h2",
      type: HintType.AUTO_FREE,
      content: "Sein Maul ist oft mit drei Reihen rasiermesserscharfer Zähne beschrieben, um seine Opfer restlos zu zerreißen.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "sphinx_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein unersättlicher Fleischfresser und hat einen Skorpionsschwanz, er ist kein Rätselsteller.",
      title: "Keine Rätsel!",
      triggers: ["sphinx", "chimäre"]
    },
    {
      id: "löwe_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte hat mehr als nur einen Löwenkörper: Er hat einen menschlichen Kopf und einen Skorpionsschwanz.",
      title: "Zu viele Extras!",
      triggers: ["löwe", "tiger"]
    }
  ],
  customHints: [
    {
      id: "mantikor_ursprung",
      type: HintType.CUSTOM,
      title: "Reales Vorbild",
      content: "Manche antike Gelehrte vermuteten, dass die Legende auf Berichten über den indischen Tiger beruhte.",
      cost: 1,
    }
  ]
};

const hippokamp: QuestionBase = {
  id: 4,
  answer: "Hippokamp",
  title: "Das Ross des Meeresgottes",
  images: {
    imageUrl: require("./hippokamp.webp"),
  },
  alternativeAnswers: ["Seepferd", "Hippocamp"],
  funFact:
    "...der Hippokamp das mythologische Vorbild für das uns bekannte Seepferdchen (Hippocampus) ist und auch einem Teil des menschlichen Gehirns seinen Namen gibt?",
  autoFreeHints: [
    {
      id: "hippokamp_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist ein griechisches Mischwesen: vorne ein Pferd und hinten ein Fisch (oder eine Schlange).",
      triggerAfterAttempts: 3
    },
    {
      id: "hippokamp_h2",
      type: HintType.AUTO_FREE,
      content: "Er dient als Zugtier für den Streitwagen des Meeresgottes Poseidon und anderer Meeresgottheiten.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "meerjungfrau_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein Tier und kein Mischwesen aus Mensch und Fisch.",
      title: "Keine Sirene!",
      triggers: ["meerjungfrau", "sirene"]
    },
    {
      id: "pegasus_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte lebt im Wasser und hat keinen kompletten Pferdekörper und keine Flügel.",
      title: "Falscher Lebensraum!",
      triggers: ["pegasos", "pferd"]
    }
  ],
  customHints: [
    {
      id: "hippokamp_symbol",
      type: HintType.CUSTOM,
      title: "Symbolik",
      content: "In der Kunst symbolisiert er oft die wilde, ungestüme Kraft des Meeres.",
      cost: 1,
    }
  ]
};

const pegasos: QuestionBase = {
  id: 5,
  answer: "Pegasos",
  title: "Das geflügelte Dichterross",
  images: {
    imageUrl: require("./pegasos.webp"),
  },
  alternativeAnswers: ["Pegasus"],
  wikipediaName: "Pegasos_(Mythologie)",
  funFact:
    "...Pegasos das Kind des Meeresgottes Poseidon und der Gorgone Medusa war und ihrem Nacken entsprang, als Perseus sie enthauptete?",
  autoFreeHints: [
    {
      id: "pegasos_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist das berühmteste geflügelte Pferd der griechischen Mythologie.",
      triggerAfterAttempts: 3
    },
    {
      id: "pegasos_h2",
      type: HintType.AUTO_FREE,
      content: "Mit einem Hufschlag erzeugte er die Quelle Hippokrene auf dem Berg Helikon, die den Musen und Dichtern Inspiration schenkte.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "einhorn_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte hat zwei große Flügel, aber kein Horn.",
      title: "Flügel, kein Horn!",
      triggers: ["einhorn", "unicorn"]
    },
    {
      id: "hippogreif_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein reines Pferd mit Flügeln; er ist keine Mischung aus Pferd und Greif.",
      title: "Kein Greifen-Anteil!",
      triggers: ["hippogreif", "greif"]
    }
  ],
  customHints: [
    {
      id: "pegasos_reiter",
      type: HintType.CUSTOM,
      title: "Sein berühmter Reiter",
      content: "Sein Reiter war der Held Bellerophon, dem er half, die Chimäre zu besiegen.",
      cost: 1,
    }
  ]
};

const einhorn: QuestionBase = {
  id: 6,
  answer: "Einhorn",
  title: "Das Symbol der Reinheit",
  images: {
    imageUrl: require("./einhorn.webp"),
  },
  alternativeAnswers: ["Unicorn"],
  funFact:
    "...das angebliche Horn des Einhorns, das im Mittelalter und in der frühen Neuzeit als Heilmittel verkauft wurde, meist vom Stoßzahn des Narwals stammte?",
  autoFreeHints: [
    {
      id: "einhorn_h1",
      type: HintType.AUTO_FREE,
      content: "Dieses Huftier wird meist als reines, weißes Pferd dargestellt, das ein einzelnes, gewundenes Horn auf der Stirn trägt.",
      triggerAfterAttempts: 3
    },
    {
      id: "einhorn_h2",
      type: HintType.AUTO_FREE,
      content: "Es gilt als Symbol für Keuschheit und Unschuld und kann der Legende nach nur von einer Jungfrau eingefangen werden.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "nashorn_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein mythisches Wesen, das für Reinheit steht; er ist kein reales, dickhäutiges Tier.",
      title: "Kein Nashorn!",
      triggers: ["nashorn", "rhinozeros"]
    },
    {
      id: "pegasus_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte hat ein Horn, aber keine Flügel.",
      title: "Fehlende Flügel!",
      triggers: ["pegasus", "geflügeltes pferd"]
    }
  ],
  customHints: [
    {
      id: "einhorn_gift",
      type: HintType.CUSTOM,
      title: "Horn-Kräfte",
      content: "Sein Horn wurde traditionell als Mittel zur Neutralisierung von Gift in Speisen und Getränken verwendet.",
      cost: 1,
    }
  ]
};

const phoenex: QuestionBase = {
  id: 7,
  answer: "Phönix",
  title: "Der Vogel der Auferstehung",
  wikipediaName: "Phönix_(Mythologie)",
  images: {
    imageUrl: require("./phoenix.webp"),
  },
  alternativeAnswers: ["Phoenix"],
  funFact:
    "...der Phönix oft mit dem Sonnengott Re in der ägyptischen Mythologie in Verbindung gebracht wird und den täglichen Aufstieg der Sonne symbolisiert?",
  autoFreeHints: [
    {
      id: "phoenex_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist ein Vogel mit leuchtend roten und goldenen Federn und sieht oft einem Adler oder Pfau ähnlich.",
      triggerAfterAttempts: 3
    },
    {
      id: "phoenex_h2",
      type: HintType.AUTO_FREE,
      content: "Er verbrennt sich am Ende seines Lebenszyklus selbst und steigt dann aus seiner eigenen Asche neu und verjüngt auf.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "adler_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein Fabelwesen, das unsterblich ist und durch Feuer wiedergeboren wird.",
      title: "Nicht nur ein Raubvogel!",
      triggers: ["adler", "falke"]
    },
    {
      id: "drache_trigger_3",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Elemente (Feuer!), aber der gesuchte ist ein Vogel und kein Reptil.",
      title: "Keine Schuppen!",
      triggers: ["drache", "salamander"]
    }
  ],
  customHints: [
    {
      id: "phoenex_zyklus",
      type: HintType.CUSTOM,
      title: "Der Zyklus",
      content: "Der Mythos besagt, dass er etwa alle 500 Jahre stirbt und wiederkehrt.",
      cost: 1,
    }
  ]
};

const greif: QuestionBase = {
  id: 8,
  answer: "Greif",
  title: "Gryffindor",
  images: {
    imageUrl: require("./greif.webp"),
  },
  funFact:
    "...der Greif ein Zeichen für Wachsamkeit und Stärke ist und oft verwendet wurde, um wertvolle Schätze wie Goldminen zu bewachen?",
  autoFreeHints: [
    {
      id: "greif_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist ein Mischwesen: Er hat den Kopf, die Flügel und die Krallen eines Adlers und den Körper, die Beine und den Schwanz eines Löwen.",
      triggerAfterAttempts: 3
    },
    {
      id: "greif_h2",
      type: HintType.AUTO_FREE,
      content: "Er gilt als König der Tiere, da er die beiden Könige des Tierreichs vereint (Löwe = König der Erde, Adler = König der Lüfte).",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "mantikor_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte hat einen Adlerkopf und keine menschlichen Züge oder einen Skorpionsschwanz.",
      title: "Falscher Kopf!",
      triggers: ["mantikor", "chimäre"]
    },
    {
      id: "sphinx_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte hat einen Adlerkopf und keine menschlichen Züge oder Brüste.",
      title: "Falscher Kopf!",
      triggers: ["sphinx"]
    }
  ],
  customHints: [
    {
      id: "greif_herkules",
      type: HintType.CUSTOM,
      title: "Wagen des Zeus",
      content: "Er ist oft das Tier, das den Wagen des obersten Gottes Zeus (oder in Rom Jupiter) zieht.",
      cost: 1,
    }
  ]
};

const fabelwesen: QuestionBase[] = [
  drache,
  basilisk,
  mantikor,
  hippokamp,
  pegasos,
  einhorn,
  phoenex,
  greif,
];

export const fabelwesenQuiz: Quiz = {
  id: "fabelwesen",
  title: "Fabelwesen und Mythen",
  questions: fabelwesen,
  titleImage: require("./drache.webp"),
  description: "Erkunde eine Welt voller mythischer Kreaturen."
};