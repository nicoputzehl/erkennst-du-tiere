import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const koenigskobra: QuestionBase = {
  id: 4,
  answer: "Königskobra",
  title: "Die größte Giftschlange",
  images: {
    imageUrl: require("./koenigskobra.webp"),
    unsolvedImageUrl: require("./koenigskobra_unsolved.webp"),
  },
  alternativeAnswers: ["Kobra"],
  funFact:
    "diese Schlange die längste Giftschlange der Welt und die einzige ist, die ein richtiges Nest für ihre Eier baut und es bis zum Schlupf verteidigt?",
  autoFreeHints: [
    {
      id: "kk_h1",
      type: HintType.AUTO_FREE,
      content: "Bei Bedrohung richtet sie den Vorderkörper auf und spreizt ihren markanten Nackenschild.",
      triggerAfterAttempts: 3
    },
    {
      id: "kk_h2",
      type: HintType.AUTO_FREE,
      content: "Ihre Hauptbeute sind andere Schlangen, daher ihr wissenschaftlicher Name \"Ophiophagus hannah\" (Schlangenfresser).",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "klapper",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Und die gesuchte warnen nicht durch eine Rassel, sondern durch ihre Körperform.",
      title: "Nordamerika!",
      triggers: ["klapperschlange"]
    },
    {
      id: "python_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falsche Art! Die gesuchte ist eine Giftschlange, keine Würgeschlange.",
      title: "Keine Würgeschlange!",
      triggers: ["python", "tigerpython"]
    }
  ],
  customHints: [
    {
      id: "gift",
      type: HintType.CUSTOM,
      title: "Das Gift",
      content: "Obwohl ihr Gift nicht das stärkste ist, kann sie bei einem Biss eine enorme Menge davon abgeben, was ihn lebensbedrohlich macht.",
      cost: 1,
    }
  ]
};

const grosser_panda: QuestionBase = {
  id: 3,
  answer: "Großer Panda",
  title: "Der Bambus-Bär",
  images: {
    imageUrl: require("./grosser_panda.webp"),
    unsolvedImageUrl: require("./grosser_panda_unsolved.webp"),
  },
  alternativeAnswers: ["Panda", "Riesenpanda", "Pandabär"],
  funFact:
    "dieses Tier, obwohl es zur Ordnung der Raubtiere gehört, sich zu 99% von Bambus ernährt und täglich bis zu 40 Kilogramm davon fressen muss, um satt zu werden?",
  autoFreeHints: [
    {
      id: "gp_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist das globale Symbol des WWF und vom Aussterben bedroht.",
      triggerAfterAttempts: 3
    },
    {
      id: "gp_h2",
      type: HintType.AUTO_FREE,
      content: "Das Tier ist nur in den Bergregionen Zentral-Chinas heimisch.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "roter_panda_trigger",
      type: HintType.CONTEXTUAL,
      content: "Das ist der falsche Panda! Der gesuchte ist viel größer und gehört zu den Großbären, nicht zu den Kleinbären.",
      title: "Zu klein!",
      triggers: ["roter panda", "kleiner panda"]
    },
    {
      id: "baer_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte hält keine Winterruhe, da seine Hauptnahrung – Bambus – ganzjährig verfügbar ist.",
      title: "Falscher Lebensstil!",
      triggers: ["grizzly", "bär", "schwarzbär"]
    }
  ],
  customHints: [
    {
      id: "finger",
      type: HintType.CUSTOM,
      title: "Sechster \"Finger\"",
      content: "Er hat einen verlängerten Handwurzelknochen, der wie ein sechster Finger funktioniert und ihm beim Halten von Bambus hilft.",
      cost: 1,
    }
  ]
};

const tiger: QuestionBase = {
  id: 2,
  answer: "Tiger",
  title: "Der gestreifte Jäger",
  images: {
    imageUrl: require("./koenigstiger.webp"),
    unsolvedImageUrl: require("./koenigstiger_unsolved.webp"),
  },
  alternativeAnswers: ["Bengal-Tiger", "Indischer Tiger", "Königstiger"],
  funFact:
    "der Tiger die größte lebende Katzenart der Welt ist und jeder Tiger ein einzigartiges Streifenmuster hat, das mit menschlichen Fingerabdrücken vergleichbar ist?",
  autoFreeHints: [
    {
      id: "kt_h1",
      type: HintType.AUTO_FREE,
      content: "Diese Unterart des Tigers lebt hauptsächlich in Indien und ist vom Aussterben bedroht.",
      triggerAfterAttempts: 3
    },
    {
      id: "kt_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist ein Einzelgänger und ein geschickter Lauerjäger, der eine enorme Sprungkraft besitzt.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "loewe",
      type: HintType.CONTEXTUAL,
      content: "Falsche Fellzeichnung! Der gesuchte hat keine Mähne und lebt nicht in Rudeln.",
      title: "Zu gesellig!",
      triggers: ["löwe"]
    },
    {
      id: "leopard",
      type: HintType.CONTEXTUAL,
      content: "Falsches Fellmuster! Der gesuchte hat Streifen, keine Flecken/Rosetten.",
      title: "Falsches Muster!",
      triggers: ["leopard"]
    }
  ],
  customHints: [
    {
      id: "haut",
      type: HintType.CUSTOM,
      title: "Haut",
      content: "Das Streifenmuster ist nicht nur im Fell, sondern auch auf der Haut dieses Tieres sichtbar.",
      cost: 1,
    }
  ]
};

const orang_utan: QuestionBase = {
  id: 5,
  answer: "Orang-Utan",
  title: "Der \"Waldmensch\"",
  images: {
    imageUrl: require("./orang_utan.webp"),
    unsolvedImageUrl: require("./orang_utan_unsolved.webp"),
  },
  alternativeAnswers: ["Orangutan"],
  funFact:
    "sein Name aus dem Malaiischen stammt und \"Waldmensch\" bedeutet, und dieses Tier der größte Baumbewohner im Tierreich ist, der fast sein gesamtes Leben in den Bäumen verbringt?",
  autoFreeHints: [
    {
      id: "ou_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist eine Menschenaffenart, die nur auf den Inseln Borneo und Sumatra vorkommt.",
      triggerAfterAttempts: 3
    },
    {
      id: "ou_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist bekannt für seine Intelligenz, sein rotes bis rotbraunes Fell und seine langen, kräftigen Arme (bis zu 2,2 m Spannweite).",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "gorilla",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Der gesuchte lebt in Asien und ist baumbewohnender als sein afrikanischer Verwandter.",
      title: "Zu afrikanisch!",
      triggers: ["gorilla", "schimpanse"]
    },
    {
      id: "affe",
      type: HintType.CONTEXTUAL,
      content: "Falsche Art! Der gesuchte hat keinen Schwanz und baut sich jede Nacht ein neues Nest aus Blättern und Ästen.",
      title: "Kein Affe!",
      triggers: ["affe", "makak"]
    }
  ],
  customHints: [
    {
      id: "mutti",
      type: HintType.CUSTOM,
      title: "Kindheit",
      content: "Junge bleiben etwa 8 Jahre bei ihrer Mutter – die längste Kindheitsphase im gesamten Tierreich, abgesehen vom Menschen.",
      cost: 1,
    }
  ]
};

const pfau: QuestionBase = {
  id: 1,
  answer: "Pfau",
  wikipediaName: "Asiatische_Pfauen",
  title: "Der Radschläger",
  images: {
    imageUrl: require("./pfau.webp"),
    unsolvedImageUrl: require("./pfau_unsolved.webp"),
  },
  alternativeAnswers: ["Blauer Pfau", "Asiatischer Pfau"],
  funFact:
    "die beeindruckende \"Schleppe\" des männlichen Pfaus nicht aus Schwanzfedern, sondern aus verlängerten Deckfedern besteht und das Radschlagen der Balz dient?",
  autoFreeHints: [
    {
      id: "pfau_h1",
      type: HintType.AUTO_FREE,
      content: "Der blaue oder indische Pfau stammt ursprünglich aus Indien und Sri Lanka.",
      triggerAfterAttempts: 3
    },
    {
      id: "pfau_h2",
      type: HintType.AUTO_FREE,
      content: "Trotz seiner langen Federn kann dieser Vogel kurze Strecken fliegen und zum Schlafen auf hohe Äste klettern.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "truthahn",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Und die gesuchte Art ist für die schillernden \"Augen\" auf den Federn bekannt.",
      title: "Zu amerikanisch!",
      triggers: ["truthahn"]
    },
    {
      id: "fasan",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Familie! Aber dieser Vogel hat eine viel kürzere Schwanzschleppe.",
      title: "Zu unscheinbar!",
      triggers: ["fasan"]
    }
  ],
  customHints: [
    {
      id: "helfer",
      type: HintType.CUSTOM,
      title: "Nützliches Tier",
      content: "In ländlichen Gebieten ist er beliebt, weil er junge Schlangen frisst.",
      cost: 1,
    }
  ]
};

const asiatischer_elefant: QuestionBase = {
  id: 7,
  answer: "Asiatischer Elefant",
  title: "Der Wald-Riese",
  images: {
    imageUrl: require("./asiatischer_elefant.webp"),
  },
  alternativeAnswers: ["Indischer Elefant"],
  funFact:
    "dieses Tier das größte Landsäugetier Asiens ist und im Gegensatz zu seinem afrikanischen Verwandten kleinere, eher dreieckig geformte Ohren hat?",
  autoFreeHints: [
    {
      id: "ae_h1",
      type: HintType.AUTO_FREE,
      content: "Nur die Männchen (Bullen) besitzen in der Regel Stoßzähne, die Weibchen sind meistens zahnlos.",
      triggerAfterAttempts: 3
    },
    {
      id: "ae_h2",
      type: HintType.AUTO_FREE,
      content: "Sein Rüsselende besitzt nur einen Greiffinger (im Gegensatz zum Afrikanischen Elefanten mit zwei).",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "afrika",
      type: HintType.CONTEXTUAL,
      content: "Falsche Art! Die Ohren des gesuchten sind kleiner und die Stirn hat zwei deutliche Höcker.",
      title: "Falscher Kontinent!",
      triggers: ["afrikanischer elefant"]
    },
    {
      id: "nashorn",
      type: HintType.CONTEXTUAL,
      content: "Falsches Merkmal! Das gesuchte Tier hat einen Rüssel, keinen hornbesetzten Kopf.",
      title: "Falsche Nase!",
      triggers: ["nashorn"]
    },
    {
      id: "genauer_trigger",
      type: HintType.CONTEXTUAL,
      content: "Die Lösung ist etwas genauer.",
      title: "Nicht ganz",
      triggers: ["elefant"]
    }
  ],
  customHints: [
    {
      id: "schwanger",
      type: HintType.CUSTOM,
      title: "Tragzeit",
      content: "Die Schwangerschaft dauert etwa 22 Monate – die längste Tragzeit aller Landsäugetiere.",
      cost: 1,
    }
  ]
};

const roter_panda: QuestionBase = {
  id: 8,
  answer: "Roter Panda",
  title: "Der flauschige Kletterer",
  images: {
    imageUrl: require("./roter_panda.webp"),
  },
  alternativeAnswers: ["Kleiner Panda"],
  funFact:
    "dieses Tier, obwohl es den Namen trägt, nur entfernt mit dem Großen Panda verwandt ist und zur Familie der Kleinbären gehört und den Großteil des Tages schlafend in Bäumen verbringt?",
  autoFreeHints: [
    {
      id: "rp_h1",
      type: HintType.AUTO_FREE,
      content: "Er hat ein dichtes, rotbraunes Fell, eine weiße Gesichtsmaske und einen geringelten Schwanz.",
      triggerAfterAttempts: 3
    },
    {
      id: "rp_h2",
      type: HintType.AUTO_FREE,
      content: "Er lebt in den kühlen Bergwäldern des Himalayas und ernährt sich hauptsächlich von Bambus.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "grosser_panda_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Das ist der falsche Panda! Der gesuchte ist viel kleiner und gehört zu einer eigenen Familie.",
      title: "Zu groß!",
      triggers: ["großer panda", "riesenpanda"]
    },
    {
      id: "fuchs_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein hervorragender Kletterer, der auch tagsüber hoch in den Bäumen schläft.",
      title: "Zu bodennah!",
      triggers: ["fuchs"]
    }
  ],
  customHints: [
    {
      id: "finger_2",
      type: HintType.CUSTOM,
      title: "Sechster \"Finger\"",
      content: "Auch er hat einen \"falschen Daumen\" (verlängerter Handwurzelknochen), um Bambus besser greifen zu können.",
      cost: 1,
    }
  ]
};

const python: QuestionBase = {
  id: 6,
  answer: "Python",
  title: "Würgeschlange",
  wikipediaName: "Heller_Tigerpython",
  images: {
    imageUrl: require("./tigerpython.webp"),
  },
  alternativeAnswers: ["Tigerpython"],
  funFact:
    "diese Schlange zu den größten Schlangen der Welt zählt, bis zu fünf Meter lang werden kann und ihre Beute durch Umschlingen und Ersticken tötet?",
  autoFreeHints: [
    {
      id: "tp_h1",
      type: HintType.AUTO_FREE,
      content: "Sein Körper ist muskulös und weist ein auffälliges, dunkles Sattelfleck-Muster auf hellem Untergrund auf.",
      triggerAfterAttempts: 3
    },
    {
      id: "tp_h2",
      type: HintType.AUTO_FREE,
      content: "Das Weibchen legt bis zu 100 Eier in eine Grube und \"bebrütet\" sie, indem es sich um das Gelege wickelt und Muskelzittern erzeugt, um die Temperatur zu erhöhen.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "kobra_trigger",
      type: HintType.CONTEXTUAL,
      content: "Falsche Art! Die gesuchte Art ist nicht giftig, sondern eine Würgeschlange.",
      title: "Keine Giftschlange!",
      triggers: ["kobra", "königskobra"]
    },
    {
      id: "boa",
      type: HintType.CONTEXTUAL,
      content: "Gleiche Jagdmethode, aber falsche Familie und oft falscher Kontinent! Der gesuchte ist eine eierlegende Pythonschlange.",
      title: "Zu südamerikanisch!",
      triggers: ["boa"]
    }
  ],
  customHints: [
    {
      id: "versteck",
      type: HintType.CUSTOM,
      title: "Verhalten",
      content: "Trotz seiner Größe verbringt er die meiste Zeit versteckt am Boden oder in der Nähe von Wasser.",
      cost: 1,
    }
  ]
};

export const tiereAsiens: QuestionBase[] = [
  koenigskobra,
  grosser_panda,
  tiger,
  orang_utan,
  pfau,
  asiatischer_elefant,
  roter_panda,
  python,
];

export const asienQuiz: Quiz = {
  id: "asien",
  title: "Asien",
  questions: tiereAsiens,
  titleImage: require("./koenigstiger.webp"),
  description: "Entdecke die faszinierende Tierwelt Asiens.",
};