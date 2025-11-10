import { HintType, type QuestionBase, type Quiz } from "@/src/quiz";

const wildschwein: QuestionBase = {
  id: 1,
  answer: "Wildschwein",
  images: {
    imageUrl: require("./wildschwein.webp"),
    unsolvedImageUrl: require("./wildschwein_unsolved.webp"),
  },
  alternativeAnswers: ["Schwarzwild", "Schwarzkittel"],
  funFact: "Wildschweine haben einen der besten Geruchssinne im Tierreich; er ist so gut, dass sie in der Lage sind, Trüffel und sogar Drogen unter der Erde zu finden.",
  autoFreeHints: [
    {
      id: "wildschwein_h1",
      type: HintType.AUTO_FREE,
      content: "Die Jungen dieser Tiere werden 'Frischlinge' genannt und sind an ihren hellen Längsstreifen zu erkennen.",
      triggerAfterAttempts: 3
    },
    {
      id: "wildschwein_h2",
      type: HintType.AUTO_FREE,
      content: "Sie leben in Familienverbänden, die 'Rotten' genannt werden.",
      triggerAfterAttempts: 6
    },
    {
      id: "wildschwein_h3",
      type: HintType.AUTO_FREE,
      content: "Die männlichen Tiere, 'Keiler' genannt, nutzen ihre spitzen Hauer zur Verteidigung und in Rangkämpfen.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "hausschwein",
      type: HintType.CONTEXTUAL,
      content: "Fast! Der gesuchte ist die wilde, europäische Urform und hat ein borstiges, dunkles Fell.",
      title: "Zu zahm!",
      triggers: ["hausschwein", "schwein"]
    },
    {
      id: "pekar",
      type: HintType.CONTEXTUAL,
      content: "Dieser Verwandte lebt in Amerika. Der gesuchte ist in ganz Europa heimisch.",
      title: "Falscher Kontinent!",
      triggers: ["pekar", "nabelschwein"]
    }
  ],
  customHints: [
    {
      id: "habitat",
      type: HintType.CUSTOM,
      title: "Aktivität",
      content: "Dieses Tier ist überwiegend dämmerungs- und nachtaktiv.",
      cost: 1,
    },
    {
      id: "jagd",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Es ist ein Allesfresser, der seine Nahrung (Wurzeln, Insekten, Aas) hauptsächlich durch Wühlen findet.",
      cost: 1,
    }
  ]
};

const fuchs: QuestionBase = {
  id: 2,
  answer: "Fuchs",
  title: "Meister Reinecke",
  images: {
    imageUrl: require("./rotfuchs.webp"),
    unsolvedImageUrl: require("./rotfuchs_unsolved.webp"),
  },
  alternativeAnswers: ["Rotfuchs"],
  wikipediaName: "Fuchs_(Raubtier)",
  funFact: "Der Fuchs kann das leise Quieken einer Maus selbst unter einer dicken Schneedecke aus über 100 Metern Entfernung hören und sie dann mit einem charakteristischen Sprung (dem 'Mäusesprung') fangen.",
  autoFreeHints: [
    {
      id: "rotfuchs_h1",
      type: HintType.AUTO_FREE,
      content: "Er gehört zur Familie der Hundeartigen, hat aber eine gewisse Ähnlichkeit mit Katzen, wie z.B. die elliptischen Pupillen.",
      triggerAfterAttempts: 3
    },
    {
      id: "rotfuchs_h2",
      type: HintType.AUTO_FREE,
      content: "Er ist überwiegend dämmerungs- und nachtaktiv und lebt in selbst gegrabenen oder von Dachsen übernommenen Bauen.",
      triggerAfterAttempts: 6
    },
    {
      id: "rotfuchs_h3",
      type: HintType.AUTO_FREE,
      content: "Sein buschiger Schwanz ('Lunte' genannt) dient ihm als Steuerruder beim Laufen und als Wärmespeicher im Winter.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "wolf",
      type: HintType.CONTEXTUAL,
      content: "Zu groß und zu gesellig! Dieser gesuchte Jäger ist ein kleiner Einzelgänger.",
      title: "Falscher Hundeartiger!",
      triggers: ["wolf"]
    },
    {
      id: "marderhund",
      type: HintType.CONTEXTUAL,
      content: "Ähnliche Größe und Farbe, aber dieser trägt eine auffällige 'Gesichtsmaske' und ist eine invasive Art.",
      title: "Falsche Maske!",
      triggers: ["marderhund"]
    }
  ],
  customHints: [
    {
      id: "ende",
      type: HintType.CUSTOM,
      title: "Aussehen",
      content: "Fast alle Exemplare haben eine charakteristische weiße Schwanzspitze.",
      cost: 1,
    },
    {
      id: "geschwindigkeit",
      type: HintType.CUSTOM,
      title: "Fähigkeit",
      content: "Dieser schnelle Läufer kann auf kurzer Distanz Geschwindigkeiten von bis zu 55 km/h erreichen.",
      cost: 1,
    }
  ]
};

const wolf: QuestionBase = {
  id: 3,
  answer: "Wolf",
  title: "Isegrim",
  images: {
    imageUrl: require("./wolf.webp"),
  },
  funFact: "Wölfe sind sehr ausdauernd: Auf der Suche nach Beute legen sie durchschnittlich 40 Kilometer pro Tag zurück. Bei der Abwanderung zur Reviersuche können es sogar bis zu 70 Kilometer sein.",
  autoFreeHints: [
    {
      id: "wolf_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist der größte Vertreter der Hundeartigen in Europa und der direkte Vorfahre aller Haushunde.",
      triggerAfterAttempts: 3
    },
    {
      id: "wolf_h2",
      type: HintType.AUTO_FREE,
      content: "Diese Tiere leben in streng hierarchischen Familienverbänden, den sogenannten 'Rudeln'.",
      triggerAfterAttempts: 6
    },
    {
      id: "wolf_h3",
      type: HintType.AUTO_FREE,
      content: "Wissenschaftler bezeichnen ihn oft als 'Gesundheitspolizei', da er vorzugsweise kranke, alte oder schwache Huftiere jagt.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "hund",
      type: HintType.CONTEXTUAL,
      content: "Zu domestiziert! Der gesuchte lebt wild in den Wäldern und ist viel scheuer.",
      title: "Zu zahm!",
      triggers: ["hund"]
    },
    {
      id: "schakal",
      type: HintType.CONTEXTUAL,
      content: "Ein kleinerer Verwandter, der erst in den letzten Jahren wieder in Europa aufgetaucht ist. Er ist schlanker und lebt eher in Einzelpaaren.",
      title: "Zu klein!",
      triggers: ["schakal", "golddschakal"]
    },
    {
      id: "luchs",
      type: HintType.CONTEXTUAL,
      content: "Falsche Art! Der gesuchte ist kein Lauerjäger, sondern ein ausdauernder Hetzjäger.",
      title: "Keine Katze!",
      triggers: ["luchs"]
    }
  ],
  customHints: [
    {
      id: "kommunikation",
      type: HintType.CUSTOM,
      title: "Klang",
      content: "Das Heulen dient nicht dazu, den Mond anzuheulen, sondern der Kommunikation über weite Distanzen.",
      cost: 1,
    },
    {
      id: "revier",
      type: HintType.CUSTOM,
      title: "Verhalten",
      content: "Das Tier markiert sein großes Revier mit Urin und Kot, um fremde Artgenossen fernzuhalten.",
      cost: 1,
    }
  ]
};

const hase: QuestionBase = {
  id: 4,
  answer: "Hase",
  title: "Meister Lampe",
  images: {
    imageUrl: require("./feldhase.webp"),
    unsolvedImageUrl: require("./feldhase_unsolved.webp"),
  },
  wikipediaName: "Feldhase",
  alternativeAnswers: ["Feldhase"],
  funFact: "Bei Gefahr verharrt der Feldhase zunächst regungslos in seiner Mulde ('Sasse') und flieht erst im letzten Moment in einem Zick-Zack-Kurs mit bis zu 70 km/h.",
  autoFreeHints: [
    {
      id: "feldhase_h1",
      type: HintType.AUTO_FREE,
      content: "Seine sehr langen Ohren werden in der Jägersprache 'Löffel' genannt und haben an der Spitze einen schwarzen Fleck.",
      triggerAfterAttempts: 3
    },
    {
      id: "feldhase_h2",
      type: HintType.AUTO_FREE,
      content: "Im Gegensatz zu seinen kleinen Verwandten gräbt er keine Baue, sondern lebt in einer flachen Bodenmulde (Sasse) in der offenen Landschaft.",
      triggerAfterAttempts: 6
    },
    {
      id: "feldhase_h3",
      type: HintType.AUTO_FREE,
      content: "Die Jungen werden mit Fell und sehend geboren und sind sofort relativ selbstständig (Nestflüchter).",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "wildkaninchen",
      type: HintType.CONTEXTUAL,
      content: "Zu klein! Und dieser Verwandte lebt in großen Kolonien unter der Erde (Baue). Der gesuchte ist ein Einzelgänger.",
      title: "Falscher Hoppler!",
      triggers: ["wildkaninchen", "kaninchen"]
    },
    {
      id: "alpenschneehase",
      type: HintType.CONTEXTUAL,
      content: "Dieser Verwandte lebt in den Bergen und wechselt im Winter seine Fellfarbe komplett zu weiß.",
      title: "Falscher Lebensraum!",
      triggers: ["alpenschneehase", "schneehase"]
    }
  ],
  customHints: [
    {
      id: "hinterfuss",
      type: HintType.CUSTOM,
      title: "Besonderheit",
      content: "Seine kräftigen Hinterfüße sind extrem lang, was ihm seine enorme Sprintgeschwindigkeit ermöglicht.",
      cost: 1,
    },
    {
      id: "sehen",
      type: HintType.CUSTOM,
      title: "Sinne",
      content: "Die seitlich stehenden Augen ermöglichen ihm einen fast lückenlosen Rundumblick, um Feinde früh zu erkennen.",
      cost: 1,
    }
  ]
};

const braunbaer: QuestionBase = {
  id: 5,
  answer: "Braunbär",
  title: "Meister Petz",
  images: {
    imageUrl: require("./braunbaer.webp"),
    unsolvedImageUrl: require("./braunbaer_unsolved.webp"),
  },
  alternativeAnswers: ["Europäischer Braunbär"],
  funFact: "Bei der Geburt wiegt ein Braunbärenjunges kaum mehr als eine Tafel Schokolade (ca. 100–500 Gramm) und ist blind, obwohl die Mutter selbst bis zu 400 kg wiegen kann.",
  autoFreeHints: [
    {
      id: "braunbaer_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist der größte und schwerste Raubtier auf dem europäischen Kontinent.",
      triggerAfterAttempts: 3
    },
    {
      id: "braunbaer_h2",
      type: HintType.AUTO_FREE,
      content: "An seinem Nacken und auf den Schultern hat er einen charakteristischen, auffälligen Buckel.",
      triggerAfterAttempts: 6
    },
    {
      id: "braunbaer_h3",
      type: HintType.AUTO_FREE,
      content: "Er hält im Winter eine 'Winterruhe', die weniger tief ist als ein echter Winterschlaf, und ernährt sich hauptsächlich von seiner angefressenen Fettschicht.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "eisbaer",
      type: HintType.CONTEXTUAL,
      content: "Zu weiß und zu arktisch! Der gesuchte ist ein Waldbewohner mit braunem Fell.",
      title: "Falsche Farbe!",
      triggers: ["eisbaer"]
    },
    {
      id: "schwarzbaer",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Dieser lebt in Nordamerika. Der gesuchte ist der heimische europäische Bär.",
      title: "Zu amerikanisch!",
      triggers: ["schwarzbaer"]
    },
    {
      id: "genauer_trigger",
      type: HintType.CONTEXTUAL,
      content: "Aber die Lösung ist etwas genauer.",
      title: "Nicht falsch",
      triggers: ["bär"]
    }
  ],
  customHints: [
    {
      id: "sohle",
      type: HintType.CUSTOM,
      title: "Fortbewegung",
      content: "Er ist ein Sohlengänger und kann sich kurzzeitig auf die Hinterbeine stellen.",
      cost: 1,
    },
    {
      id: "ernaehrung",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Trotz seiner Klassifizierung als Raubtier ernährt er sich überwiegend vegetarisch (Beeren, Nüsse, Wurzeln).",
      cost: 1,
    }
  ]
};

const eichhoernchen: QuestionBase = {
  id: 6,
  answer: "Eichhörnchen",
  title: "Baumturner",
  images: {
    imageUrl: require("./eichhoernchen.webp"),
    unsolvedImageUrl: require("./eichhoernchen_unsolved.webp"),
  },
  alternativeAnswers: ["Eurasisches Eichhörnchen"],
  funFact: "Entgegen der allgemeinen Annahme vergessen Eichhörnchen jedes Jahr Tausende ihrer versteckten Nüsse. Das ist aber wichtig, da so unabsichtlich neue Bäume wachsen.",
  autoFreeHints: [
    {
      id: "eichhoernchen_h1",
      type: HintType.AUTO_FREE,
      content: "Seine auffälligsten Merkmale sind der buschige Schwanz und die kleinen Haarpinsel an den Ohren, die im Winter besonders ausgeprägt sind.",
      triggerAfterAttempts: 3
    },
    {
      id: "eichhoernchen_h2",
      type: HintType.AUTO_FREE,
      content: "Der buschige Schwanz dient ihm als Steuerruder beim Springen und als Bremse oder Fallschirm beim Fallen.",
      triggerAfterAttempts: 6
    },
    {
      id: "eichhoernchen_h3",
      type: HintType.AUTO_FREE,
      content: "Sein kugelförmiges Nest aus Zweigen und Moos wird 'Kobel' genannt.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "grauhoernchen",
      type: HintType.CONTEXTUAL,
      content: "Vorsicht! Dieser ist eine invasive Art, die den heimischen Verwandten in einigen Gebieten verdrängt, ist aber viel grauer und hat keine Ohrpinsel.",
      title: "Zu grau!",
      triggers: ["grauhoernchen"]
    },
    {
      id: "siebenschlaefer",
      type: HintType.CONTEXTUAL,
      content: "Zu nachtaktiv und zu klein. Dieser Verwandte hält den längsten Winterschlaf aller europäischen Säugetiere.",
      title: "Schläft zu lang!",
      triggers: ["siebenschlaefer"]
    }
  ],
  customHints: [
    {
      id: "farbe",
      type: HintType.CUSTOM,
      title: "Aussehen",
      content: "Die Fellfarbe variiert stark von hellrot bis fast schwarz, der Bauch ist jedoch immer weiß.",
      cost: 1,
    },
    {
      id: "aktivitaet",
      type: HintType.CUSTOM,
      title: "Winter",
      content: "Er hält keine Winterschlaf, sondern Winterruhe, und ist daher an milden Tagen auf Futtersuche.",
      cost: 1,
    }
  ]
};

const elch: QuestionBase = {
  id: 7,
  answer: "Elch",
  title: "König der Wälder",
  images: {
    imageUrl: require("./elch.webp"),
    unsolvedImageUrl: require("./elch_unsolved.webp"),
  },
  funFact: "Entgegen alter römischer Überlieferungen können Elche sehr wohl ihre Knie beugen. Sie sind außerdem hervorragende Schwimmer und können weite Strecken zurücklegen, da sie Schwimmhäute zwischen den Hufen haben.",
  autoFreeHints: [
    {
      id: "elch_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist die größte lebende Hirschart der Welt und kann eine Schulterhöhe von über zwei Metern erreichen.",
      triggerAfterAttempts: 3
    },
    {
      id: "elch_h2",
      type: HintType.AUTO_FREE,
      content: "Die Bullen tragen ein mächtiges, meist schaufelförmiges Geweih, das bis zu 2 Meter breit und 40 Kilogramm schwer werden kann.",
      triggerAfterAttempts: 6
    },
    {
      id: "elch_h3",
      type: HintType.AUTO_FREE,
      content: "Sein auffälligstes Merkmal ist die lange, hängende Oberlippe und der 'Bart' (der Kehlsack) unter dem Hals.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "rothirsch",
      type: HintType.CONTEXTUAL,
      content: "Zu klein! Der gesuchte ist viel größer und hat ein verzweigtes Schaufelgeweih, nicht ein Stangengeweih.",
      title: "Falsches Geweih!",
      triggers: ["rothirsch"]
    },
    {
      id: "rentier",
      type: HintType.CONTEXTUAL,
      content: "Dieser Verwandte lebt weiter nördlich und trägt Geweihe mit langen Stangen. Beim gesuchten Tier tragen nur die Bullen ein Geweih.",
      title: "Zu viele Geweihträger!",
      triggers: ["rentier", "karibu"]
    }
  ],
  customHints: [
    {
      id: "nahrung",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Seine lange Oberlippe hilft ihm, Blätter und Triebe von Büschen und Bäumen abzureißen.",
      cost: 1,
    },
    {
      id: "lebensraum",
      type: HintType.CUSTOM,
      title: "Habitat",
      content: "Er bevorzugt sumpfige Waldgebiete und hält sich oft in der Nähe von Wasser auf.",
      cost: 1,
    }
  ]
};

const dachs: QuestionBase = {
  id: 8,
  answer: "Dachs",
  title: "Grimbart",
  images: {
    imageUrl: require("./dachs.webp"),
  },
  alternativeAnswers: ["Europäischer Dachs"],
  funFact: "Der Bau eines Dachses kann über viele Jahrzehnte von Generationen bewohnt werden und zu einem riesigen unterirdischen Labyrinth ('Dachsburg') mit mehreren Etagen und vielen Ein- und Ausgängen werden.",
  autoFreeHints: [
    {
      id: "dachs_h1",
      type: HintType.AUTO_FREE,
      content: "Er ist leicht an seiner markanten Kopfzeichnung zu erkennen: ein weißer Kopf mit zwei breiten schwarzen Streifen über den Augen.",
      triggerAfterAttempts: 3
    },
    {
      id: "dachs_h2",
      type: HintType.AUTO_FREE,
      content: "In Fabeln und Jägerkreisen wird er oft 'Grimbart' genannt.",
      triggerAfterAttempts: 6
    },
    {
      id: "dachs_h3",
      type: HintType.AUTO_FREE,
      content: "Er gehört zur Familie der Marder, ist aber kräftiger gebaut und hält im Winter Winterruhe.",
      triggerAfterAttempts: 9
    },
  ],
  contextualHints: [
    {
      id: "skunk",
      type: HintType.CONTEXTUAL,
      content: "Falscher Kontinent! Dieser hat eine ähnliche Schwarz-Weiß-Färbung, lebt aber in Amerika und ist für seine Stinkdrüsen berüchtigt.",
      title: "Zu amerikanisch!",
      triggers: ["skunk"]
    },
    {
      id: "frettchen",
      type: HintType.CONTEXTUAL,
      content: "Zu schlank! Der gesuchte ist viel massiger und lebt unter der Erde, nicht in Bäumen.",
      title: "Zu marderartig!",
      triggers: ["frettchen", "iltis"]
    }
  ],
  customHints: [
    {
      id: "gemeinschaft",
      type: HintType.CUSTOM,
      title: "Wohnen",
      content: "Er lebt oft friedlich mit Füchsen zusammen im selben Bau ('Wohngemeinschaft').",
      cost: 1,
    },
    {
      id: "ernaehrung",
      type: HintType.CUSTOM,
      title: "Ernährung",
      content: "Seine Leibspeise sind Regenwürmer, aber er frisst auch Insekten, Schnecken, Mäuse und Beeren.",
      cost: 1,
    }
  ]
};

const tiereEuropas: QuestionBase[] = [
  wildschwein,
  fuchs,
  wolf,
  hase,
  braunbaer,
  eichhoernchen,
  elch,
  dachs,
];

export const europaQuiz: Quiz = {
  id: "europa",
  title: "Europa",
  questions: tiereEuropas,
  titleImage: require("./wolf.webp"),
  description: "Entdecke die heimische Tierwelt Europas mit diesem Quiz.",
};