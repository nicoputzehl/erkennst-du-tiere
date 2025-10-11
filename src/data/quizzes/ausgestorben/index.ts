import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const dodo: QuestionBase = {
  id: 1,
  answer: "Dodo",
  title: "Der ikonische Flugunfähige",
  images: {
    imageUrl: require("./dodo.webp"),
  },
  alternativeAnswers: ["Dudu", "Dronte", "Doudo"],
  funFact:
    "Er wurde zu einem berühmten Symbol für das von Menschen verursachte Artensterben. Die Art wurde nur etwa 100 Jahre nach ihrer Entdeckung durch Seefahrer ausgerottet (ca. 1690).",
  autoFreeHints: [
    {
      id: "dodo_h1",
      type: HintType.AUTO_FREE,
      content: "Dieser große, **flugunfähige** Vogel war nur auf der Insel **Mauritius** im Indischen Ozean beheimatet.",
      triggerAfterAttempts: 3
    },
    {
      id: "dodo_h2",
      type: HintType.AUTO_FREE,
      content: "Er war mit den heutigen **Tauben** verwandt und wurde von Seeleuten wegen seines Fleisches gejagt und durch eingeschleppte Tiere bedroht.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "strauss_trigger",
      type: HintType.CONTEXTUAL,
      content: "Dieser Vogel war nur etwa einen Meter hoch und stammte von Mauritius, nicht aus Afrika oder Madagaskar.",
      title: "Kein Strauß oder Emu!",
      triggers: ["strauß", "emu", "elefantenvogel"]
    }
  ],
  customHints: [
    {
      id: "dodo_buch",
      type: HintType.CUSTOM,
      title: "Literarischer Auftritt",
      content: "Eine berühmte Figur dieses Vogels erscheint in Lewis Carrolls Buch **'Alice im Wunderland'**.",
      cost: 1,
    }
  ]
};

const quagga: QuestionBase = {
  id: 2,
  answer: "Quagga",
  title: "Das gestreifte Halbpferd",
  images: {
    imageUrl: require("./quagga.webp"),
  },
  funFact:
    "Sein Name leitet sich von dem Laut ab, den das Tier angeblich von sich gab. Es ist eine ausgestorbene **Unterart des Steppenzebras**.",
  autoFreeHints: [
    {
      id: "quagga_h1",
      type: HintType.AUTO_FREE,
      content: "Dieses Tier lebte in **Südafrika** und wurde Ende des 19. Jahrhunderts wegen seines Fells und als Konkurrenz zu Nutztieren ausgerottet.",
      triggerAfterAttempts: 3
    },
    {
      id: "quagga_h2",
      type: HintType.AUTO_FREE,
      content: "Es war nur an **Kopf und Hals kräftig schwarz-weiß gestreift**; die Streifen verblassten zum hinteren Rumpf hin zu einem einfarbigen Braun.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "zebra_trigger",
      type: HintType.CONTEXTUAL,
      content: "Es ist nur teilweise gestreift; die Streifen bedecken nicht den gesamten Körper bis zu den Hufen.",
      title: "Kein 'Voll-Zebra'!",
      triggers: ["zebra", "pferd", "esel"]
    }
  ],
  customHints: [
    {
      id: "quagga_letztes",
      type: HintType.CUSTOM,
      title: "Der letzte seiner Art",
      content: "Das letzte bekannte Tier starb 1883 im **Zoo von Amsterdam**.",
      cost: 1,
    }
  ]
};

const trilobit: QuestionBase = {
  id: 3,
  answer: "Trilobit",
  title: "Der dreilappige Urmeeresbewohner",
  images: {
    imageUrl: require("./trilobit.webp"),
  },
  alternativeAnswers: ["Trilobite"],
  funFact:
    "Der Name bedeutet **'Drei Lappen'** und bezieht sich auf die dreifache Längsgliederung seines Körpers (Kopf-, Rumpf- und Schwanzschild).",
  autoFreeHints: [
    {
      id: "trilobit_h1",
      type: HintType.AUTO_FREE,
      content: "Diese Gliederfüßer (Arthropoden) waren reine **Meeresbewohner** und existierten vom Kambrium bis zum Perm, also während des gesamten Erdaltertums (**Paläozoikum**).",
      triggerAfterAttempts: 3
    },
    {
      id: "trilobit_h2",
      type: HintType.AUTO_FREE,
      content: "Sie sind eine der **divergentesten Gruppen ausgestorbener Lebewesen** und heute nur noch als **Fossilien** zu finden.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "insekt_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein urzeitlicher Meeresschädling und kein Insekt oder Reptil.",
      title: "Kein Dinosaurier!",
      triggers: ["insekt", "käfer", "dinosaurier"]
    }
  ],
  customHints: [
    {
      id: "trilobit_zeit",
      type: HintType.CUSTOM,
      title: "Wann starb es aus?",
      content: "Er starb beim größten Massenaussterben der Erdgeschichte am Ende des **Perms** vor etwa 251 Millionen Jahren.",
      cost: 1,
    }
  ]
};

const saebelzahnkatze: QuestionBase = {
  id: 4,
  answer: "Säbelzahnkatze",
  title: "Der Prädator der Eiszeit",
  images: {
    imageUrl: require("./saebelzahnkatze.webp"),
  },
  alternativeAnswers: ["Säbelzahntiger", "Smilodon"],
  funFact:
    "Die bekannteste Gattung ist **Smilodon**. Sie konnten ihr Maul bis zu 120 Grad weit öffnen, damit die riesigen Zähne zum Einsatz kommen konnten.",
  autoFreeHints: [
    {
      id: "saebelzahnkatze_h1",
      type: HintType.AUTO_FREE,
      content: "Diese **Großkatze der Eiszeit** zeichnete sich durch extrem lange, dolchartige **obere Eckzähne** aus, die bis zu 20 cm lang werden konnten.",
      triggerAfterAttempts: 3
    },
    {
      id: "saebelzahnkatze_h2",
      type: HintType.AUTO_FREE,
      content: "Sie jagte große Pflanzenfresser wie **Mammute** und starb am Ende der letzten Eiszeit vor etwa 10.000 Jahren aus.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "tiger_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein ausgestorbenes Tier mit unverhältnismäßig großen Eckzähnen, aber kein 'normaler' Tiger.",
      title: "Kein Bengaltiger!",
      triggers: ["tiger", "löwe", "leopard"]
    }
  ],
  customHints: [
    {
      id: "saebelzahnkatze_schwaeche",
      type: HintType.CUSTOM,
      title: "Ihre Schwachstelle",
      content: "Die langen Zähne waren sehr empfindlich und konnten leicht abbrechen, weshalb sie erst eingesetzt wurden, wenn das Opfer am Boden lag.",
      cost: 1,
    }
  ]
};

const mammut: QuestionBase = {
  id: 5,
  answer: "Mammut",
  title: "Der behaarte Gigant",
  images: {
    imageUrl: require("./mammut.webp"),
  },
  funFact:
    "Als die **Pyramiden von Gizeh** gebaut wurden (ca. 2500 v. Chr.), lebten die letzten Wollhaarmammuts auf der entlegenen Wrangelinsel im Arktischen Ozean noch!",
  autoFreeHints: [
    {
      id: "mammut_h1",
      type: HintType.AUTO_FREE,
      content: "Dieses ausgestorbene, riesige Säugetier war eng mit dem heutigen **Elefanten** verwandt.",
      triggerAfterAttempts: 3
    },
    {
      id: "mammut_h2",
      type: HintType.AUTO_FREE,
      content: "Das **Wollhaarmammut** war durch ein dichtes Fell und sehr lange, gebogene Stoßzähne an das Leben in der **Eiszeit** angepasst.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "elefant_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte hat dichtes Fell und sehr stark gekrümmte Stoßzähne; er lebte in der Kälte.",
      title: "Falsche 'Dickhäuter'!",
      triggers: ["elefant", "nashorn"]
    }
  ],
  customHints: [
    {
      id: "mammut_dna",
      type: HintType.CUSTOM,
      title: "Wiederbelebung?",
      content: "Wissenschaftler arbeiten daran, die DNA dieser Tiere zu nutzen, um sie durch Klonen mit Elefanten-DNA 'wiederzubeleben'.",
      cost: 1,
    }
  ]
};

const beutelwolf: QuestionBase = {
  id: 6,
  answer: "Beutelwolf",
  title: "Der tasmanische Tiger",
  images: {
    imageUrl: require("./beutelwolf.webp"),
  },
  alternativeAnswers: ["Tasmanischer Tiger", "Tasmanischer Wolf", "Beuteltiger"],
  funFact:
    "Trotz seines Aussehens ist er kein Wolf oder Tiger, sondern das größte fleischfressende **Beuteltier** der Neuzeit. Er konnte sein Maul bis zu 90 Grad aufklappen.",
  autoFreeHints: [
    {
      id: "beutelwolf_h1",
      type: HintType.AUTO_FREE,
      content: "Dieses Raubtier war ursprünglich auf dem australischen Festland und bis ins 20. Jahrhundert auf **Tasmanien** beheimatet.",
      triggerAfterAttempts: 3
    },
    {
      id: "beutelwolf_h2",
      type: HintType.AUTO_FREE,
      content: "Sein auffälligstes Merkmal waren die **dunklen Querstreifen** am unteren Rücken und Schwanzansatz, die ihm den Beinamen **'Tiger'** gaben.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "dingo_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist ein Beuteltier und hat Streifen; er wurde wahrscheinlich durch den Dingo vom australischen Festland verdrängt.",
      title: "Kein Dingo!",
      triggers: ["dingo", "wolf", "schakal"]
    }
  ],
  customHints: [
    {
      id: "beutelwolf_letztes",
      type: HintType.CUSTOM,
      title: "Das offizielle Ende",
      content: "Das letzte bekannte Exemplar starb 1936 im Zoo von **Hobart**.",
      cost: 1,
    }
  ]
};

const elefantenVogel: QuestionBase = {
  id: 7,
  answer: "Elefantenvogel",
  title: "Der größte Vogel aller Zeiten",
  images: {
    imageUrl: require("./elefantenvogel.webp"),
  },
  alternativeAnswers: ["Madagaskar-Strauß", "Vorompatras"],
  funFact:
    "Er gilt als der **größte Vogel der Weltgeschichte**. Er war bis zu drei Meter groß und wog bis zu 500 Kilogramm.",
  autoFreeHints: [
    {
      id: "elefantenvogel_h1",
      type: HintType.AUTO_FREE,
      content: "Dieser **flugunfähige Laufvogel** war ausschließlich auf der Insel **Madagaskar** beheimatet und starb vermutlich im 13. bis 17. Jahrhundert aus.",
      triggerAfterAttempts: 3
    },
    {
      id: "elefantenvogel_h2",
      type: HintType.AUTO_FREE,
      content: "Er legte das **größte Vogelei** der Welt, das einem Volumen von etwa 100 Hühnereiern entsprach.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "strauss_trigger_2",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte war doppelt so groß und schwer wie der heutige Strauß und lebte in Madagaskar.",
      title: "Der Superlativ!",
      triggers: ["strauß", "rhea", "kasuar"]
    }
  ],
  customHints: [
    {
      id: "elefantenvogel_ei",
      type: HintType.CUSTOM,
      title: "Begehrte Eier",
      content: "Ein einzelnes Ei ist heute ein begehrtes und extrem teures Sammelobjekt.",
      cost: 1,
    }
  ]
};

const goldkroete: QuestionBase = {
  id: 8,
  answer: "Goldkröte",
  title: "Der leuchtende Bote",
  images: {
    imageUrl: require("./goldkroete.webp"),
  },
  funFact:
    "Die Art wurde erst **Mitte der 1960er-Jahre entdeckt** und nur 20 Jahre später letztmalig gesichtet. Sie ist ein Symbol für das globale Amphibiensterben.",
  autoFreeHints: [
    {
      id: "goldkroete_h1",
      type: HintType.AUTO_FREE,
      content: "Dieser kleine **Froschlurch** war nur in einem winzigen Gebiet im **Monteverde-Nebelwald von Costa Rica** beheimatet.",
      triggerAfterAttempts: 3
    },
    {
      id: "goldkroete_h2",
      type: HintType.AUTO_FREE,
      content: "Die Männchen waren durch eine einzigartige, **leuchtend gelb-orange Farbe** gekennzeichnet.",
      triggerAfterAttempts: 6
    }
  ],
  contextualHints: [
    {
      id: "frosch_trigger",
      type: HintType.CONTEXTUAL,
      content: "Der gesuchte ist eine Kröte mit rauer, trockener Haut und keine 'glatte' Froschart.",
      title: "Kein Laubfrosch!",
      triggers: ["frosch", "laubfrosch"]
    }
  ],
  customHints: [
    {
      id: "goldkroete_sterben",
      type: HintType.CUSTOM,
      title: "Aussterbeursache",
      content: "Als Hauptgrund für ihr Verschwinden werden der **Klimawandel** und eine Pilzerkrankung (**Chytridiomykose**) vermutet.",
      cost: 1,
    }
  ]
};

const ausgestorbeneTiere: QuestionBase[] = [
  dodo,
  quagga,
  trilobit,
  saebelzahnkatze,
  mammut,
  beutelwolf,
  elefantenVogel,
  goldkroete,
];

export const ausgestorbeneTiereQuiz: Quiz = {
  id: "ausgestorbeneTiere",
  title: "Ausgestorbene Tiere",
  questions: ausgestorbeneTiere,
  titleImage: require("./mammut.webp"),
  description: "Erinnere dich an die Tiere, die nicht mehr unter uns sind.",
};