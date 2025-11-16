import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const haubenmeise: QuestionBase = {
  id: 1,
  answer: "Haubenmeise",
  title: "Der Schopf-Träger im Nadelwald",
  images: {
    imageUrl: require("./haubenmeise.webp"),
  },
  funFact:
    "...sie die einzige europäische Meisenart mit einer voll ausgeprägten, weiß-grauen Federhaube ist, die wie ein militärischer \"Schopf\" aussieht?",
  autoFreeHints: [
    {
      id: "haubenmeise_h1",
      type: HintType.AUTO_FREE,
      content: "Ein weiteres auffälliges Merkmal ist das halbmondförmige, schwarze Band, das vom Auge bis zur Kehle verläuft (\"Lätzchen\").",
      triggerAfterAttempts: 3
    },
    {
      id: "haubenmeise_h2",
      type: HintType.AUTO_FREE,
      content: "Dieser Vogel lebt primär in Nadelwäldern (Fichten, Kiefern) und ist sehr standorttreu.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "kohlmeise_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie, aber der gesuchte ist nicht gelb und trägt eine markante Kopfbedeckung.",
      title: "Falsche Meise!",
      triggers: ["kohlmeise", "blaumeise", "meise"]
    },
    {
      id: "fink_trigger",
      type: HintType.CONTEXTUAL,
      content: "Ganz anderer Gesang! Der gesuchte hat ein charakteristisches, brodelndes \"dürr-dürr-ET\".",
      title: "Kein Fink!",
      triggers: ["buchfink", "grünfink"]
    }
  ],
  customHints: [
    {
      id: "haubenmeise_nistkasten",
      type: HintType.CUSTOM,
      title: "Nistgewohnheit",
      content: "Für ihre Haube kann das Einflugloch von Standard-Nistkästen zu eng sein. Sie brütet oft in selbst gemeißelten Höhlen in morschem Holz.",
      cost: 1,
    }
  ]
};

const bienenfresser: QuestionBase = {
  id: 2,
  answer: "Bienenfresser",
  title: "Der fliegende Edelstein",
  wikipediaName: "Bienenfresser_(Art)",
  images: {
    imageUrl: require("./bienenfresser.webp"),
  },
  funFact:
    "...er der farbenprächtigste europäische Brutvogel ist und er vor dem Verzehr den Giftstachel von Bienen und Wespen durch Schlagen gegen eine Unterlage entfernt?",
  autoFreeHints: [
    {
      id: "bienenfresser_h1",
      type: HintType.AUTO_FREE,
      content: "Als Langstreckenzieher überwintert er in Afrika und ist in Deutschland ein Profiteur des Klimawandels.",
      triggerAfterAttempts: 3
    },
    {
      id: "bienenfresser_h2",
      type: HintType.AUTO_FREE,
      content: "Seine Nester sind über zwei Meter lange, horizontale Röhren, die er in sandige oder lösshaltige Steilwände gräbt.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "eisvogel_trigger",
      type: HintType.CONTEXTUAL,
      content: "Ähnliche Farben, aber der gesuchte jagt fliegende Insekten (Bienen/Wespen), nicht Fische.",
      title: "Falsche Beute!",
      triggers: ["eisvogel"]
    },
    {
      id: "racke_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie (Rackenvögel), aber der gesuchte ist noch bunter und hat einen anderen Speiseplan.",
      title: "Falscher Kontinent!",
      triggers: ["racke"]
    }
  ],
  customHints: [
    {
      id: "bienenfresser_ruf",
      type: HintType.CUSTOM,
      title: "Stimme",
      content: "Sein Ruf ist ein weiches, rollendes und charakteristisches \"prüpp\" oder \"püt\".",
      cost: 1,
    }
  ]
};

const eichelhaeher: QuestionBase = {
  id: 3,
  answer: "Eichelhäher",
  title: "Der \"Polizist\" des Waldes",
  images: {
    imageUrl: require("./eichelhaeher.webp"),
  },
  funFact:
    "...dieser Rabenvogel dafür bekannt ist, die Stimmen anderer Vögel (z.B. Mäusebussard) und Umgebungsgeräusche perfekt imitieren zu können?",
  autoFreeHints: [
    {
      id: "eichelhaeher_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist leicht an seinen auffälligen, leuchtend blau-schwarz gestreiften Federn auf den Flügeldecken zu erkennen.",
      triggerAfterAttempts: 3
    },
    {
      id: "eichelhaeher_h2",
      type: HintType.AUTO_FREE,
      content: "Dieser Vogel legt große Wintervorräte an und kann bis zu 10 Eicheln gleichzeitig in seinem Kehlsack transportieren. Er ist ein wichtiger \"Waldpflanzer\".",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "rabe_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie, aber der gesuchte ist viel bunter und sammelt bevorzugt Nüsse.",
      title: "Falscher Rabenvogel!",
      triggers: ["rabe", "krähe", "elster"]
    },
    {
      id: "tannenhäher_trigger",
      type: HintType.CONTEXTUAL,
      content: "Ähnlicher Name, aber der gesuchte ist rötlich-grau, nicht braun mit weißen Tupfen.",
      title: "Falsche Nüsse!",
      triggers: ["tannenhäher"]
    }
  ],
  customHints: [
    {
      id: "eichelhaeher_warnruf",
      type: HintType.CUSTOM,
      title: "Sein Ruf",
      content: "Sein lauter, heiserer Warnruf (\"Rätschen\") alarmiert andere Waldbewohner bei Gefahr, weshalb er als \"Wächter des Waldes\" gilt.",
      cost: 1,
    }
  ]
};

const raubwuerger: QuestionBase = {
  id: 4,
  answer: "Raubwürger",
  title: "Der graue Räuber mit Maske",
  images: {
    imageUrl: require("./raubwuerger.webp"),
  },
  funFact:
    "...dieser Singvogel sich wie ein Greifvogel ernährt und einen kräftigen, hakenförmigen Schnabel besitzt, der dem eines Falken ähnelt?",
  autoFreeHints: [
    {
      id: "raubwuerger_h1",
      type: HintType.AUTO_FREE,
      content: "Sein Gefieder ist grau-weiß mit einem markanten schwarzen Streifen, der wie eine \"Räubermaske\" über die Augen verläuft.",
      triggerAfterAttempts: 3
    },
    {
      id: "raubwuerger_h2",
      type: HintType.AUTO_FREE,
      content: "Er spießt überzählige Beute (Insekten, kleine Wirbeltiere) auf Dornen von Büschen oder Stacheldraht auf, um sie später zu verzehren.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "falke_trigger_1",
      type: HintType.CONTEXTUAL,
      content: "Falsche Ordnung! Der gesuchte ist ein Sperlingsvogel, kein Greifvogel.",
      title: "Kein Greifvogel!",
      triggers: ["falke", "bussard"]
    },
    {
      id: "rotkopfwuerger_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie, aber der gesuchte hat keinen roten Kopf.",
      title: "Falscher Würger!",
      triggers: ["rotkopfwürger"]
    }
  ],
  customHints: [
    {
      id: "raubwuerger_warte",
      type: HintType.CUSTOM,
      title: "Jagdstrategie",
      content: "Er sitzt oft sehr exponiert auf Baumspitzen oder Stromleitungen, um von dort aus seine Beute am Boden zu erspähen.",
      cost: 1,
    }
  ]
};

const gruenspecht: QuestionBase = {
  id: 5,
  answer: "Grünspecht",
  title: "Der lachende Ameisenjäger",
  images: {
    imageUrl: require("./gruenspecht.webp"),
  },
  alternativeAnswers: ["Grasspecht", "Erdspecht"],
  funFact:
    "...sein lauter, schnell aneinander gereihter Ruf wie ein schallendes Lachen (\"klü-klü-klü-klü\") klingt und er deshalb den Spitznamen \"Lachvogel\" trägt?",
  autoFreeHints: [
    {
      id: "gruenspecht_h1",
      type: HintType.AUTO_FREE,
      content: "Er hat ein leuchtend grünes Gefieder und einen auffälligen roten Scheitel.",
      triggerAfterAttempts: 3
    },
    {
      id: "gruenspecht_h2",
      type: HintType.AUTO_FREE,
      content: "Er verbringt die meiste Zeit am Boden, um mit seiner bis zu 10 cm langen, klebrigen Zunge Ameisen und deren Larven aus Nestern zu holen.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "buntspecht_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie, aber der gesuchte ist großflächig grün, nicht schwarz-weiß-rot.",
      title: "Falsche Farbe!",
      triggers: ["buntspecht", "schwarzspecht"]
    },
    {
      id: "grauspecht_trigger",
      type: HintType.CONTEXTUAL,
      content: "Ähnliche Farbe, aber der gesuchte hat einen roten Scheitel, der fast über den ganzen Kopf geht.",
      title: "Zu grau!",
      triggers: ["grauspecht"]
    }
  ],
  customHints: [
    {
      id: "gruenspecht_trommeln",
      type: HintType.CUSTOM,
      title: "Kommunikation",
      content: "Im Gegensatz zu den meisten anderen Spechten trommelt er nur sehr selten und unregelmäßig.",
      cost: 1,
    }
  ]
};

const wespenbussard: QuestionBase = {
  id: 6,
  answer: "Wespenbussard",
  title: "Der Honigjäger unter den Greifen",
  images: {
    imageUrl: require("./wespenbussard.webp"),
  },
  funFact:
    "...er der einzige Greifvogel ist, der sich auf das Fressen von Larven und Puppen von Wespen und Hummeln spezialisiert hat und deren Nester dafür aus dem Boden gräbt?",
  autoFreeHints: [
    {
      id: "wespenbussard_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist ein Zugvogel, der Ende August eine spektakuläre Wanderung von bis zu 7000 km in sein Winterquartier in Afrika beginnt.",
      triggerAfterAttempts: 3
    },
    {
      id: "wespenbussard_h2",
      type: HintType.AUTO_FREE,
      content: "Sein Gefieder ähnelt dem des Mäusebussards, aber sein Kopf ist kleiner und taubenartiger. Sein Schwanz hat zwei bis drei markante, dunkle Querbinden.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "maeusebussard_trigger",
      type: HintType.CONTEXTUAL,
      content: "Ähnliches Aussehen, aber der gesuchte ist ein Nahrungsspezialist und frisst keine Mäuse.",
      title: "Falsche Beute!",
      triggers: ["mäusebussard"]
    },
    {
      id: "falke_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte hat breitere Flügel und ist kein aktiver Luftjäger, sondern sucht seine Beute am Boden.",
      title: "Zu schnell!",
      triggers: ["falke"]
    }
  ],
  customHints: [
    {
      id: "wespenbussard_schutz",
      type: HintType.CUSTOM,
      title: "Schutzmechanismus",
      content: "Dichtes, schuppiges Gefieder um Augen und Schnabel schützt ihn vor den Stichen der wehrhaften Insekten beim Ausgraben der Nester.",
      cost: 1,
    }
  ]
};

const rotkopfwuerger: QuestionBase = {
  id: 7,
  answer: "Rotkopfwürger",
  title: "Der Rotkäppchen-Räuber",
  images: {
    imageUrl: require("./rotkopfwuerger.webp"),
  },
  funFact:
    "...dieser Vogel früher ein typischer Brutvogel in Streuobstwiesen war, heute in Deutschland aber als vom Aussterben bedroht gilt?",
  autoFreeHints: [
    {
      id: "rotkopfwuerger_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist erkennbar an seiner leuchtend rotbraunen \"Kappe\" und der schwarzen Augenmaske.",
      triggerAfterAttempts: 3
    },
    {
      id: "rotkopfwuerger_h2",
      type: HintType.AUTO_FREE,
      content: "Wie seine Verwandten spießt er seine Beute auf Dornen auf, wird aber nicht so groß wie sein Namensvetter Raubwürger.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "neuntöter_trigger",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Gattung (Würger), aber der gesuchte hat keine rote Brust und eine dunkle Maske.",
      title: "Falscher Würger!",
      triggers: ["neuntöter"]
    },
    {
      id: "raubwuerger_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie, aber der gesuchte hat eine rote Kopfhaube.",
      title: "Zu grau!",
      triggers: ["raubwürger"]
    }
  ],
  customHints: [
    {
      id: "rotkopfwuerger_gesang",
      type: HintType.CUSTOM,
      title: "Gesang",
      content: "Das Männchen und Weibchen singen oft im Duett. Sein Verbreitungsschwerpunkt liegt in Südeuropa.",
      cost: 1,
    }
  ]
};

const star: QuestionBase = {
  id: 8,
  answer: "Star",
  title: "Der Meisterimitator",
  images: {
    imageUrl: require("./star.webp"),
  },
  funFact:
    "...sein Gesang aus einer Mischung von Pfeifen, Knurr- und Knarrlauten und beeindruckenden Imitationen von Gesängen anderer Vögel oder sogar Handyklingeltönen besteht?",
  autoFreeHints: [
    {
      id: "star_h1",
      type: HintType.AUTO_FREE,
      content: "Im Prachtkleid (Brutzeit) ist sein Gefieder metallisch glänzend und wirkt schwarz-violett-grün schillernd, im Schlichtkleid (Winter) hat es auffällige weiße Punkte.",
      triggerAfterAttempts: 3
    },
    {
      id: "star_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist bekannt für seine riesigen Schwärme (\"Massenflüge\"), die am Abend beeindruckende Formationen an den Himmel zaubern.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "amsel_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist geselliger, im Prachtkleid stark glänzend und hat einen kurzen Schwanz.",
      title: "Zu groß!",
      triggers: ["amsel", "drossel"]
    },
    {
      id: "spatz_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist größer, hat einen viel kürzeren Schwanz und ein intensiv schillerndes Gefieder.",
      title: "Falsches Gezwitscher!",
      triggers: ["spatz"]
    }
  ],
  customHints: [
    {
      id: "star_gang",
      type: HintType.CUSTOM,
      title: "Fortbewegung",
      content: "Am Boden läuft er nicht, sondern geht oder hüpft schnell auf seinen kurzen Beinen.",
      cost: 1,
    }
  ]
};

const heimischeVoegel: QuestionBase[] = [
  haubenmeise,
  bienenfresser,
  eichelhaeher,
  raubwuerger,
  gruenspecht,
  wespenbussard,
  rotkopfwuerger,
  star,
];

export const vogelIllustrationenQuiz: Quiz = {
  id: "vogelIllustrationen",
  title: "Vögel - Illustrationen",
  questions: heimischeVoegel,
  titleImage: require("./star.webp"),
  description: "Teste dein Wissen über die gefiederte Vielfalt in unseren Breitengraden.",
};